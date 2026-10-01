import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const NATIVE_STORAGE_KEYS = [
  'routine-timer-state',
  'task-buddy:routines/v1',
  'task-buddy:custom-routines/v1',
  'task-buddy:rewards/v1',
  'task-buddy:last-buddy',
  'task-buddy:last-routine',
  'task-buddy:has-completed-run',
  'taskbuddy_rewards',
  'taskbuddy_rewards_enabled',
  'task-buddy:setup-complete',
];

const isNative = Capacitor.isNativePlatform();
const values = new Map();
const pendingWrites = new Map();
let flushTimer = null;
let initialized = false;

function reportStorageError(action, key, error) {
  console.error(`[task-buddy] storage ${action} failed`, key, error);
}

async function persistPendingWrites() {
  if (!isNative || pendingWrites.size === 0) return;

  const writes = [...pendingWrites.entries()];
  pendingWrites.clear();
  await Promise.all(writes.map(async ([key, value]) => {
    try {
      if (value === null) {
        await Preferences.remove({ key });
      } else {
        await Preferences.set({ key, value });
      }
    } catch (error) {
      reportStorageError('write', key, error);
    }
  }));
}

function scheduleNativeFlush() {
  if (!isNative || flushTimer) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void persistPendingWrites();
  }, 250);
}

export async function initializeStorage() {
  if (initialized || typeof window === 'undefined') return;

  if (!isNative) {
    initialized = true;
    return;
  }

  await Promise.all(NATIVE_STORAGE_KEYS.map(async (key) => {
    try {
      const { value } = await Preferences.get({ key });
      const legacyValue = window.localStorage.getItem(key);
      const resolvedValue = value ?? legacyValue;

      if (resolvedValue !== null) {
        values.set(key, resolvedValue);
      }
      if (value === null && legacyValue !== null) {
        await Preferences.set({ key, value: legacyValue });
      }
    } catch (error) {
      reportStorageError('read', key, error);
    }
  }));

  initialized = true;
}

export async function flushStorage() {
  if (flushTimer) {
    window.clearTimeout(flushTimer);
    flushTimer = null;
  }
  await persistPendingWrites();
}

export const persistentStorage = {
  getItem(key) {
    if (typeof window === 'undefined') return null;
    return isNative ? (values.get(key) ?? null) : window.localStorage.getItem(key);
  },

  setItem(key, value) {
    if (typeof window === 'undefined') return;

    if (isNative) {
      values.set(key, value);
      pendingWrites.set(key, value);
      scheduleNativeFlush();
      return;
    }

    window.localStorage.setItem(key, value);
  },

  removeItem(key) {
    if (typeof window === 'undefined') return;

    if (isNative) {
      values.delete(key);
      pendingWrites.set(key, null);
      scheduleNativeFlush();
      return;
    }

    window.localStorage.removeItem(key);
  },
};

export function readStoredJSON(key, fallback) {
  try {
    const raw = persistentStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStoredJSON(key, value) {
  try {
    persistentStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    reportStorageError('write', key, error);
  }
}
