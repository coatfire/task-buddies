import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRoutineStore } from '../store/useRoutineStore';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  readCustomRoutines,
  createCustomRoutineLocal,
  deleteCustomRoutineLocal,
} from '../store/localStore';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const EMOJI_OPTIONS = ['✏️', '🏀', '🎶', '🧹', '🌿', '🎮', '🍳', '🐕', '🎨', '📖', '🧘', '💪', '🚿', '🎒'];

export default function CustomRoutineList() {
  const { setRoutine, setScreen } = useRoutineStore();
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('✏️');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadRoutines = useCallback(() => {
    setRoutines(readCustomRoutines());
    setIsLoading(false);
  }, []);

  useEffect(() => { loadRoutines(); }, [loadRoutines]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const created = createCustomRoutineLocal(nanoid(), newName.trim(), newEmoji);
    setShowCreate(false);
    setNewName('');
    setNewEmoji('✏️');
    setRoutine(`custom:${created.id}`, created.name, created.id);
  };

  const handleDelete = (routineId) => {
    deleteCustomRoutineLocal(routineId);
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    setConfirmDelete(null);
  };

  const handleSelect = (routine) => {
    setRoutine(`custom:${routine.id}`, routine.name, routine.id);
  };

  return (
    <div data-buddy-scroll="true" className="h-full min-h-full flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 sm:mb-5">
        <button
          onClick={() => setScreen('picker')}
          aria-label="Back"
          className="w-11 h-11 rounded-2xl bg-surface border border-border-card flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-card transition-colors shadow-soft"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-2xl bg-[#7FC56A]/15 border border-[#7FC56A]/20 flex items-center justify-center">
          <span className="text-lg">✏️</span>
        </div>
        <span className="font-display font-semibold text-ink text-sm tracking-[0.02em]">Custom Routines</span>
      </div>

      {/* Title */}
      <div className="text-center mb-4 px-2 shrink-0 sm:mb-6 sm:px-4">
        <h1 className="text-[1.6rem] leading-tight font-display font-bold text-ink mb-1 sm:text-3xl sm:mb-2">Your Routines</h1>
        <p className="text-ink-muted text-[13px] font-body leading-snug sm:text-sm">Create and manage custom routines</p>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-sm mx-auto flex-1 min-h-0 overflow-y-auto mb-2 sm:mb-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-sm text-ink-muted font-body animate-pulse">Loading routines...</div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {routines.map((routine, i) => (
              <MotionDiv
                key={routine.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-[24px] border border-border-card bg-surface-card shadow-soft"
              >
                <button
                  onClick={() => handleSelect(routine)}
                  className="flex-1 min-w-0 flex items-center gap-3 py-2 rounded-2xl text-left"
                >
                  <div className="w-12 h-12 rounded-[16px] flex items-center justify-center border border-border-card bg-[#FAF3E8] text-2xl shrink-0">
                    {routine.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-ink text-base truncate">{routine.name}</div>
                    <div className="text-xs text-ink-muted font-body mt-0.5">Tap to set up and start</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-ink-muted/60 shrink-0" />
                </button>
                <button
                  onClick={() => setConfirmDelete(routine.id)}
                  aria-label={`Delete ${routine.name}`}
                  className="shrink-0 w-11 h-11 rounded-xl border border-border-card bg-[#FAF3E8] flex items-center justify-center text-ink-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </MotionDiv>
            ))}

            {routines.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-sm text-ink-muted font-body leading-relaxed">No custom routines yet.<br />Create your first one below!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create New Button */}
      <div className="max-w-sm mx-auto w-full shrink-0 pb-2 sm:pb-4">
        <MotionButton
          onClick={() => setShowCreate(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-border-card bg-surface-card hover:bg-[#FAF3E8] hover:border-accent/40 transition-all text-sm font-display font-semibold text-ink-muted hover:text-ink shadow-soft"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Routine
        </MotionButton>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              className="bg-surface-card border border-border-card rounded-[28px] p-6 w-full max-w-xs shadow-soft text-ink"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border-card bg-[#FAF3E8] text-2xl">
                {newEmoji}
              </div>
              <h2 className="font-display font-bold text-ink text-lg mb-1 text-center">New Custom Routine</h2>
              <p className="text-ink-muted text-sm text-center mb-4 font-body">Give it a name and pick an icon</p>

              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="e.g. Sports Night"
                maxLength={24}
                className="w-full bg-[#FAF3E8] border-2 border-border-card rounded-2xl px-4 py-3 text-ink placeholder:text-ink-muted/50 font-body text-base outline-none focus:border-accent/40 mb-3"
              />

              {/* Emoji picker */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEmoji(emoji)}
                    aria-label={`Icon ${emoji}`}
                    aria-pressed={newEmoji === emoji}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                      newEmoji === emoji
                        ? 'bg-accent/20 border-2 border-accent/50 scale-110'
                        : 'bg-[#FAF3E8] border border-border-card hover:bg-surface-card'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="btn-primary w-full disabled:opacity-40"
              >
                Create Routine 🎉
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewName(''); }}
                className="w-full mt-2 min-h-[44px] text-sm text-ink-muted hover:text-ink py-2 font-body"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDelete !== null}
        icon="🗑️"
        title="Delete Routine?"
        message="This will remove the routine and all its saved tasks. This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
