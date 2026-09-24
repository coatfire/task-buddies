import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Instagram, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  readConfiguredRewards,
  readRewardsEnabled,
  writeConfiguredRewards,
  writeRewardsEnabled,
} from '../store/localStore';
import defaultRewards from '../data/rewards.json';
import Logo from '../components/Logo';
import ConfirmDialog from '../components/ConfirmDialog';
import TikTokIcon from '../components/TikTokIcon';
import { LINKS, openExternalUrl } from '../platform/externalLinks';

const MotionButton = motion.button;

const SOCIALS = [
  { id: 'instagram', label: 'Lovou on Instagram', Icon: Instagram },
  { id: 'tiktok', label: 'Lovou on TikTok', Icon: TikTokIcon },
];

export default function Settings() {
  const [rewards, setRewards] = useState([]);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const openLink = (url) => {
    void openExternalUrl(url).catch((error) => {
      console.error('[task-buddy] external link failed', error);
    });
  };

  useEffect(() => {
    setRewards(readConfiguredRewards(defaultRewards));
    setRewardsEnabled(readRewardsEnabled());
  }, []);

  const updateRewards = (next) => {
    setRewards(next);
    writeConfiguredRewards(next);
  };

  const handleToggleRewards = () => {
    const next = !rewardsEnabled;
    setRewardsEnabled(next);
    writeRewardsEnabled(next);
  };

  const handleAddReward = () => {
    const newReward = { id: `custom-${Date.now()}`, text: '' };
    updateRewards([...rewards, newReward]);
    setEditingId(newReward.id);
    setEditText('');
  };

  const handleDeleteReward = (id) => {
    updateRewards(rewards.filter((r) => r.id !== id));
    setConfirmDelete(null);
  };

  const handleStartEdit = (reward) => {
    setEditingId(reward.id);
    setEditText(reward.text);
  };

  const handleSaveEdit = () => {
    const text = editText.trim();
    if (!text) {
      updateRewards(rewards.filter((r) => r.id !== editingId));
    } else {
      updateRewards(rewards.map((r) => (r.id === editingId ? { ...r, text } : r)));
    }
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    const editing = rewards.find((r) => r.id === editingId);
    if (editing && !editing.text) updateRewards(rewards.filter((r) => r.id !== editingId));
    setEditingId(null);
    setEditText('');
  };

  const handleReset = () => {
    updateRewards(defaultRewards);
    setConfirmReset(false);
  };

  return (
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0 sm:mb-5">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" size="small" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-3 px-2 shrink-0 sm:mb-6 sm:px-4">
        <h1 className="text-[1.45rem] leading-tight font-display font-bold text-ink mb-1 sm:text-3xl sm:mb-2">
          Parent Area
        </h1>
        <p className="max-w-[18rem] mx-auto text-ink-muted text-[0.8125rem] font-body leading-snug sm:max-w-none sm:text-sm sm:leading-normal">
          Changes are saved automatically
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2" data-buddy-scroll="true">
        {/* Rewards Toggle */}
        <div className="mb-3 px-4 py-3 rounded-2xl border border-border-card bg-surface-card shadow-soft sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <h3 id="rewards-toggle-label" className="font-display font-semibold text-sm text-ink mb-0.5">Enable Rewards</h3>
              <p className="text-xs text-ink-muted font-body">Show a reward chest after completing routines</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={rewardsEnabled}
              aria-labelledby="rewards-toggle-label"
              onClick={handleToggleRewards}
              className={`relative w-14 h-8 rounded-full transition-all shadow-inner shrink-0 ${
                rewardsEnabled ? 'bg-success' : 'bg-border-card'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transition-all flex items-center justify-center text-xs font-bold ${
                  rewardsEnabled ? 'translate-x-6 bg-white text-success' : 'translate-x-0 bg-white text-ink-muted'
                }`}
              >
                {rewardsEnabled ? '✓' : '✕'}
              </span>
            </button>
          </div>
        </div>

        {/* Lovou bridge */}
        <div className="mb-4 rounded-2xl border border-accent/40 bg-[#FAF3E8] p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center"><BookOpen className="w-5 h-5 text-ink" /></div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-[0.9375rem] text-ink leading-snug">The other half of our bedtime</h3>
              <p className="text-[0.8125rem] text-ink-muted font-body leading-snug mt-1">
                Task Buddies gets you through the routine. Lovou is the story after it, made with your child and
                played back in the voices they choose. No ads, nothing sold to anyone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openLink(LINKS.lovou)}
            className="mt-3 w-full min-h-[2.75rem] rounded-2xl bg-accent px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-display font-semibold text-ink hover:opacity-90 transition-opacity shadow-soft"
          >
            Have a look at Lovou
            <ExternalLink className="w-3.5 h-3.5 text-ink/70" />
          </button>
        </div>

        {/* Rewards list header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-display font-semibold text-sm text-ink">Reward Ideas</h3>
          <span className="text-xs text-ink-muted font-body">{rewards.length} rewards</span>
        </div>

        <div className="space-y-2">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="rounded-2xl border border-border-card bg-surface-card shadow-soft overflow-hidden"
            >
              {editingId === reward.id ? (
                <div className="p-3 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); } }}
                    placeholder="e.g. Pick tomorrow's breakfast"
                    aria-label="Reward text"
                    className="w-full bg-[#FAF3E8] border border-border-card rounded-xl px-3 py-2 text-ink text-base font-body resize-none focus:outline-none focus:border-accent/40"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 min-h-[2.75rem] rounded-xl bg-accent px-3 py-2 text-xs font-display font-semibold text-ink hover:opacity-90 transition-opacity"
                    >
                      {editText.trim() ? 'Done' : 'Remove'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 min-h-[2.75rem] rounded-xl bg-[#FAF3E8] border border-border-card px-3 py-2 text-xs font-display font-semibold text-ink-muted hover:bg-surface-card transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 pl-3">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(reward)}
                    className="flex-1 min-w-0 min-h-[2.75rem] text-left py-1"
                  >
                    <p className="text-ink text-sm font-body leading-snug">{reward.text}</p>
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(reward)}
                      aria-label="Edit reward"
                      className="w-10 h-10 rounded-xl bg-[#FAF3E8] border border-border-card flex items-center justify-center hover:bg-surface-card transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-ink-muted" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(reward.id)}
                      aria-label="Delete reward"
                      className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          <MotionButton
            onClick={handleAddReward}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full min-h-[3rem] rounded-2xl border border-dashed border-border-card bg-surface-card px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#FAF3E8] hover:border-accent/40 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4 text-ink" />
            <span className="text-sm font-display font-semibold text-ink">Add Reward</span>
          </MotionButton>

          <button
            onClick={() => setConfirmReset(true)}
            className="w-full min-h-[2.75rem] px-4 py-2 text-xs font-display font-semibold text-ink-muted hover:text-red-400 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* About / Support */}
      <div className="px-2 pt-2 pb-1 shrink-0 border-t border-border-card">
        <div className="rounded-xl border border-border-card bg-surface-card p-2 grid grid-cols-[1fr_1fr_auto_auto] gap-2">
          <button
            type="button"
            onClick={() => openLink(LINKS.privacy)}
            className="flex items-center justify-center gap-1.5 min-h-[2.75rem] rounded-xl border border-border-card bg-[#FAF3E8] px-3 py-2 hover:bg-surface-card transition-colors"
          >
            <span className="text-xs font-display font-semibold text-ink">Privacy</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </button>
          <button
            type="button"
            onClick={() => openLink(LINKS.support)}
            className="flex items-center justify-center gap-1.5 min-h-[2.75rem] rounded-xl border border-border-card bg-[#FAF3E8] px-3 py-2 hover:bg-surface-card transition-colors"
          >
            <span className="text-xs font-display font-semibold text-ink">Support</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </button>
          {SOCIALS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => openLink(LINKS[id])}
              aria-label={label}
              title={label}
              className="flex items-center justify-center w-[2.75rem] min-h-[2.75rem] rounded-xl border border-border-card bg-[#FAF3E8] hover:bg-surface-card transition-colors"
            >
              <Icon className="w-5 h-5 text-ink" />
            </button>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        icon="🗑️"
        title="Delete Reward?"
        message="It will no longer appear in the reward chest."
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDeleteReward(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmDialog
        open={confirmReset}
        icon="↩️"
        title="Reset Rewards?"
        message="Your custom rewards will be replaced with the default list."
        confirmLabel="Reset to Defaults"
        destructive
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
