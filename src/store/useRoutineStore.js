import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TASK_LIBRARY, DEFAULT_ROUTINE_TASKS, getTaskByKey } from './taskLibrary';
import { persistentStorage } from '../platform/storage';
import {
  readSavedRoutineTasks,
  writeSavedRoutineTasks,
  readCustomRoutineTasks,
  writeCustomRoutineTasks,
  writeFastPath,
  markCompletedRun,
} from './localStore';

/*
 * Routine Timer Store — Zustand state machine.
 * States: setup | idle | hungry | eating | transitioning | complete
 * Persistence: Saved task lists and timer state use the platform storage
 * adapter for reload and native process-death recovery.
 */

const TASK_COLORS = ['#9D8AAE', '#86A4B3', '#C89A63', '#B86F56', '#81906F', '#B68FA1'];
export const PARENT_SCREENS = ['parentGate', 'settings'];

function toRuntimeTask(task, index) {
  const libEntry = getTaskByKey(task.task_type_key || task.key);
  return {
    id: task.id || task.task_type_key || task.key || `task-${index}`,
    title: task.custom_label || task.label || (libEntry?.label) || 'Task',
    durationMinutes: task.duration_minutes || task.durationMinutes || task.defaultMinutes || 2,
    itemEmoji: task.emoji || (libEntry?.emoji) || '⭐',
    itemLabel: libEntry?.label || 'Task',
    svgGroup: task.svgGroup || (libEntry?.svgGroup) || 'question-mark',
    themeColor: TASK_COLORS[index % TASK_COLORS.length],
    task_type_key: task.task_type_key || task.key,
  };
}

function getDefaultTasksForType(type) {
  const keys = DEFAULT_ROUTINE_TASKS[type] || [];
  return keys.map((key, i) => {
    const lib = getTaskByKey(key);
    if (!lib) return null;
    return toRuntimeTask({ ...lib, task_type_key: key }, i);
  }).filter(Boolean);
}

