import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Logo from '../components/Logo';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import { useRoutineStore } from '../store/useRoutineStore';
import { scaled, useRootScale } from '../hooks/useRootScale';

const MotionDiv = motion.div;

// Shown once, before buddy selection. Setup always goes through the parent gate; there is no skip.
export default function FirstRunSetup() {
  const openParentGate = useRoutineStore((s) => s.openParentGate);
  const selectedCharacter = useRoutineStore((s) => s.selectedCharacter);
  const { scale: rootScale } = useRootScale();

  return (
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <Logo className="h-8 w-auto" size="small" />
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <MotionDiv
          className="w-full max-w-sm rounded-[32px] border border-border-card bg-surface-card p-6 shadow-soft text-center sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="mx-auto mb-2 flex justify-center">
            <PixelRexCharacter state="celebrating" characterId={selectedCharacter} size={scaled(120, rootScale)} />
          </div>
          <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-ink" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">Set up a family routine</h1>
          <p className="font-body text-sm text-ink-muted leading-relaxed mb-6">
            Parents and guardians choose the routine, tasks and rewards. When it is time, complete the steps
            together and feed your buddy.
          </p>
          <button type="button" onClick={() => openParentGate('setup')} className="btn-primary w-full">
            Set up
          </button>
        </MotionDiv>
      </div>
    </div>
  );
}
