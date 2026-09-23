import { motion } from 'framer-motion';
import { PawPrint, UserRound } from 'lucide-react';
import { PARENT_SCREENS, useRoutineStore } from '../store/useRoutineStore';

const MotionButton = motion.button;

const TABS = [
  { id: 'buddy', label: 'Buddy', Icon: PawPrint },
  { id: 'parent', label: 'Parent Area', Icon: UserRound },
];

export default function TabBar() {
  const screen = useRoutineStore((s) => s.screen);
  const rexState = useRoutineStore((s) => s.rexState);
  const openParentGate = useRoutineStore((s) => s.openParentGate);
  const leaveParentArea = useRoutineStore((s) => s.leaveParentArea);
  const activeTab = PARENT_SCREENS.includes(screen) ? 'parent' : 'buddy';

  const handleSelect = (tabId) => {
    if (tabId === activeTab) return;
    // Mid-chomp the player owns a timed animation sequence; let it finish first.
    if (screen === 'player' && rexState === 'eating') return;
    if (tabId === 'parent') openParentGate();
    else leaveParentArea();
  };

  return (
    <nav aria-label="Main" className="tab-bar shrink-0 mt-2 mx-auto w-full max-w-sm rounded-[24px] border border-border-card bg-surface shadow-soft p-1 flex gap-1">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === activeTab;
        return (
          <MotionButton
            key={id}
            type="button"
            onClick={() => handleSelect(id)}
            whileTap={{ scale: 0.96 }}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
            className={`flex-1 min-h-[3.25rem] rounded-[20px] flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-colors ${
              isActive ? 'bg-accent/15 text-ink' : 'text-ink-muted hover:bg-surface-card'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-ink-muted'}`} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
            <span className="text-[0.6875rem] font-display font-semibold leading-none">{label}</span>
          </MotionButton>
        );
      })}
    </nav>
  );
}
