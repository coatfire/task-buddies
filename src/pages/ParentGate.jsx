import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { useRoutineStore } from '../store/useRoutineStore';

const MotionButton = motion.button;

function createChallenge() {
  const a = Math.floor(Math.random() * 7) + 3;
  const b = Math.floor(Math.random() * 7) + 3;

  return {
    prompt: `${a} × ${b}`,
    answer: a * b,
  };
}

export default function ParentGate() {
  const setScreen = useRoutineStore((state) => state.setScreen);
  const [challenge, setChallenge] = useState(createChallenge);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Number(answer) === challenge.answer) {
      setScreen('settings');
      return;
    }

    setChallenge(createChallenge());
    setAnswer('');
    setError('Not quite — try this one.');
  };

  return (
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
        <Logo className="h-8 w-auto" size="small" />
        <MotionButton
          type="button"
          onClick={() => setScreen('selection')}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-2xl bg-surface border border-border-card shadow-soft flex items-center justify-center"
          aria-label="Return to buddy selection"
        >
          <ArrowLeft className="w-5 h-5 text-ink-muted" />
        </MotionButton>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-[32px] border border-border-card bg-surface-card p-6 shadow-soft text-center sm:p-8"
        >
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-ink" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">Grown-Ups Only</h1>
          <p className="font-body text-sm text-ink-muted leading-relaxed mb-6">
            Ask a grown-up to solve this question to open the Parent Area.
          </p>

          <label htmlFor="parent-gate-answer" className="block font-display font-bold text-2xl text-ink mb-3">
            What is {challenge.prompt}?
          </label>
          <input
            id="parent-gate-answer"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value.replace(/\D/g, '').slice(0, 2));
              setError('');
            }}
            inputMode="numeric"
            autoComplete="off"
            className="w-full rounded-2xl border border-border-card bg-[#FAF3E8] px-4 py-3 text-center font-display text-xl font-bold text-ink focus:outline-none focus:border-accent"
            aria-describedby={error ? 'parent-gate-error' : undefined}
          />

          {error && (
            <p id="parent-gate-error" role="alert" className="mt-3 text-sm font-body text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!answer}
            className="btn-primary w-full mt-5"
          >
            Open Parent Area
          </button>
        </form>
      </div>
    </div>
  );
}
