import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;

export default function ConfirmDialog({
  open,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <MotionDiv
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="bg-surface-card border border-border-card rounded-[28px] p-6 w-full max-w-xs shadow-soft text-ink"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl ${destructive ? 'border-red-200 bg-red-50' : 'border-border-card bg-[#FAF3E8]'}`}>
              {icon}
            </div>
            <h2 id="confirm-dialog-title" className="font-display font-bold text-ink text-lg mb-1 text-center">{title}</h2>
            <p className="text-ink-muted text-sm text-center mb-4 font-body">{message}</p>
            <button
              onClick={onConfirm}
              className={`w-full min-h-[48px] py-3 rounded-2xl font-display font-bold text-sm transition-colors ${
                destructive
                  ? 'bg-red-50 border border-red-200 text-red-500 hover:bg-red-100'
                  : 'bg-accent text-ink hover:opacity-90'
              }`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onCancel}
              className="w-full mt-2 min-h-[44px] text-sm text-ink-muted hover:text-ink py-2 font-body"
            >
              {cancelLabel}
            </button>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
