import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRoutineStore } from './useRoutineStore';

const task = {
  id: 'test-task',
  title: 'Test task',
  durationMinutes: 1,
  itemEmoji: '⭐',
  itemLabel: 'Test',
  svgGroup: 'question-mark',
  themeColor: '#9D8AAE',
  task_type_key: 'test-task',
};

describe('routine timer state', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-03T12:00:00Z'));
    useRoutineStore.setState({
      screen: 'setup',
      tasks: [task],
      currentTaskIndex: 0,
      timeLeft: 60,
      totalTime: 60,
      isRunning: false,
      timerInterval: null,
      timerEndsAt: null,
      rexState: 'idle',
    });
  });

  afterEach(() => {
    const interval = useRoutineStore.getState().timerInterval;
    if (interval) clearInterval(interval);
    vi.useRealTimers();
  });

  it('uses an absolute deadline and becomes hungry after elapsed background time', () => {
    useRoutineStore.getState().startRoutine();
    expect(useRoutineStore.getState().timerEndsAt).toBe(Date.now() + 60_000);

    vi.setSystemTime(new Date('2026-09-03T12:01:01Z'));
    useRoutineStore.getState().tick();

    expect(useRoutineStore.getState()).toMatchObject({
      timeLeft: 0,
      isRunning: false,
      timerEndsAt: null,
      rexState: 'hungry',
    });
  });

  it('lets Done feed in one tap: doneEarly is synchronous, so feedRex sees hungry straight away', () => {
    useRoutineStore.getState().startRoutine();
    useRoutineStore.getState().doneEarly();
    useRoutineStore.getState().feedRex();
    expect(useRoutineStore.getState()).toMatchObject({ rexState: 'eating', isRunning: false, timerInterval: null });
  });

  it('recalculates and preserves remaining time across pause and resume', () => {
    useRoutineStore.getState().startRoutine();
    vi.setSystemTime(new Date('2026-09-03T12:00:10Z'));

    useRoutineStore.getState().pauseRoutine();
    expect(useRoutineStore.getState()).toMatchObject({
      timeLeft: 50,
      isRunning: false,
      timerEndsAt: null,
    });

    useRoutineStore.getState().resumeRoutine();
    expect(useRoutineStore.getState()).toMatchObject({
      isRunning: true,
      timerEndsAt: Date.now() + 50_000,
    });
  });
});
