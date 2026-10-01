import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRoutineStore } from './useRoutineStore';
import { readSetupComplete } from './localStore';

const reset = (overrides = {}) => useRoutineStore.setState({
  screen: 'selection', afterGate: null, returnScreen: null, manageUnlock: null, firstRun: false,
  isRunning: false, timerInterval: null, ...overrides,
});
const state = () => useRoutineStore.getState();

describe('first-run parent setup', () => {
  beforeEach(() => { window.localStorage.clear(); reset(); });

  it('shows setup on a fresh install and cannot pass without the gate', () => {
    state().enterFirstRunIfNeeded();
    expect(state()).toMatchObject({ screen: 'welcome', firstRun: true });

    state().openParentGate('setup');
    expect(state().screen).toBe('parentGate');
    state().leaveParentArea();
    expect(state().screen).toBe('welcome');

    state().openParentGate('setup');
    state().passParentGate();
    expect(state().screen).toBe('settings');
    expect(readSetupComplete()).toBe(false);

    state().finishFirstRun();
    expect(state()).toMatchObject({ screen: 'selection', firstRun: false });
    expect(readSetupComplete()).toBe(true);
  });

  it('does not reappear once complete', () => {
    state().finishFirstRun();
    reset();
    state().enterFirstRunIfNeeded();
    expect(state()).toMatchObject({ screen: 'selection', firstRun: false });
  });

  it('never interrupts a routine that is already running', () => {
    reset({ screen: 'player', isRunning: true });
    state().enterFirstRunIfNeeded();
    expect(state().screen).toBe('player');
  });

  it('loads the setup flag on native launch', () => {
    // Native storage only preloads listed keys; a missing entry would show setup on every launch.
    const storageSource = readFileSync('src/platform/storage.js', 'utf8');
    expect(storageSource).toContain("'task-buddy:setup-complete'");
  });
});

describe('routine management gating', () => {
  beforeEach(() => { window.localStorage.clear(); reset(); });

  it('Edit Tasks goes through the gate and unlocks only the task editor', () => {
    reset({ screen: 'setup' });
    state().openParentGate('editTasks');
    expect(state()).toMatchObject({ screen: 'parentGate', manageUnlock: null });
    state().passParentGate();
    expect(state()).toMatchObject({ screen: 'setup', manageUnlock: 'tasks' });
  });

  it('relocks as soon as the user leaves the unlocked screen', () => {
    reset({ screen: 'setup', manageUnlock: 'tasks' });
    state().setScreen('picker');
    expect(state().manageUnlock).toBeNull();

    reset({ screen: 'customList', manageUnlock: 'routines' });
    state().openParentGate();
    expect(state().manageUnlock).toBeNull();
  });

  it('creating a routine goes through the gate and keeps the new routine editable', () => {
    reset({ screen: 'customList' });
    state().openParentGate('createRoutine');
    state().passParentGate();
    expect(state()).toMatchObject({ screen: 'customList', manageUnlock: 'routines:create' });
  });

  it('starting a routine needs no gate', () => {
    reset({ screen: 'selection' });
    state().setRoutine('bedtime');
    state().startRoutine();
    expect(state().screen).toBe('player');
    clearInterval(state().timerInterval);
  });

  it('the Lovou link still lands in the Parent Area', () => {
    reset({ screen: 'complete' });
    state().openParentGate('lovou');
    state().passParentGate();
    expect(state().screen).toBe('settings');
  });

  it('does not persist unlocks or first-run state', () => {
    reset({ manageUnlock: 'tasks', firstRun: true });
    const persisted = useRoutineStore.persist.getOptions().partialize(state());
    expect(persisted).not.toHaveProperty('manageUnlock');
    expect(persisted).not.toHaveProperty('firstRun');
  });
});
