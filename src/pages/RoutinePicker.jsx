import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRoutineStore } from '../store/useRoutineStore';
import Logo from '../components/Logo';

const MotionButton = motion.button;

const ROUTINES = [
  { type: 'bedtime',  emoji: '🌙', label: 'Bedtime',  description: 'Wind down & get ready for sleep', color: '#A593F7', tint: '#F6E5CC' },
  { type: 'morning',  emoji: '🌅', label: 'Morning',  description: 'Start the day the right way',     color: '#E8A26B', tint: '#F6E5CC' },
  { type: 'homework', emoji: '📚', label: 'Homework', description: 'Focus up & get it done',          color: '#6FB9D8', tint: '#F6E5CC' },
  { type: 'custom',   emoji: '✏️', label: 'Custom',   description: 'Create your own routine',          color: '#7FC56A', tint: '#F6E5CC' },
];

function getTimeHighlight() {
  const h = new Date().getHours();
  const day = new Date().getDay(); // 0=Sun, 6=Sat
  const isWeekday = day >= 1 && day <= 5;
  if (h >= 18 || h < 5) return 'bedtime';
  if (h >= 5 && h < 10) return 'morning';
  if (isWeekday && h >= 14 && h < 18) return 'homework';
  return null;
}

export default function RoutinePicker() {
  const { setRoutine, setScreen } = useRoutineStore();
  const timeHighlight = getTimeHighlight();

  const handleSelect = (type) => {
    if (type === 'custom') {
      setScreen('customList');
    } else {
      setRoutine(type);
    }
  };

  return (
    <div className="h-full min-h-full flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 sm:mb-5">
        <button
          onClick={() => setScreen('selection')}
          aria-label="Back"
          className="w-11 h-11 rounded-2xl bg-surface border border-border-card flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-card transition-colors shadow-soft"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Logo className="h-8 w-auto" size="small" />
      </div>

      {/* Title */}
      <div className="text-center mb-4 px-2 shrink-0 sm:mb-6 sm:px-4">
        <h1 className="text-[1.6rem] leading-tight font-display font-bold text-ink mb-1 sm:text-3xl sm:mb-2">Choose a Routine</h1>
        <p className="text-ink-muted text-[0.8125rem] font-body leading-snug sm:text-sm sm:leading-normal">What are we doing today?</p>
      </div>

      {/* Routine Tiles */}
      <div className="relative w-full max-w-sm mx-auto flex-1 min-h-0 mb-2 flex items-center sm:mb-4">
        <div className="relative w-full rounded-[32px] border border-border-card bg-surface px-3 py-4 sm:px-4 sm:py-5 shadow-soft">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {ROUTINES.map((routine, i) => {
              const isHighlighted = timeHighlight === routine.type;
              return (
                <MotionButton
                  key={routine.type}
                  onClick={() => handleSelect(routine.type)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex flex-col items-center px-3 py-3 rounded-[24px] bg-surface-card transition-all min-h-[8rem] justify-center sm:p-5 sm:rounded-[28px] sm:min-h-[10.625rem] ${
                    isHighlighted
                      ? 'border-2 border-accent shadow-soft'
                      : 'border border-border-card'
                  }`}
                >
                  <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-1.5 border border-border-card bg-white text-[1.45rem] sm:w-14 sm:h-14 sm:rounded-2xl sm:mb-3 sm:text-3xl">
                    <span>{routine.emoji}</span>
                  </div>
                  <span className="font-display font-semibold text-ink text-[1rem] mb-0.5 sm:text-xl sm:mb-1">{routine.label}</span>
                  <span className="text-[0.75rem] text-ink-muted text-center leading-snug font-body sm:text-sm sm:leading-tight">{routine.description}</span>
                  {isHighlighted && (
                    <span className="mt-1.5 text-[0.625rem] font-body text-accent font-semibold uppercase tracking-wide">Suggested</span>
                  )}
                </MotionButton>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto rounded-[24px] border border-border-card bg-surface px-3 py-2 shadow-soft text-center shrink-0 sm:px-4 sm:py-3">
        <p className="text-ink-muted text-[0.75rem] font-body leading-snug sm:text-sm sm:leading-relaxed">Choose a ready-made path or create your own.</p>
      </div>

    </div>
  );
}
