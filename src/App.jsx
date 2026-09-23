/**
 * Task Buddy — standalone orchestrator.
 * Originally extracted from Lovou's BuddyTimerApp.
 */

import { useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useRoutineStore } from './store/useRoutineStore';
import { readFastPath, readCustomRoutines } from './store/localStore';
import CharacterSelection from './pages/CharacterSelection';
import RoutinePicker from './pages/RoutinePicker';
import RoutineSetup from './pages/RoutineSetup';
import ActivePlayer from './pages/ActivePlayer';
import RoutineComplete from './pages/RoutineComplete';
import CustomRoutineList from './pages/CustomRoutineList';
import ParentGate from './pages/ParentGate';
import Settings from './pages/Settings';
import TabBar from './components/TabBar';
import { initializeNativeRuntime } from './platform/nativeRuntime';
import { CHARACTER_IDS } from './data/characters';

const MotionDiv = motion.div;

const SCREENS = {
  selection: CharacterSelection,
  picker: RoutinePicker,
  customList: CustomRoutineList,
  setup: RoutineSetup,
  player: ActivePlayer,
  complete: RoutineComplete,
  settings: Settings,
  parentGate: ParentGate,
};

const SCREEN_DEPTH = {
  selection: 0,
  parentGate: 1,
  settings: 2,
  picker: 1,
  customList: 2,
  setup: 3,
  player: 4,
  complete: 5,
};

const pageTransition = {
  initial: (direction) => ({ opacity: 0, x: 30 * direction }),
  animate: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: -30 * direction }),
  transition: { duration: 0.3, ease: 'easeOut' },
};

export default function App() {
  const screen = useRoutineStore((s) => s.screen);
  const rootRef = useRef(null);
  const prevScreenRef = useRef(screen);
  const direction = (SCREEN_DEPTH[screen] ?? 0) >= (SCREEN_DEPTH[prevScreenRef.current] ?? 0) ? 1 : -1;
  useEffect(() => { prevScreenRef.current = screen; }, [screen]);

  useEffect(() => initializeNativeRuntime(), []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const resetScroll = () => {
      const screenScrollContainer = rootRef.current?.querySelector('[data-buddy-scroll="true"]');
      const scrollContainer = rootRef.current?.parentElement;

      screenScrollContainer?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (screenScrollContainer) screenScrollContainer.scrollTop = 0;

      scrollContainer?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (scrollContainer) scrollContainer.scrollTop = 0;

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frameId);
  }, [screen]);

  // On mount: if the page was reloaded while a routine was running (mobile tab discard),
  // restart the interval from the persisted timerEndsAt.
  // Also: if returning user with a completed run, fast-path to setup screen.
  useEffect(() => {
    const { screen: s, isRunning, timerEndsAt } = useRoutineStore.getState();
    if (s === 'player' && isRunning && timerEndsAt) {
      const remaining = Math.max(0, Math.round((timerEndsAt - Date.now()) / 1000));
      if (remaining <= 0) {
        useRoutineStore.getState().tick();
      } else {
        useRoutineStore.getState()._ensureInterval();
      }
      return;
    }
    if (s === 'selection') {
      const { hasCompletedRun, lastBuddy, lastRoutine } = readFastPath();
      if (hasCompletedRun && CHARACTER_IDS.includes(lastBuddy) && lastRoutine) {
        if (lastRoutine.startsWith('custom:')) {
          const customId = lastRoutine.replace('custom:', '');
          const exists = readCustomRoutines().some((r) => r.id === customId);
          if (!exists) return;
        }
        useRoutineStore.getState().setSelectedCharacter(lastBuddy);
        useRoutineStore.getState().setRoutine(lastRoutine);
      }
    }
  }, []);

  // On unmount: stop the interval but preserve state so the timer can resume on reload.
  useEffect(() => () => {
    const { timerInterval } = useRoutineStore.getState();
    if (timerInterval) clearInterval(timerInterval);
    useRoutineStore.setState({ timerInterval: null });
  }, []);

  const Screen = SCREENS[screen];

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="app-viewport relative h-[100dvh] min-h-0 bg-cream-gradient text-ink overflow-hidden">
        <div className="absolute inset-0 bg-cream-glow pointer-events-none" />
        <div className={`app-safe-area relative max-w-md mx-auto flex h-full min-h-0 w-full flex-col ${screen === 'complete' ? 'wide:max-w-4xl' : ''}`}>
          <AnimatePresence mode="wait" custom={direction}>
            {Screen && (
              <MotionDiv key={screen} custom={direction} variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={pageTransition.transition} className="flex flex-1 min-h-0 flex-col">
                <Screen />
              </MotionDiv>
            )}
          </AnimatePresence>
          <TabBar />
        </div>
      </div>
    </MotionConfig>
  );
}
