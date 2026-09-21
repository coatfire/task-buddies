import { useEffect, useState, useCallback, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import { useRoutineStore } from '../store/useRoutineStore';
import {
  markRewardShownLocal,
  readConfiguredRewards,
  readRewardsEnabled,
  readShownRewards,
} from '../store/localStore';
import DEFAULT_REWARDS from '../data/rewards.json';

const CONFETTI_COLORS = ['#E89B6F', '#E8C08A', '#9CAF88', '#88BDD4', '#B3A8D8', '#D8C27A', '#D4A8C7', '#8FA8C8'];

const CLOSING_LINES = {
  bedtime:  (n) => `${n} is ready for dreams. Sleep tight! 🌙`,
  morning:  (n) => `What a great start! ${n} is cheering for you. ☀️`,
  homework: (n) => `All done! ${n} is proud of your focus today. 📚`,
};
const CONFETTI_SHAPES = ['●', '■', '▲', '★', '♦', '❤'];
const MotionDiv = Motion.div;
const MotionH1 = Motion.h1;
const MotionP = Motion.p;
const MotionSpan = Motion.span;

function generateConfetti(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 720 - 360,
    size: 10 + Math.random() * 14,
  }));
}

/**
 * Shuffle bag: pick a reward that hasn't been shown in the current cycle
 * (no entry in shownMap, or oldest last_shown_at if all have been shown).
 */
function pickRewardFromBag(rewards, shownMap) {
  if (!rewards || rewards.length === 0) return null;
  const unshown = rewards.filter((r) => !shownMap[r.id]);
  if (unshown.length > 0) {
    return unshown[Math.floor(Math.random() * unshown.length)];
  }
  // All shown — reset cycle: pick from the oldest shown
  const sorted = [...rewards].sort(
    (a, b) => new Date(shownMap[a.id] || 0) - new Date(shownMap[b.id] || 0),
  );
  return sorted[0];
}

const LOVOU_CARD = {
  bedtime: {
    title: "Ready for tonight's story?",
    body: 'Turn tonight\u2019s routine into a personalized bedtime adventure with Lovou.',
  },
  default: {
    title: 'Make bedtime magical too',
    body: 'Calming, personalized audio stories that pick up where Task Buddies leaves off.',
  },
};