export const useRoutineStore = create(
  persist(
    (set, get) => ({
  screen: 'selection',
  selectedCharacter: 'hoppy',
  routineName: 'Bedtime',
  routineType: 'bedtime',
  tasks: getDefaultTasksForType('bedtime'),
  currentTaskIndex: 0,
  timeLeft: 60,
  totalTime: 60,
  isRunning: false,
  timerInterval: null,
  timerEndsAt: null,
  rexState: 'idle',
  hasSavedRoutine: false,
  customRoutineId: null,
  // Optional action to run once the parent gate is passed, e.g. 'lovou'.
  afterGate: null,
  // Buddy-flow screen to return to when leaving the Parent Area tab.
  returnScreen: null,

  setScreen: (screen) => set({ screen }),

  openParentGate: (afterGate = null) => {
    const { screen, isRunning } = get();
    // Never leave a routine ticking behind the Parent Area.
    if (screen === 'player' && isRunning) get().pauseRoutine();
    const returnScreen = PARENT_SCREENS.includes(screen) ? get().returnScreen : screen;
    set({ screen: 'parentGate', afterGate, returnScreen });
  },

  // Buddy tab: back to wherever the parent flow was entered from.
  leaveParentArea: () => set({ screen: get().returnScreen || 'selection', afterGate: null, returnScreen: null }),

  setSelectedCharacter: (character) => set({ selectedCharacter: character }),

  setRoutine: (type, customName, customRoutineId) => {
    const nameMap = {
      bedtime:  'Bedtime',
      morning:  'Morning',
      homework: 'Homework',
      custom:   customName || 'My Routine',
    };
    const isCustomSaved = type.startsWith('custom:');
    const displayName = isCustomSaved ? (customName || 'Custom') : nameMap[type];

    // Resolve persisted tasks
    let resolved = null;
    let hasSaved = false;
    if (isCustomSaved && customRoutineId) {
      const rows = readCustomRoutineTasks(customRoutineId);
      if (rows && rows.length > 0) {
        resolved = rows.map((row, i) => toRuntimeTask(row, i));
        hasSaved = true;
      }
    } else if (type !== 'custom') {
      const rows = readSavedRoutineTasks(type);
      if (rows && rows.length > 0) {
        resolved = rows.map((row, i) => toRuntimeTask(row, i));
        hasSaved = true;
      }
    }

    if (!resolved) {
      resolved = isCustomSaved ? [] : getDefaultTasksForType(type);
    }

    writeFastPath({ buddy: get().selectedCharacter, routine: type });
    set({
      tasks: resolved,
      routineName: displayName,
      routineType: type,
      screen: 'setup',
      hasSavedRoutine: hasSaved,
      customRoutineId: customRoutineId || null,
    });
  },

  saveRoutine: async () => {
    const { routineType, tasks, customRoutineId } = get();
    if (!routineType) return;
    if (routineType === 'custom' && !customRoutineId) return;
    const taskRows = tasks.map((t) => ({
      task_type_key: t.task_type_key || t.id,
      custom_label: t.title !== getTaskByKey(t.task_type_key)?.label ? t.title : null,
      emoji: t.itemEmoji,
      duration_minutes: t.durationMinutes,
    }));
    if (routineType.startsWith('custom:') && customRoutineId) {
      writeCustomRoutineTasks(customRoutineId, taskRows);
    } else {
      writeSavedRoutineTasks(routineType, taskRows);
    }
    set({ hasSavedRoutine: true });
  },

  setTasks: (tasks) => set({ tasks, hasSavedRoutine: false }),

  setRoutineName: (name) => set({ routineName: name }),

  _ensureInterval: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => { get().tick(); }, 1000);
    set({ timerInterval: interval });
  },

  startRoutine: () => {
    const rawTasks = get().tasks;
    if (rawTasks.length === 0) return;
    const tasks = rawTasks.map((t) => (t.title.trim() ? t : { ...t, title: t.itemLabel || 'Task' }));
    const firstTask = tasks[0];
    const totalSeconds = firstTask.durationMinutes * 60;
    set({
      tasks,
      screen: 'player',
      currentTaskIndex: 0,
      timeLeft: totalSeconds,
      totalTime: totalSeconds,
      isRunning: true,
      timerEndsAt: Date.now() + totalSeconds * 1000,
      rexState: 'idle',
    });
    get()._ensureInterval();
  },

  tick: () => {
    const { timeLeft, isRunning, rexState, timerEndsAt, totalTime } = get();
    if (!isRunning || rexState === 'eating') return;

    const newTime = timerEndsAt
      ? Math.max(0, Math.round((timerEndsAt - Date.now()) / 1000))
      : Math.max(0, timeLeft - 1);

    if (newTime <= 0) {
      const { timerInterval } = get();
      if (timerInterval) clearInterval(timerInterval);
      set({ timeLeft: 0, rexState: 'hungry', isRunning: false, timerInterval: null, timerEndsAt: null });
    } else {
      let newRexState = rexState;
      const boredThreshold = Math.max(30, Math.round(totalTime * 0.2));
      if (newTime < boredThreshold && rexState === 'idle') newRexState = 'bored';
      set({ timeLeft: newTime, rexState: newRexState });
    }
  },

  feedRex: () => {
    const { rexState, timerInterval } = get();
    if (rexState !== 'hungry' && rexState !== 'bored') return;
    if (timerInterval) clearInterval(timerInterval);
    set({ rexState: 'eating', isRunning: false, timerInterval: null, timerEndsAt: null });
  },

  onEatComplete: () => {
    const { currentTaskIndex, tasks, timerInterval } = get();
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex >= tasks.length) {
      if (timerInterval) clearInterval(timerInterval);
      markCompletedRun();
      set({ screen: 'complete', rexState: 'celebrating', isRunning: false, timerInterval: null, timerEndsAt: null });
    } else {
      const nextTask = tasks[nextIndex];
      const totalSeconds = nextTask.durationMinutes * 60;
      set({ currentTaskIndex: nextIndex, timeLeft: totalSeconds, totalTime: totalSeconds, rexState: 'idle', isRunning: true, timerEndsAt: Date.now() + totalSeconds * 1000 });
      get()._ensureInterval();
    }
  },

  resetRoutine: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({ screen: 'selection', currentTaskIndex: 0, timeLeft: 60, totalTime: 60, isRunning: false, timerInterval: null, timerEndsAt: null, rexState: 'idle' });
  },

  cancelRoutine: () => {
    const { timerInterval, tasks } = get();
    if (timerInterval) clearInterval(timerInterval);
    const firstTask = tasks[0];
    const totalSeconds = firstTask ? firstTask.durationMinutes * 60 : 60;
    set({ screen: 'setup', currentTaskIndex: 0, timeLeft: totalSeconds, totalTime: totalSeconds, isRunning: false, timerInterval: null, timerEndsAt: null, rexState: 'idle' });
  },

  pauseRoutine: () => {
    const { rexState, timerInterval } = get();
    if (rexState === 'eating') return;
    get().tick();
    if (timerInterval) clearInterval(timerInterval);
    set({ isRunning: false, timerInterval: null, timerEndsAt: null });
  },

  resumeRoutine: () => {
    const { timeLeft, rexState } = get();
    if (timeLeft <= 0 || rexState === 'hungry' || rexState === 'eating') return;
    set({ isRunning: true, timerEndsAt: Date.now() + timeLeft * 1000 });
    get()._ensureInterval();
  },

  skipTask: () => {
    const { rexState, timerInterval } = get();
    if (rexState === 'eating') return;
    if (timerInterval) clearInterval(timerInterval);
    set({ timeLeft: 0, rexState: 'hungry', isRunning: false, timerInterval: null, timerEndsAt: null });
  },

  doneEarly: () => {
    const { rexState, timerInterval } = get();
    if (rexState !== 'idle' && rexState !== 'bored') return;
    if (timerInterval) clearInterval(timerInterval);
    set({ timeLeft: 0, rexState: 'hungry', isRunning: false, timerInterval: null, timerEndsAt: null });
  },
    }),
    {
      name: 'routine-timer-state',
      storage: createJSONStorage(() => persistentStorage),
      skipHydration: true,
      merge: (persistedState, currentState) => {
        const persistedScreen = persistedState?.screen;
        const inParentArea = PARENT_SCREENS.includes(persistedScreen);
        return {
          ...currentState,
          ...persistedState,
          screen: inParentArea
            ? (persistedState?.returnScreen || 'selection')
            : (persistedScreen ?? currentState.screen),
          returnScreen: null,
          afterGate: null,
        };
      },
      partialize: ({ timerInterval: _timerInterval, ...rest }) => rest,
    }
  )
);

// Re-export library helpers for convenience
export { TASK_LIBRARY };
