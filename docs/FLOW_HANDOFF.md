# Task Buddies routine flow — handoff notes for Lovou

Purpose: port the **flow and interaction model** of the Task Buddies routine player back
into Lovou's BuddyTimer. Keep Lovou's visual design (palette, type, surfaces). Everything
below is about sequencing, state, timing and copy — not styling.

Reference implementation: `src/store/useRoutineStore.js`, `src/pages/ActivePlayer.jsx`,
`src/pages/RoutineSetup.jsx`, `src/pages/RoutineComplete.jsx`, `src/App.jsx`.

---

## 1. Screen sequence

```
selection (pick buddy)
  -> picker (Bedtime / Morning / Homework / Custom)
     -> customList (only for Custom)
  -> setup (task list, Start button, collapsible editor)
     -> player
        -> complete
```

Rules worth copying:

- **Returning-user fast path.** After the first completed run, persist `lastBuddy`,
  `lastRoutine`, `hasCompletedRun`. On launch, if all three exist (and the custom routine
  still exists), skip straight to **setup** with those preselected. Setup shows two small
  text links — "Change Buddy" / "Change Routine" — so nothing is lost. Kids open the app and
  are one tap from Start.
- **Time-of-day suggestion, not auto-select.** Picker highlights one tile with a
  "Suggested" tag: 18:00–05:00 Bedtime, 05:00–10:00 Morning, weekdays 14:00–18:00 Homework.
  It never chooses for the user.
- **Back navigation slides the opposite way.** Give each screen a depth number; animate
  x: +30→0 when depth increases, −30→0 when it decreases.
- **Validate stale ids.** If the persisted buddy or routine no longer exists, fall back to
  selection rather than crash or show a missing sprite.

## 2. Setup screen

- Header: `"{Buddy}'s {Routine}"` (e.g. "Hoppy's Bedtime"). Subline: "Complete tasks to
  feed Hoppy."
- Buddy card with two stat chips: **Total** (sum of minutes) and **Buddy** (name).
- **Start Routine** is the only primary button. Task editing is behind a secondary
  "Edit Tasks ⌄" toggle so the default view is calm; the editor expands inline (no new
  screen).
- Editor rows: drag handle · emoji · editable title (16px, avoids iOS zoom) on row 1;
  `[−] 5m [+]` stepper + delete on row 2. Duration clamped 1–60 min.
- "Add Task" opens a bottom sheet listing the library filtered to this routine type, plus
  a "Custom Task — name it yourself" row at the bottom.
- Save is explicit here (`Save` → `Saved`), and the label reverts to `Save` on any further
  edit. Blank titles are filled with the library label or "Task" at start time.

## 3. Player — the core loop

### State machine (per task)

```
idle  --(timeLeft < boredThreshold)-->  bored  --(timer hits 0)-->  hungry
idle/bored  --(child taps "Done! Feed X")-->  hungry          (finish early)
idle/bored  --(parent taps "Skip Task")-->    hungry
hungry  --(tap "Feed X")-->  eating  --(3.0s sequence)-->  next task (idle) | complete
```

- `boredThreshold = max(30s, 20% of task duration)`. Bored is purely visual (sprite
  changes, ring pulses); it is the "nearly there" nudge.
- **The timer never punishes.** Hitting zero does not fail anything — it just makes the
  buddy hungry and reveals the Feed button. This is the key tonal difference: the buddy
  waits, it doesn't count down at the child.
- Feeding is gated: you cannot feed while `idle`; you must either wait or explicitly say
  "Done!". This stops a child skipping through by mashing one button.
- `Pause` / `Resume` only shows while waiting (idle/bored). `Skip Task` is a low-emphasis
  text link, hidden while hungry (it would be a no-op).
- Cancelling (✕ top-left) asks **"Stop Routine?" — Keep Going / Stop Routine** and returns
  to setup, not to the buddy picker.

### Timer implementation notes

- Store `timerEndsAt` (absolute epoch ms), not just `timeLeft`. Each tick recomputes
  `timeLeft = round((timerEndsAt − now) / 1000)`. This survives backgrounding, tab discard
  and app kill.
- Re-sync on `visibilitychange`, `focus` and `pageshow`. On cold start, if persisted state
  is `player` + running, restart the interval from `timerEndsAt` (or fire the hungry
  transition immediately if it already elapsed).
- Persist the whole routine store (zustand `persist`), but never persist the interval id.

### Eating sequence (3.0 s total, all client-side timeouts)

| t (ms) | Event |
| --- | --- |
| 0 | Treat item starts flying from the "Next Treat" badge toward the buddy |
| 400 | Sprite → jaw-open |
| 600 | Item hidden, sprite → chomp, particle burst in the task's theme colour |
| 1200 | Particles off, sprite → celebrating |
| 3000 | Reset, advance to next task (or go to complete) |

