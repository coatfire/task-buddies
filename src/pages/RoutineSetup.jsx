import { useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, GripVertical, Minus, Plus, Play, Settings2, Trash2, PlusCircle, X, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import { useRoutineStore } from '../store/useRoutineStore';
import { getTasksForRoutine } from '../store/taskLibrary';
import { readFastPath } from '../store/localStore';
import Logo from '../components/Logo';

const TASK_COLORS = ['#9D8AAE', '#86A4B3', '#C89A63', '#B86F56', '#81906F', '#B68FA1'];
const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function RoutineSetup() {
  const { tasks, setTasks, startRoutine, routineName, routineType, selectedCharacter, setScreen, saveRoutine, hasSavedRoutine } = useRoutineStore();
  const characterName = selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const isFastPath = readFastPath().hasCompletedRun;

  const updateTaskDuration = useCallback((taskId, delta) => {
    setTasks(tasks.map((t) => t.id === taskId ? { ...t, durationMinutes: Math.max(1, Math.min(60, t.durationMinutes + delta)) } : t));
  }, [tasks, setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }, [tasks, setTasks]);

  const addTaskFromLibrary = useCallback((libTask) => {
    const color = TASK_COLORS[tasks.length % TASK_COLORS.length];
    setTasks([...tasks, {
      id: nanoid(),
      title: libTask.label,
      durationMinutes: libTask.defaultMinutes,
      itemEmoji: libTask.emoji,
      itemLabel: libTask.label,
      svgGroup: libTask.svgGroup,
      themeColor: color,
      task_type_key: libTask.key,
    }]);
    setShowPicker(false);
  }, [tasks, setTasks]);

  const addBlankTask = useCallback(() => {
    const color = TASK_COLORS[tasks.length % TASK_COLORS.length];
    setTasks([...tasks, { id: nanoid(), title: '', durationMinutes: 5, itemEmoji: '❓', itemLabel: 'Task', svgGroup: 'question-mark', themeColor: color, task_type_key: 'custom' }]);
  }, [tasks, setTasks]);

  const updateTaskTitle = useCallback((taskId, title) => {
    setTasks(tasks.map((t) => t.id === taskId ? { ...t, title } : t));
  }, [tasks, setTasks]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await saveRoutine();
    setIsSaving(false);
  }, [saveRoutine]);

  return (
    <div data-buddy-scroll="true" className={`w-full h-full min-h-0 flex flex-col items-center overflow-x-hidden overscroll-contain px-1 py-1 pb-4 text-ink sm:py-2 sm:pb-8 ${showBuilder ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <div className="w-full max-w-sm flex items-center gap-2 mb-3 shrink-0 sm:mb-5">
        <button
          onClick={() => setScreen(routineType.startsWith('custom:') ? 'customList' : 'picker')}
          className="w-11 h-11 rounded-2xl bg-surface border border-border-card flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-card transition-colors shadow-soft"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Logo className="h-8 w-auto" size="small" />
      </div>

      <MotionDiv className="text-center mb-2.5 shrink-0 sm:mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[1.5rem] sm:text-3xl font-bold text-ink mb-1 leading-tight">{characterName}'s {routineName}</h1>
        <p className="hidden text-ink-muted font-body text-[13px] sm:block sm:text-sm leading-snug">Complete tasks to feed {characterName}.</p>
      </MotionDiv>

      <MotionDiv className="relative w-full max-w-sm mb-2.5 shrink-0 sm:mb-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <div className="relative rounded-[32px] border border-border-card bg-surface-card px-3 py-3.5 sm:px-6 sm:py-6 shadow-soft overflow-hidden text-center">
          <PixelRexCharacter state="idle" size={132} className="mx-auto" characterId={selectedCharacter} />
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-border-card bg-[#FAF3E8] px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted font-body">Total</div>
              <div className="text-sm font-display font-semibold text-ink mt-1">{totalMinutes} min</div>
            </div>
            <div className="rounded-2xl border border-border-card bg-[#FAF3E8] px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted font-body">Buddy</div>
              <div className="text-sm font-display font-semibold text-ink mt-1">{characterName}</div>
            </div>
          </div>
        </div>
      </MotionDiv>

      <MotionDiv className="w-full max-w-sm rounded-[28px] border border-border-card bg-surface-card p-3 shadow-soft mb-2.5 shrink-0 sm:p-4 sm:mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <MotionButton
          className="btn-primary w-full flex items-center justify-center gap-2 text-lg sm:text-xl"
          onClick={startRoutine}
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
        >
          <Play className="w-6 h-6 fill-current" />
          Start Routine
        </MotionButton>
        {!showBuilder && (
          <button onClick={() => setShowBuilder(true)} className="mt-2.5 w-full h-11 rounded-2xl border border-border-card bg-[#FAF3E8] hover:bg-surface-card transition-colors flex items-center justify-center gap-2 px-3">
            <Settings2 className="w-[18px] h-[18px] text-ink-muted" />
            <span className="text-xs font-display font-semibold text-ink">Edit Tasks</span>
            <ChevronDown className="w-4 h-4 text-ink-muted" />
          </button>
        )}
        {isFastPath && (
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <button
              onClick={() => setScreen('selection')}
              className="min-h-[44px] px-3 text-[13px] font-body text-ink-muted hover:text-ink transition-colors underline-offset-2 hover:underline"
            >
              Change Buddy
            </button>
            <span className="text-border-card text-xs">·</span>
            <button
              onClick={() => setScreen('picker')}
              className="min-h-[44px] px-3 text-[13px] font-body text-ink-muted hover:text-ink transition-colors underline-offset-2 hover:underline"
            >
              Change Routine
            </button>
          </div>
        )}
      </MotionDiv>

      <AnimatePresence>
        {showBuilder && (
          <MotionDiv
            className="w-full max-w-sm rounded-[20px] border border-border-card bg-surface-card p-3 shadow-soft text-ink mb-2.5 sm:p-4 sm:mb-4"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-ink">{routineName}</h3>
                <p className="text-[13px] sm:text-sm text-ink-muted font-body">{tasks.length} tasks · {totalMinutes} min total</p>
              </div>
              <button onClick={() => setShowBuilder(false)} className="h-11 rounded-2xl border border-border-card bg-[#FAF3E8] hover:bg-surface-card transition-colors flex items-center justify-center gap-2 px-3">
                <Settings2 className="w-[18px] h-[18px] text-ink-muted" />
                <span className="text-xs font-display font-semibold text-ink">Done</span>
                <ChevronUp className="w-4 h-4 text-ink-muted" />
              </button>
            </div>

            <MotionDiv className="pr-1" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-2 pb-1">
                {tasks.map((task) => (
                  <TaskBuilderItem
                    key={task.id}
                    task={task}
                    onDurationChange={(delta) => updateTaskDuration(task.id, delta)}
                    onDelete={() => deleteTask(task.id)}
                    onTitleChange={(title) => updateTaskTitle(task.id, title)}
                  />
                ))}
              </Reorder.Group>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setShowPicker(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-border-card hover:border-accent/50 hover:bg-accent/5 transition-colors text-sm font-display font-semibold text-ink-muted hover:text-ink"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Task
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-border-card bg-accent/10 hover:bg-accent/20 transition-colors text-sm font-display font-semibold text-ink disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : hasSavedRoutine ? 'Saved' : 'Save'}
                </button>
              </div>
              <p className="text-xs text-ink-muted text-center mt-2 font-body">Drag to reorder · Tap +/- to adjust time</p>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Task Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <MotionDiv
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
            <MotionDiv
              className="relative w-full max-w-md max-h-[70vh] bg-surface-card border-t border-border-card rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-card shrink-0">
                <h3 className="font-display font-bold text-lg text-ink">Add a Task</h3>
                <button onClick={() => setShowPicker(false)} aria-label="Close" className="w-10 h-10 rounded-full bg-[#FAF3E8] flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
                {getTasksForRoutine(routineType).map((libTask) => (
                  <button
                    key={libTask.key}
                    onClick={() => addTaskFromLibrary(libTask)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border-card bg-[#FAF3E8] hover:bg-surface-card hover:border-border-card transition-colors text-left"
                  >
                    <span className="text-2xl shrink-0">{libTask.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-sm text-ink truncate">{libTask.label}</div>
                      <div className="text-xs text-ink-muted font-body">{libTask.defaultMinutes} min</div>
                    </div>
                    <PlusCircle className="w-5 h-5 text-ink-muted/50 shrink-0" />
                  </button>
                ))}
                <div className="pt-2 border-t border-border-card">
                  <button
                    onClick={() => { addBlankTask(); setShowPicker(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-border-card hover:border-accent/40 hover:bg-accent/5 transition-colors text-left"
                  >
                    <span className="text-2xl shrink-0">❓</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-sm text-ink">Custom Task</div>
                      <div className="text-xs text-ink-muted font-body">Name it yourself</div>
                    </div>
                    <PlusCircle className="w-5 h-5 text-accent/60 shrink-0" />
                  </button>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskBuilderItem({ task, onDurationChange, onDelete, onTitleChange }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={task}
      dragControls={dragControls}
      dragListener={false}
      className="flex flex-col gap-2 py-3 px-3.5 rounded-2xl bg-[#FAF3E8] border border-border-card"
      whileDrag={{ scale: 1.03, boxShadow: '0 10px 24px rgba(74, 52, 38, 0.18)' }}
    >
      {/* Row 1 — task name, full width */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation();
            dragControls.start(event);
          }}
          className="shrink-0 -ml-2 w-9 h-9 flex items-center justify-center rounded-lg touch-none cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-ink-muted/60" />
        </button>
        <span className="text-lg shrink-0">{task.itemEmoji}</span>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onTitleChange(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Task name..."
          aria-label="Task name"
          className="flex-1 min-w-0 bg-transparent font-display font-semibold text-base text-ink placeholder:text-ink-muted/50 outline-none border-b border-transparent focus:border-border-card truncate"
        />
      </div>
      {/* Row 2 — duration stepper + delete, aligned right under the title */}
      <div className="flex items-center justify-end gap-1.5 pl-9">
        <div className="flex items-center rounded-xl border border-border-card bg-white/70 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onDurationChange(-1); }}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={task.durationMinutes <= 1}
            aria-label="Less time"
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-card transition-colors disabled:opacity-30 text-ink"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="min-w-[3rem] px-1 text-center font-display font-bold text-sm" style={{ color: task.themeColor }}>
            {task.durationMinutes}m
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDurationChange(1); }}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={task.durationMinutes >= 60}
            aria-label="More time"
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-card transition-colors disabled:opacity-30 text-ink"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Remove task"
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-ink-muted/60 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}
