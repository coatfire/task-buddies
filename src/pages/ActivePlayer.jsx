import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import ProgressRing from '../components/rex/ProgressRing';
import TaskItemSVG from '../components/rex/TaskItemSVG';
import ParticleBurst from '../components/rex/ParticleBurst';
import { useRoutineStore } from '../store/useRoutineStore';
import { useRootScale } from '../hooks/useRootScale';

const MotionDiv = motion.div;
const MotionButton = motion.button;
const COMPLETED_TASK_COLOR = '#81906F';
// Ring diameter. The tablet values are mirrored in tabletSpriteSize() so the buddy stays ~half the ring.
const RING_CLASS = 'w-[min(65vw,55vh)] h-[min(65vw,55vh)] tablet:w-[min(70vw,38vh,20rem)] tablet:h-[min(70vw,38vh,20rem)] tablet:landscape:w-[min(32vh,20rem)] tablet:landscape:h-[min(32vh,20rem)]';
const PHONE_SPRITE_SIZE = 146;
const tabletSpriteSize = ({ vw, vh, rem }) => {
  const ring = vw > vh ? Math.min(0.32 * vh, 20 * rem) : Math.min(0.7 * vw, 0.38 * vh, 20 * rem);
  return Math.round(ring * 0.5);
};

export default function ActivePlayer() {
  const {
    tasks, currentTaskIndex, timeLeft, totalTime, rexState,
    feedRex, doneEarly, onEatComplete, skipTask,
    pauseRoutine, resumeRoutine, isRunning, selectedCharacter, routineName, cancelRoutine, tick,
  } = useRoutineStore();

  const viewport = useRootScale();
  const spriteSize = viewport.scale === 1 ? PHONE_SPRITE_SIZE : tabletSpriteSize(viewport);
  const currentTask = tasks[currentTaskIndex];
  const isHungry = rexState === 'hungry';
  const isBored = rexState === 'bored';
  const isIdle = rexState === 'idle';
  const isWaiting = isIdle || isBored;

  const characterName = selectedCharacter
    ? selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1)
    : 'Rex';
  const tasksRemaining = Math.max(tasks.length - currentTaskIndex - 1, 0);
  const taskDurationLabel = currentTask?.durationMinutes ? `${currentTask.durationMinutes} min focus` : 'Quick step';

  const [eatPhase, setEatPhase] = useState('none');
  const [isItemFlying, setIsItemFlying] = useState(false);
  const [isItemHidden, setIsItemHidden] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isEatingSequence, setIsEatingSequence] = useState(false);
  const [postChompCelebrating, setPostChompCelebrating] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => { timeoutsRef.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    setEatPhase('none');
    setIsItemFlying(false);
    setIsItemHidden(false);
    setShowParticles(false);
    setIsEatingSequence(false);
    setPostChompCelebrating(false);
  }, [currentTaskIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const syncTimer = () => {
      if (document.visibilityState === 'visible') tick();
    };

    document.addEventListener('visibilitychange', syncTimer);
    window.addEventListener('focus', syncTimer);
    window.addEventListener('pageshow', syncTimer);

    return () => {
      document.removeEventListener('visibilitychange', syncTimer);
      window.removeEventListener('focus', syncTimer);
      window.removeEventListener('pageshow', syncTimer);
    };
  }, [tick]);

  const startEatingSequence = useCallback(() => {
    let wasAlreadyRunning = false;
    setIsEatingSequence((prev) => { wasAlreadyRunning = prev; return true; });
    if (wasAlreadyRunning) return;

    feedRex();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setIsItemFlying(true);
    timeoutsRef.current.push(setTimeout(() => setEatPhase('jaw-open'), 400));
    timeoutsRef.current.push(setTimeout(() => {
      setIsItemHidden(true);
      setEatPhase('chomp');
      setShowParticles(true);
    }, 600));
    timeoutsRef.current.push(setTimeout(() => {
      setShowParticles(false);
      setPostChompCelebrating(true);
    }, 1200));
    timeoutsRef.current.push(setTimeout(() => {
      setEatPhase('none');
      setIsItemFlying(false);
      setIsItemHidden(false);
      setIsEatingSequence(false);
      setPostChompCelebrating(false);
      onEatComplete();
    }, 3000));
  }, [feedRex, onEatComplete]);

  const handleFeed = useCallback(() => {
    if (!isHungry || isEatingSequence) return;
    startEatingSequence();
  }, [isHungry, isEatingSequence, startEatingSequence]);

  const handleDoneEarly = useCallback(() => {
    if (!isWaiting || isEatingSequence) return;
    doneEarly();
  }, [isWaiting, isEatingSequence, doneEarly]);

  const handleCancelRoutine = useCallback(() => {
    setConfirmCancel(false);
    cancelRoutine();
  }, [cancelRoutine]);

  const instructionText = isEatingSequence
    ? `Yum! ${characterName} loved that. Next task coming up...`
    : isHungry
      ? `${characterName} is hungry! Tap the button to feed ${characterName}.`
      : isRunning
        ? `${characterName} is cheering you on. You've got this!`
        : 'Taking a break. Tap Resume when you are ready.';

  return (
    <div className="h-full min-h-0 flex flex-col items-center px-3 pt-1.5 pb-3 sm:px-4 sm:pt-2 sm:pb-4 relative overflow-hidden text-ink">
      <div className="w-full max-w-sm min-h-0 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 z-10 shrink-0 sm:mb-3">
          <button
            onClick={() => setConfirmCancel(true)}
            aria-label="Stop routine"
            className="w-11 h-11 rounded-2xl bg-surface border border-border-card flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-card transition-colors shrink-0 shadow-soft"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex justify-between text-[0.6875rem] font-body text-ink-muted mb-0.5">
              <span className="truncate">{routineName}</span>
              <span className="shrink-0 ml-2">Task {currentTaskIndex + 1} of {tasks.length}</span>
            </div>
            <div className="flex gap-1 w-full">
              {tasks.map((task, i) => {
                const isCompleted = i < currentTaskIndex;
                const isCurrent = i === currentTaskIndex;
                const fillPct = isCurrent && totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
                return (
                  <div key={task.id} className="relative flex-1 h-1.5 rounded-full bg-border-card overflow-hidden">
                    {isCompleted && <div className="absolute inset-0 bg-success rounded-full" />}
                    {isCurrent && <div className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-500" style={{ width: `${fillPct}%` }} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-11 h-11 shrink-0" />
        </div>

        <AnimatePresence mode="wait">
          <MotionDiv
            key={currentTask?.id}
            className="text-center mb-2 z-10 shrink-0 sm:mb-3 tablet:mt-auto"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="hidden items-center gap-2 rounded-full border border-border-card bg-surface px-3 py-1 text-[0.6875rem] font-body text-ink-muted mb-2 sm:inline-flex sm:text-xs sm:mb-3 tablet:landscape:hidden">
              <span>{currentTask?.itemEmoji}</span>
              <span>{taskDurationLabel}</span>
              {tasksRemaining > 0 ? <span>· {tasksRemaining} left after this</span> : <span>· final step</span>}
            </div>
            <h2 className="font-display text-[1.55rem] sm:text-[2rem] font-bold text-center mb-1 leading-tight text-ink">
              {currentTask?.title}
            </h2>
            <p className="text-[0.8125rem] sm:text-sm font-body text-ink-muted leading-snug sm:leading-relaxed px-3 sm:px-5 max-w-[20rem] mx-auto tablet:min-h-[3.25em]">
              {instructionText}
            </p>
          </MotionDiv>
        </AnimatePresence>

        <div className="relative z-10 mb-3 flex flex-1 min-h-0 items-center justify-center sm:mb-4 tablet:flex-none tablet:mb-5">
          <div className="absolute inset-8 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="relative w-full rounded-[32px] border border-border-card bg-surface-card px-3 py-3.5 sm:px-6 sm:py-6 shadow-soft flex items-center justify-center overflow-hidden">

            <div className="absolute top-3 left-3 rounded-full border border-border-card bg-[#FAF3E8] px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted font-body sm:top-4 sm:left-4 sm:px-3 sm:py-1.5 sm:text-[0.6875rem] sm:tracking-[0.16em]">
              {isHungry ? 'Snack Time' : isEatingSequence ? 'Yum!' : isRunning ? 'Go, Go, Go!' : 'Paused'}
            </div>

            <div className="absolute top-3 right-3 z-20 min-w-[3.875rem] rounded-2xl border border-border-card bg-[#FAF3E8] px-2.5 py-1.5 text-center shadow-soft sm:top-4 sm:right-4 sm:min-w-[4.25rem] sm:px-3 sm:py-2">
              <div className="text-[0.5625rem] uppercase tracking-[0.12em] text-ink-muted font-body mb-0.5 sm:text-[0.625rem] sm:tracking-[0.14em]">Next Treat</div>
              <AnimatePresence mode="wait">
              {!isItemHidden && (
                  <MotionDiv
                    key={currentTask?.id}
                    initial={{ opacity: 0, scale: 0.75, rotate: -16 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.35, type: 'spring' }}
                    className="flex justify-center"
                  >
                    <TaskItemSVG
                      itemId={currentTask?.id || ''}
                      svgGroup={currentTask?.svgGroup}
                      isFlying={isItemFlying}
                      isHidden={isItemHidden}
                    />
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <ParticleBurst active={showParticles} themeColor={currentTask?.themeColor} />
            </div>

            <AnimatePresence>
              {isHungry && !isEatingSequence && (
                <MotionDiv
                  className="absolute top-12 inset-x-0 flex justify-center z-20 sm:top-14"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                >
                  <div className="bg-[#FAF3E8] border border-border-card rounded-2xl px-3 py-1.5 shadow-soft">
                    <p className="font-display text-[0.8125rem] sm:text-sm font-semibold text-ink whitespace-nowrap">All done? Come feed me! 🐾</p>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>

            <ProgressRing
              timeLeft={timeLeft}
              totalTime={totalTime}
              themeColor={currentTask?.themeColor || COMPLETED_TASK_COLOR}
              size={214}
              strokeWidth={11}
              className={RING_CLASS}
            >
              <PixelRexCharacter
                state={postChompCelebrating ? 'celebrating' : rexState}
                eatPhase={eatPhase}
                themeColor={currentTask?.themeColor}
                size={spriteSize}
                characterId={selectedCharacter}
              />
            </ProgressRing>
          </div>
        </div>

        {/* Fixed-height slot: the primary button animates in/out inside it so the card above never shifts. */}
        <div className="relative z-10 mb-3 shrink-0 min-h-[3.5rem]">
          <AnimatePresence>
            {isHungry && !isEatingSequence && (
              <MotionButton
                className="btn-coral absolute inset-x-0 top-0 w-full text-lg sm:text-xl"
                onClick={handleFeed}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.8 }}
                transition={{ duration: 0.3, type: 'spring' }}
                whileTap={{ scale: 0.92 }}
              >
                Feed {characterName} {currentTask?.itemEmoji}
              </MotionButton>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isWaiting && isRunning && !isEatingSequence && (
              <MotionButton
                className="btn-done-early absolute inset-x-0 top-0 w-full text-base sm:text-lg"
                onClick={handleDoneEarly}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                Done! Feed {characterName}
              </MotionButton>
            )}
          </AnimatePresence>
        </div>

        {/* Always laid out, hidden with visibility so the footprint is constant across states. */}
        <div className={`mt-auto z-10 shrink-0 flex flex-col items-center gap-1.5 tablet:mt-0 tablet:mb-auto ${isEatingSequence ? 'invisible' : ''}`}>
          <div className={`w-full rounded-[28px] border border-border-card bg-surface-card p-2.5 sm:p-3 shadow-soft ${isWaiting ? '' : 'invisible'}`}>
            <button
              onClick={isRunning ? pauseRoutine : resumeRoutine}

              className="w-full bg-[#FAF3E8] border border-border-card rounded-2xl py-2.5 sm:py-3 font-display font-semibold text-sm text-ink hover:bg-surface-card active:bg-border-card/30 transition-colors"
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
          <button
            onClick={skipTask}

            className={`min-h-[2.75rem] px-4 text-[0.8125rem] font-body text-ink-muted hover:text-ink transition-colors ${isHungry ? 'invisible' : ''}`}
          >
            Skip Task
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        icon="🛑"
        title="Stop Routine?"
        message={`${characterName} will have to start again from the first task.`}
        confirmLabel="Stop Routine"
        cancelLabel="Keep Going"
        destructive
        onConfirm={handleCancelRoutine}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}
