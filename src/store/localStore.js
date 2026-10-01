import { readStoredJSON, writeStoredJSON } from '../platform/storage';

/**
 * Persistent storage helpers for Task Buddy. Native builds use Capacitor
 * Preferences while web builds retain localStorage compatibility.
 *
 * Keys:
 *   task-buddy:routines/v1         { [routineType]: TaskRow[] }
 *   task-buddy:custom-routines/v1  Routine[]   ({ id, name, emoji, tasks })
 *   task-buddy:rewards/v1          { [rewardId]: lastShownAtISO }
 *
 * Any new key must also be added to NATIVE_STORAGE_KEYS in platform/storage.js,
 * otherwise native builds never load it at launch.
 */

const KEYS = {
  routines:        'task-buddy:routines/v1',
  custom:          'task-buddy:custom-routines/v1',
  rewards:         'task-buddy:rewards/v1',
  lastBuddy:       'task-buddy:last-buddy',
  lastRoutine:     'task-buddy:last-routine',
  hasCompletedRun: 'task-buddy:has-completed-run',
  configuredRewards: 'taskbuddy_rewards',
  rewardsEnabled: 'taskbuddy_rewards_enabled',
  setupComplete: 'task-buddy:setup-complete',
};

function safeRead(key, fallback) {
  return readStoredJSON(key, fallback);
}

function safeWrite(key, value) {
  writeStoredJSON(key, value);
}

// ── Saved tasks per built-in routine type ─────────────────────────────
export function readSavedRoutineTasks(routineType) {
  const all = safeRead(KEYS.routines, {});
  return Array.isArray(all[routineType]) ? all[routineType] : null;
}

export function writeSavedRoutineTasks(routineType, taskRows) {
  const all = safeRead(KEYS.routines, {});
  all[routineType] = taskRows;
  safeWrite(KEYS.routines, all);
}

// ── Custom routines ───────────────────────────────────────────────────
export function readCustomRoutines() {
  const list = safeRead(KEYS.custom, []);
  return Array.isArray(list) ? list : [];
}

export function writeCustomRoutines(list) {
  safeWrite(KEYS.custom, list);
}

export function createCustomRoutineLocal(id, name, emoji) {
  const list = readCustomRoutines();
  const next = [{ id, name, emoji, tasks: [], created_at: new Date().toISOString() }, ...list];
  writeCustomRoutines(next);
  return next[0];
}

export function deleteCustomRoutineLocal(routineId) {
  const list = readCustomRoutines().filter((r) => r.id !== routineId);
  writeCustomRoutines(list);
}

export function readCustomRoutineTasks(routineId) {
  const found = readCustomRoutines().find((r) => r.id === routineId);
  return found && Array.isArray(found.tasks) ? found.tasks : null;
}

export function writeCustomRoutineTasks(routineId, taskRows) {
  const list = readCustomRoutines();
  const idx = list.findIndex((r) => r.id === routineId);
  if (idx === -1) return;
  list[idx] = { ...list[idx], tasks: taskRows };
  writeCustomRoutines(list);
}

// ── Reward shown-state ────────────────────────────────────────────────
export function readShownRewards() {
  return safeRead(KEYS.rewards, {});
}

export function markRewardShownLocal(rewardId) {
  const map = readShownRewards();
  map[rewardId] = new Date().toISOString();
  safeWrite(KEYS.rewards, map);
}

export function readConfiguredRewards(fallback) {
  const rewards = safeRead(KEYS.configuredRewards, fallback);
  return Array.isArray(rewards) ? rewards : fallback;
}

export function writeConfiguredRewards(rewards) {
  safeWrite(KEYS.configuredRewards, rewards);
}

export function readRewardsEnabled() {
  return safeRead(KEYS.rewardsEnabled, true) !== false;
}

export function writeRewardsEnabled(enabled) {
  safeWrite(KEYS.rewardsEnabled, Boolean(enabled));
}

// ── Returning-user fast path ──────────────────────────────────────────
export function readFastPath() {
  return {
    lastBuddy:       safeRead(KEYS.lastBuddy, null),
    lastRoutine:     safeRead(KEYS.lastRoutine, null),
    hasCompletedRun: safeRead(KEYS.hasCompletedRun, false),
  };
}

export function writeFastPath({ buddy, routine }) {
  if (buddy)   safeWrite(KEYS.lastBuddy, buddy);
  if (routine) safeWrite(KEYS.lastRoutine, routine);
}

export function markCompletedRun() {
  safeWrite(KEYS.hasCompletedRun, true);
}

// ── First-run parent setup ────────────────────────────────────────────
export function readSetupComplete() {
  return safeRead(KEYS.setupComplete, false) === true;
}

export function markSetupComplete() {
  safeWrite(KEYS.setupComplete, true);
}