Buttons are hidden for the whole sequence so double-taps can't advance twice.

### Layout (top to bottom)

1. **Header row:** ✕ · routine name + `Task 3 of 5` · **segmented progress bar** · spacer.
   - One segment per task. Completed = success colour, current = accent filling
     left→right with `(total − left) / total`, upcoming = neutral.
   - This replaces a numeric countdown as the primary progress cue. Kids read "two more
     blocks" far better than "14:32".
2. **Task title** (large) + one-line instruction (see copy below). Animates on task change.
3. **Buddy card:** status pill top-left, "Next Treat" badge top-right (the item for this
   task), ring around the sprite. Ring is `timeLeft / totalTime`; it pulses when bored.
   Speech bubble "All done? Come feed me! 🐾" appears only when hungry.
4. **Action area** (mutually exclusive):
   - hungry → big **Feed {Buddy} {emoji}**
   - idle/bored + running → **Done! Feed {Buddy}** (secondary colour)
5. **Footer:** Pause/Resume card (waiting only) · "Skip Task" text link.

## 4. Complete screen

- Confetti runs 2–3 passes then stops (not infinite — battery and reduced-motion).
- Routine-aware closing line, addressed to the child:
  - bedtime: "{B} is ready for dreams. Sleep tight! 🌙"
  - morning: "What a great start! {B} is cheering for you. ☀️"
  - homework: "All done! {B} is proud of your focus today. 📚"
  - custom: "You did it! {B} is so happy you finished. ✨"
- **Reward chest** appears ~2 s after the celebration, *in a pre-reserved slot* so the
  layout doesn't jump. Closed → tap → 0.8 s "Opening…" → reveal. Rewards come from a
  parent-editable list; pick uses a **shuffle bag** (never repeat until every reward has
  been shown, tracked by `last_shown_at`).
- Rewards are connection moments, not screen time: "One minute of silly faces together",
  "Secret handshake — make it up right now!", "You choose tomorrow's breakfast".
- Single primary CTA: **Back to Buddies**. Stats grid (Tasks / Time / Buddy) and the
  completed-task checklist below it.

## 5. Copy voice (this is most of the "gentleness")

Write for the child looking at the screen, present tense, buddy as the subject.

| State | Task Buddies copy | Avoid |
| --- | --- | --- |
| running | "{B} is cheering you on. You've got this!" | "Timer running", "3:42 remaining" |
| paused | "Taking a break. Tap Resume when you are ready." | "Paused" alone |
| hungry | "{B} is hungry! Tap the button to feed {B}." | "Task time expired" |
| eating | "Yum! {B} loved that. Next task coming up..." | "Advancing to next task" |
| status pill | "Go, Go, Go!" / "Snack Time" / "Yum!" / "Paused" | "In progress" / "Complete" |
| finish early | "Done! Feed {B}" | "Mark complete" |
| skip | "Skip Task" (tiny, muted) | a prominent skip button |
| cancel dialog | "Stop Routine? — {B} will have to start again from the first task." Keep Going / Stop Routine | "Are you sure? Yes / No" |

Rules: never say *fail*, *late*, *expired*, *overdue*. Time is never shown as a countdown
number to the child. Casing: Title Case for titles/buttons/pills, sentence case for body.

## 6. Parent Area

- Behind a **single times-table question** (3–9 × 3–9). Wrong answer → new question,
  "Not quite — try this one." Trivial for adults, a real wall for under-7s, and it
  satisfies Apple Kids Category / Play Families requirements for external links.
- Settings **auto-save** on every change (toggle + list). No Save button, no unsaved-changes
  trap. Destructive actions (delete reward, reset) use an in-app confirm dialog, not
  `window.confirm`.
- All external links (privacy, support, cross-promo) live only here, open in the system
  browser, and are allow-listed by hostname.

## 7. Small things that add up

- 44 px minimum touch targets everywhere, including text links (`min-h-[44px]`).
- `hoverOnlyWhenSupported` (Tailwind) or `@media (hover: hover)` so tapped buttons don't
  stay highlighted on touch.
- `<MotionConfig reducedMotion="user">` so framer-motion honours the OS setting; CSS
  `prefers-reduced-motion` alone doesn't cover it.
- Inputs ≥ 16 px font, or the iOS WebView zooms on focus.
- Every icon-only button has an `aria-label`; the rewards toggle is `role="switch"`.
- Task library labels ≤ ~16 chars so they fit picker chips ("TV Off", not
  "Screen Time Off — TV").