export default function RoutineComplete() {
  const { tasks, resetRoutine, selectedCharacter, routineName, routineType, openParentGate } = useRoutineStore();
  const [confetti, setConfetti] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const viewportHeight = useRef(typeof window !== 'undefined' ? window.innerHeight : 800);

  // Reward state
  const [rewards, setRewards] = useState([]);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [pickedReward, setPickedReward] = useState(null);
  const [chestState, setChestState] = useState('hidden'); // hidden | closed | opening | revealed

  const characterName = selectedCharacter ? selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1) : 'Buddy';
  const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const routineBase = routineType?.startsWith('custom:') ? null : routineType;
  const closingLine = (CLOSING_LINES[routineBase] || ((n) => `You did it! ${n} is so happy you finished. ✨`))(characterName);
  const lovouCard = LOVOU_CARD[routineBase] || LOVOU_CARD.default;

  useEffect(() => {
    setRewards(readConfiguredRewards(DEFAULT_REWARDS));
    setRewardsEnabled(readRewardsEnabled());
  }, []);

  // Pick a reward once rewards are loaded, biased toward unshown.
  useEffect(() => {
    if (!rewardsEnabled || rewards.length === 0) return;
    const reward = pickRewardFromBag(rewards, readShownRewards());
    setPickedReward(reward);
  }, [rewards, rewardsEnabled]);

  const openChest = useCallback(() => {
    if (chestState !== 'closed' || !pickedReward) return;
    setChestState('opening');
    markRewardShownLocal(pickedReward.id);
    setTimeout(() => setChestState('revealed'), 800);
  }, [chestState, pickedReward]);

  useEffect(() => {
    setConfetti(generateConfetti(40));
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!rewardsEnabled || !pickedReward || rewards.length === 0) return;
    const chestTimer = setTimeout(() => setChestState('closed'), 2000);
    return () => clearTimeout(chestTimer);
  }, [rewardsEnabled, pickedReward, rewards]);

  return (
    <div data-buddy-scroll="true" className="w-full h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pt-3 pb-6 relative text-ink bg-cream-gradient sm:pt-5 sm:pb-8">
      {/* Confetti Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <MotionDiv
            key={piece.id}
            className="absolute"
            style={{ left: `${piece.x}%`, top: -20, fontSize: piece.size, color: piece.color }}
            initial={{ y: -30, opacity: 1, rotate: 0 }}
            animate={{ y: viewportHeight.current + 50, opacity: [1, 1, 0.8, 0], rotate: piece.rotation }}
            transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut', repeat: 2, repeatDelay: 1 }}
          >
            {piece.shape}
          </MotionDiv>
        ))}
      </div>

      {showContent && (
        <MotionDiv
          className="w-full max-w-sm mx-auto flex flex-col items-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="hidden items-center gap-2 rounded-full border border-border-card bg-surface px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-muted font-body shadow-soft mb-4 sm:inline-flex">
            <span>Routine Complete</span>
            <span className="text-ink">{routineName}</span>
          </div>
          <MotionH1
            className="font-display text-[2rem] sm:text-4xl font-bold text-ink text-center mb-1.5 sm:mb-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            All Done!
          </MotionH1>

          <MotionP
            className="text-ink-muted font-body font-semibold text-center mb-4 leading-relaxed sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {closingLine}
          </MotionP>

          <MotionDiv
            className="relative"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <div className="relative rounded-[32px] border border-border-card bg-surface-card px-6 py-5 sm:px-8 sm:py-7 shadow-soft overflow-hidden">
            <PixelRexCharacter state="celebrating" size={148} characterId={selectedCharacter} />
            </div>
          </MotionDiv>

          {/* Treasure Chest Reward — slot is reserved so the layout doesn't jump when it appears */}
          {rewardsEnabled && pickedReward && (
          <div className="w-full max-w-xs mx-auto my-4 min-h-[132px] flex items-center">
          <AnimatePresence>
            {chestState !== 'hidden' && (
              <MotionDiv
                className="w-full"
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                {chestState === 'closed' && (
                  <button
                    onClick={openChest}
                    className="w-full flex flex-col items-center gap-2 p-5 rounded-[28px] border-2 border-accent/40 bg-surface-card shadow-soft hover:border-accent/70 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    <MotionDiv
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      className="text-5xl"
                    >
                      🎁
                    </MotionDiv>
                    <span className="font-display font-bold text-sm text-accent">Tap to open your reward!</span>
                  </button>
                )}

                {chestState === 'opening' && (
                  <div className="w-full flex flex-col items-center gap-2 p-5 rounded-[28px] border-2 border-accent/40 bg-surface-card shadow-soft">
                    <MotionDiv
                      animate={{ rotate: [-5, 5, -5, 5, 0], scale: [1, 1.15, 1.1, 1.2, 1.3] }}
                      transition={{ duration: 0.8 }}
                      className="text-5xl"
                    >
                      🎁
                    </MotionDiv>
                    <span className="font-display font-bold text-sm text-accent animate-pulse">Opening...</span>
                  </div>
                )}

                {chestState === 'revealed' && pickedReward && (
                  <MotionDiv
                    className="w-full flex flex-col items-center gap-3 p-5 rounded-[28px] border-2 border-accent/50 bg-surface-card shadow-soft"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250 }}
                  >
                    <MotionDiv
                      className="text-4xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    >
                      🌟
                    </MotionDiv>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-accent font-body mb-1">Your Reward</p>
                      <p className="font-display font-black text-2xl text-ink leading-snug text-center">{pickedReward.text}</p>
                    </div>
                  </MotionDiv>
                )}
              </MotionDiv>
            )}
          </AnimatePresence>
          </div>
          )}

          <MotionDiv
            className="w-full sm:max-w-xs mt-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
          >
            <button onClick={resetRoutine} className="btn-primary w-full">
              Back to Buddies
            </button>
          </MotionDiv>

          {/* Lovou bridge — link opens only after the parent gate (Kids Category / Families policy) */}
          <MotionDiv
            className="w-full sm:max-w-xs mb-4 rounded-[24px] border border-accent/40 bg-[#FAF3E8] p-4 shadow-soft"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-11 h-11 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center"><BookOpen className="w-5 h-5 text-ink" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-[15px] text-ink leading-snug">{lovouCard.title}</h3>
                <p className="text-[13px] text-ink-muted font-body leading-snug mt-1">{lovouCard.body}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openParentGate('lovou')}
              className="mt-3 w-full min-h-[44px] rounded-2xl border border-border-card bg-surface-card px-4 py-2.5 text-sm font-display font-semibold text-ink hover:bg-white/60 transition-colors"
            >
              Learn More
            </button>
            <p className="mt-2 text-center text-[11px] text-ink-muted/80 font-body">Grown-ups only · opens in your browser</p>
          </MotionDiv>

          <MotionDiv
            className="grid grid-cols-3 gap-2 w-full mt-1 mb-1 sm:max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="rounded-2xl border border-border-card bg-surface-card px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted font-body">Tasks</div>
              <div className="text-sm font-display font-semibold text-ink mt-1">{tasks.length}</div>
            </div>
            <div className="rounded-2xl border border-border-card bg-surface-card px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted font-body">Time</div>
              <div className="text-sm font-display font-semibold text-ink mt-1">{totalMinutes} min</div>
            </div>
            <div className="rounded-2xl border border-border-card bg-surface-card px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted font-body">Buddy</div>
              <div className="text-sm font-display font-semibold text-ink mt-1">{characterName}</div>
            </div>
          </MotionDiv>

          <MotionDiv
            className="w-full rounded-[20px] border border-border-card bg-surface-card p-4 mt-5 mb-4 sm:max-w-xs sm:mt-6 sm:mb-6 shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-display text-sm font-bold text-ink-muted mb-3 text-center">Completed Tasks</h3>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <MotionDiv
                  key={task.id}
                  className="flex items-center gap-2 py-2 px-3 rounded-2xl bg-[#FAF3E8] border border-border-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <MotionSpan className="text-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}>
                    ✅
                  </MotionSpan>
                  <span className="font-display font-semibold text-sm flex-1 text-ink">{task.title}</span>
                  <span className="text-xs text-ink-muted font-body">{task.durationMinutes}m</span>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </div>
  );
}
