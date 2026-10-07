import { motion } from 'framer-motion';

const ACCENT_COLOR = '#E89B6F';
const MotionCircle = motion.circle;
const MotionSpan = motion.span;

export default function ProgressRing({ timeLeft, totalTime, themeColor: _themeColor, size = 220, strokeWidth = 12, className = '', ringRef, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isImpatient = timeLeft === 0;

  return (
    <div ref={ringRef} className={`relative inline-flex items-center justify-center ${className}`.trim()}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={isImpatient ? undefined : 'rgba(232, 155, 111, 0.18)'}
          strokeWidth={strokeWidth}
          className={isImpatient ? 'ring-impatient' : ''}
        />
        <MotionCircle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={ACCENT_COLOR}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
          style={{ filter: isUrgent ? 'url(#glow)' : 'none' }}
          className={isImpatient ? 'ring-impatient' : ''}
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        {children}
        <MotionSpan
          className="font-display text-2xl font-bold leading-none"
          style={{ color: ACCENT_COLOR }}
          animate={isUrgent ? { scale: [1, 1.1, 1], transition: { duration: 0.5, repeat: Infinity } } : { scale: 1 }}
        >
          {timeDisplay}
        </MotionSpan>
        {isImpatient && (
          <MotionSpan
            className="text-xs font-body font-semibold text-ink-muted mt-0.5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Ready when you are 🐾
          </MotionSpan>
        )}
      </div>
    </div>
  );
}
