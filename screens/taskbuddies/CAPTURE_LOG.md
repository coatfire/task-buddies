# Capture log

Every capture is of the real app, driven through its UI from a fresh install by `films/_pipeline/capture.mjs` (dev server, http://localhost:5173) or `films/tb-04-what-it-doesnt-ask/verify.mjs` (production build, http://localhost:4173). Viewport 390x844 at device scale 3, `isMobile`, touch, iPhone 14 user agent, reduced motion off, light scheme. Recordings are CDP screencasts conformed to 60 fps (`encode-rec.mjs`). Nothing was seeded into the app's store.

## Crops to keep another product out of frame

| File | Clip (CSS px, x y w h) | Why |
|---|---|---|
| `screens/taskbuddies/03-parent-area.png` | 0 0 390 250 | Lovou card below this line |
| `screens/taskbuddies/22-routine-finished.png` | 0 0 390 570 | Lovou card below this line |
| `screens/taskbuddies/23-reward-chest.png` | 0 0 390 572 | Lovou card below this line |
| `screens/taskbuddies/24-reward.png` | 0 0 390 621 | Lovou card below this line |
| `screens/taskbuddies/52-prod-finished.png` | 0 0 390 621 | Lovou card below this line |
| `screens/taskbuddies/53-prod-reopened.png` | 0 0 390 572 | Lovou card below this line |
| `video/setup-take.mp4` (in TB-02 only) | reframed to the top 29% of the screen from 4.39 s to 6.97 s | Lovou card in the Parent Area |

Discarded captures: none.

## Files

### `screens/taskbuddies/01-first-open.png`

- Session: setup. URL: http://localhost:5173/
- first open after a fresh install
- Actions to reach it:
  - fresh install, open http://localhost:5173

### `screens/taskbuddies/02-parent-gate.png`

- Session: setup. URL: http://localhost:5173/
- parent gate on first open
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"

### `screens/taskbuddies/03-parent-area.png`

- Session: setup. URL: http://localhost:5173/
- Parent Area on first open
- Cropped to 390x250 CSS px from the top.
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"

### `screens/taskbuddies/04-buddy-selection.png`

- Session: setup. URL: http://localhost:5173/
- buddy selection, Hoppy first
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"

### `screens/taskbuddies/05-routine-picker.png`

- Session: setup. URL: http://localhost:5173/
- routine type picker
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"
  - choose Hoppy

### `screens/taskbuddies/06-homework-default.png`

- Session: setup. URL: http://localhost:5173/
- Homework routine with its default tasks
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"
  - choose Hoppy
  - tap "Homework"

### `screens/taskbuddies/07-homework-editor.png`

- Session: setup. URL: http://localhost:5173/
- task editor open with the default Homework tasks
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"
  - choose Hoppy
  - tap "Homework"
  - tap "Edit tasks"
  - parent gate asks 8 × 3; type 24
  - tap "Continue"

### `screens/taskbuddies/08-homework-tasks.png`

- Session: setup. URL: http://localhost:5173/
- tasks set: Unpack Backpack, Have a Snack, Homework, Tidy up
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"
  - choose Hoppy
  - tap "Homework"
  - tap "Edit tasks"
  - parent gate asks 8 × 3; type 24
  - tap "Continue"
  - remove task "Reading"
  - remove task "Pack Backpack for Tomorrow"
  - tap "Add task"
  - tap "Custom task"
  - type "Tidy up"

### `screens/taskbuddies/09-homework-edited.png`

- Session: setup. URL: http://localhost:5173/
- Homework 25 min, Have a Snack moved to the top
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"
  - choose Hoppy
  - tap "Homework"
  - tap "Edit tasks"
  - parent gate asks 8 × 3; type 24
  - tap "Continue"
  - remove task "Reading"
  - remove task "Pack Backpack for Tomorrow"
  - tap "Add task"
  - tap "Custom task"
  - type "Tidy up"
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - drag "Have a Snack" from position 2 to position 1

### `screens/taskbuddies/10-homework-ready.png`

- Session: setup. URL: http://localhost:5173/
- routine ready, buddy waiting, Start routine
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 7; type 28
  - tap "Open Parent Area"
  - tap "Done"
  - choose Hoppy
  - tap "Homework"
  - tap "Edit tasks"
  - parent gate asks 8 × 3; type 24
  - tap "Continue"
  - remove task "Reading"
  - remove task "Pack Backpack for Tomorrow"
  - tap "Add task"
  - tap "Custom task"
  - type "Tidy up"
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - Homework: tap + (more time)
  - drag "Have a Snack" from position 2 to position 1
  - tap "Save"
  - tap "Done" to close the editor
  - scroll back to the top

### `screens/taskbuddies/video/setup-take.mp4`

- Session: setup. URL: http://localhost:5173/
- continuous take, real speed, no cuts
- Duration 36.68 s, 640 source frames.
- Actions to reach it:
  - 1.50 s: tap "Set up"
  - 3.11 s: parent gate asks 4 × 7; type 28
  - 4.39 s: tap "Open Parent Area"
  - 6.16 s: tap "Done"
  - 9.82 s: choose Hoppy
  - 11.87 s: tap "Homework"
  - 14.39 s: tap "Edit tasks"
  - 15.10 s: parent gate asks 8 × 3; type 24
  - 16.36 s: tap "Continue"
  - 18.14 s: remove task "Reading"
  - 19.06 s: remove task "Pack Backpack for Tomorrow"
  - 19.94 s: tap "Add task"
  - 20.92 s: tap "Custom task"
  - 21.77 s: type "Tidy up"
  - 24.40 s: Homework: tap + (more time)
  - 24.72 s: Homework: tap + (more time)
  - 25.05 s: Homework: tap + (more time)
  - 25.38 s: Homework: tap + (more time)
  - 25.72 s: Homework: tap + (more time)
  - 26.59 s: drag "Have a Snack" from position 2 to position 1
  - 29.36 s: tap "Save"
  - 30.52 s: tap "Done" to close the editor
  - 31.49 s: scroll back to the top

### `screens/taskbuddies/20-morning-ready.png`

- Session: morning. URL: http://localhost:5173/
- Morning routine ready: Get Dressed, Eat Breakfast, Brush Teeth, Put on Shoes, Pack Backpack
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top

### `screens/taskbuddies/21-morning-task1.png`

- Session: morning. URL: http://localhost:5173/
- running, task 1: Get Dressed
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"

### `screens/taskbuddies/21-morning-task2.png`

- Session: morning. URL: http://localhost:5173/
- running, task 2: Get Dressed
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"

### `screens/taskbuddies/21-morning-task3.png`

- Session: morning. URL: http://localhost:5173/
- running, task 3: Brush Teeth
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"

### `screens/taskbuddies/21-morning-task4.png`

- Session: morning. URL: http://localhost:5173/
- running, task 4: Brush Teeth
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"

### `screens/taskbuddies/21-morning-task5.png`

- Session: morning. URL: http://localhost:5173/
- running, task 5: Put on Shoes
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"

### `screens/taskbuddies/22-routine-finished.png`

- Session: morning. URL: http://localhost:5173/
- routine finished
- Cropped to 390x570 CSS px from the top.
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"
  - task 5 "Put on Shoes": tap "Done! Feed"

### `screens/taskbuddies/23-reward-chest.png`

- Session: morning. URL: http://localhost:5173/
- reward chest waiting
- Cropped to 390x572 CSS px from the top.
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"
  - task 5 "Put on Shoes": tap "Done! Feed"

### `screens/taskbuddies/24-reward.png`

- Session: morning. URL: http://localhost:5173/
- reward revealed
- Cropped to 390x621 CSS px from the top.
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"
  - task 5 "Put on Shoes": tap "Done! Feed"
  - tap the reward chest

### `screens/taskbuddies/video/morning-run.mp4`

- Session: morning. URL: http://localhost:5173/
- Start routine to reward, real speed; tasks finished with "Done! Feed Hoppy"
- Duration 59.52 s, 1450 source frames.
- Actions to reach it:
  - -0.01 s: tap "Start routine"
  - 4.86 s: task 1 "Get Dressed": tap "Done! Feed"
  - 14.01 s: task 2 "Get Dressed": tap "Done! Feed"
  - 22.17 s: task 3 "Brush Teeth": tap "Done! Feed"
  - 30.21 s: task 4 "Brush Teeth": tap "Done! Feed"
  - 39.42 s: task 5 "Put on Shoes": tap "Done! Feed"
  - 46.80 s: tap the reward chest

### `screens/taskbuddies/25-bedtime-ready.png`

- Session: morning. URL: http://localhost:5173/
- Bedtime routine with Hoppy, default tasks
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"
  - task 5 "Put on Shoes": tap "Done! Feed"
  - tap the reward chest
  - tap "Back to buddies"
  - choose Hoppy
  - tap "Bedtime"

### `screens/taskbuddies/26-bedtime-task1.png`

- Session: morning. URL: http://localhost:5173/
- Bedtime running, task 1
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"
  - task 5 "Put on Shoes": tap "Done! Feed"
  - tap the reward chest
  - tap "Back to buddies"
  - choose Hoppy
  - tap "Bedtime"
  - tap "Start routine"

### `screens/taskbuddies/27-bedtime-task2.png`

- Session: morning. URL: http://localhost:5173/
- Bedtime running, task 2
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 6 × 8; type 48
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 7 × 8; type 56
  - tap "Continue"
  - remove task "Go Potty"
  - remove task "Wash Face"
  - remove task "Brush Hair"
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - task 1 "Get Dressed": tap "Done! Feed"
  - task 2 "Get Dressed": tap "Done! Feed"
  - task 3 "Brush Teeth": tap "Done! Feed"
  - task 4 "Brush Teeth": tap "Done! Feed"
  - task 5 "Put on Shoes": tap "Done! Feed"
  - tap the reward chest
  - tap "Back to buddies"
  - choose Hoppy
  - tap "Bedtime"
  - tap "Start routine"
  - tap "Done! Feed Hoppy"

### `screens/taskbuddies/video/bedtime-run.mp4`

- Session: morning. URL: http://localhost:5173/
- Bedtime with the same buddy, real speed
- Duration 15.88 s, 460 source frames.
- Actions to reach it:
  - -0.01 s: tap "Start routine"
  - 6.08 s: tap "Done! Feed Hoppy"

### `screens/taskbuddies/30-bored.png`

- Session: timeout. URL: http://localhost:5173/
- under 30 s left on a 1 minute task: buddy bored
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 5; type 20
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 4 × 3; type 12
  - tap "Continue"
  - Get Dressed: tap - (less time)
  - Get Dressed: tap - (less time)
  - Get Dressed: tap - (less time)
  - Get Dressed: tap - (less time)
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - wait 33 s in real time

### `screens/taskbuddies/31-timer-ran-out.png`

- Session: timeout. URL: http://localhost:5173/
- time ran out: Feed button and bubble
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 4 × 5; type 20
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - choose Hoppy
  - tap "Morning"
  - tap "Edit tasks"
  - parent gate asks 4 × 3; type 12
  - tap "Continue"
  - Get Dressed: tap - (less time)
  - Get Dressed: tap - (less time)
  - Get Dressed: tap - (less time)
  - Get Dressed: tap - (less time)
  - tap "Save"
  - tap "Done"
  - scroll back to the top
  - tap "Start routine"
  - wait 33 s in real time
  - wait until the minute is up

### `screens/taskbuddies/video/feed.mp4`

- Session: timeout. URL: http://localhost:5173/
- feeding after the timer ran out (real time)
- Duration 7.12 s, 285 source frames.
- Actions to reach it:
  - 1.49 s: tap "Feed Hoppy"

### `screens/taskbuddies/40-select-hoppy.png`

- Session: buddies. URL: http://localhost:5173/
- selection carousel on Hoppy
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 7 × 5; type 35
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area

### `screens/taskbuddies/40-select-snapper.png`

- Session: buddies. URL: http://localhost:5173/
- selection carousel on Snapper
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 7 × 5; type 35
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - tap "Next buddy"

### `screens/taskbuddies/40-select-snoozy.png`

- Session: buddies. URL: http://localhost:5173/
- selection carousel on Snoozy
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 7 × 5; type 35
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - tap "Next buddy"
  - tap "Next buddy"

### `screens/taskbuddies/40-select-flutty.png`

- Session: buddies. URL: http://localhost:5173/
- selection carousel on Flutty
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 7 × 5; type 35
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - tap "Next buddy"
  - tap "Next buddy"
  - tap "Next buddy"

### `screens/taskbuddies/40-select-buddy.png`

- Session: buddies. URL: http://localhost:5173/
- selection carousel on Buddy
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 7 × 5; type 35
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - tap "Next buddy"
  - tap "Next buddy"
  - tap "Next buddy"
  - tap "Next buddy"

### `screens/taskbuddies/video/selection.mp4`

- Session: buddies. URL: http://localhost:5173/
- browsing all five buddies, then choosing Snoozy
- Duration 18.48 s, 532 source frames.
- Actions to reach it:
  - 2.68 s: tap "Next buddy"
  - 5.31 s: tap "Next buddy"
  - 7.82 s: tap "Next buddy"
  - 10.46 s: tap "Next buddy"
  - 12.83 s: tap "Previous buddy"
  - 13.97 s: tap "Previous buddy"
  - 15.81 s: choose Snoozy

### `screens/taskbuddies/41-snoozy-ready.png`

- Session: buddies. URL: http://localhost:5173/
- Morning routine with Snoozy
- Actions to reach it:
  - fresh install, open http://localhost:5173
  - tap "Set up"
  - parent gate asks 7 × 5; type 35
  - tap "Open Parent Area"
  - tap "Done" in the Parent Area
  - tap "Next buddy"
  - tap "Next buddy"
  - tap "Next buddy"
  - tap "Next buddy"
  - tap "Previous buddy"
  - tap "Previous buddy"
  - choose Snoozy
  - tap "Morning"

### `screens/taskbuddies/video/snoozy-run.mp4`

- Session: buddies. URL: http://localhost:5173/
- Snoozy in a running Morning routine: idle, chomp, celebrate, next task
- Duration 8.32 s, 363 source frames.
- Actions to reach it:
  - -0.02 s: tap "Start routine"
  - 2.05 s: tap "Done! Feed Snoozy"

### `screens/taskbuddies/50-prod-first-open.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build, first open
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile

### `screens/taskbuddies/51-prod-ready.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build: Homework routine saved, ready
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile
  - [session 1] tap "Set up"
  - [session 1] parent gate 8 × 6, type 48
  - [session 1] tap "Open Parent Area"
  - [session 1] tap "Done"
  - [session 1] choose Hoppy
  - [session 1] tap "Homework"
  - [session 1] tap "Edit tasks"
  - [session 1] parent gate 8 × 3, type 24
  - [session 1] tap "Continue"
  - [session 1] remove "Reading"
  - [session 1] remove "Pack Backpack for Tomorrow"
  - [session 1] tap "Add task"
  - [session 1] tap "Custom task"
  - [session 1] type "Tidy up"
  - [session 1] tap "Save"
  - [session 1] tap "Done"
  - [session 1] scroll to the top

### `screens/taskbuddies/52-prod-finished.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build: routine finished, reward
- Cropped to 390x621 CSS px from the top.
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile
  - [session 1] tap "Set up"
  - [session 1] parent gate 8 × 6, type 48
  - [session 1] tap "Open Parent Area"
  - [session 1] tap "Done"
  - [session 1] choose Hoppy
  - [session 1] tap "Homework"
  - [session 1] tap "Edit tasks"
  - [session 1] parent gate 8 × 3, type 24
  - [session 1] tap "Continue"
  - [session 1] remove "Reading"
  - [session 1] remove "Pack Backpack for Tomorrow"
  - [session 1] tap "Add task"
  - [session 1] tap "Custom task"
  - [session 1] type "Tidy up"
  - [session 1] tap "Save"
  - [session 1] tap "Done"
  - [session 1] scroll to the top
  - [session 1] tap "Start routine"
  - [session 1] task 1: tap "Done! Feed Hoppy"
  - [session 1] task 2: tap "Done! Feed Hoppy"
  - [session 1] task 3: tap "Done! Feed Hoppy"
  - [session 1] task 4: tap "Done! Feed Hoppy"
  - [session 1] open the reward chest

### `screens/taskbuddies/53-prod-reopened.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build, reopened: "All Done!"
- Cropped to 390x572 CSS px from the top.
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile
  - [session 1] tap "Set up"
  - [session 1] parent gate 8 × 6, type 48
  - [session 1] tap "Open Parent Area"
  - [session 1] tap "Done"
  - [session 1] choose Hoppy
  - [session 1] tap "Homework"
  - [session 1] tap "Edit tasks"
  - [session 1] parent gate 8 × 3, type 24
  - [session 1] tap "Continue"
  - [session 1] remove "Reading"
  - [session 1] remove "Pack Backpack for Tomorrow"
  - [session 1] tap "Add task"
  - [session 1] tap "Custom task"
  - [session 1] type "Tidy up"
  - [session 1] tap "Save"
  - [session 1] tap "Done"
  - [session 1] scroll to the top
  - [session 1] tap "Start routine"
  - [session 1] task 1: tap "Done! Feed Hoppy"
  - [session 1] task 2: tap "Done! Feed Hoppy"
  - [session 1] task 3: tap "Done! Feed Hoppy"
  - [session 1] task 4: tap "Done! Feed Hoppy"
  - [session 1] open the reward chest
  - [session 1] close the browser
  - [session 2 (reopened)] relaunch with the same profile and open http://localhost:4173
  - [session 2 (reopened)] app opens on "All Done!"

### `screens/taskbuddies/54-prod-reopened-ready.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build, reopened: Homework routine
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile
  - [session 1] tap "Set up"
  - [session 1] parent gate 8 × 6, type 48
  - [session 1] tap "Open Parent Area"
  - [session 1] tap "Done"
  - [session 1] choose Hoppy
  - [session 1] tap "Homework"
  - [session 1] tap "Edit tasks"
  - [session 1] parent gate 8 × 3, type 24
  - [session 1] tap "Continue"
  - [session 1] remove "Reading"
  - [session 1] remove "Pack Backpack for Tomorrow"
  - [session 1] tap "Add task"
  - [session 1] tap "Custom task"
  - [session 1] type "Tidy up"
  - [session 1] tap "Save"
  - [session 1] tap "Done"
  - [session 1] scroll to the top
  - [session 1] tap "Start routine"
  - [session 1] task 1: tap "Done! Feed Hoppy"
  - [session 1] task 2: tap "Done! Feed Hoppy"
  - [session 1] task 3: tap "Done! Feed Hoppy"
  - [session 1] task 4: tap "Done! Feed Hoppy"
  - [session 1] open the reward chest
  - [session 1] close the browser
  - [session 2 (reopened)] relaunch with the same profile and open http://localhost:4173
  - [session 2 (reopened)] app opens on "All Done!"
  - [session 2 (reopened)] tap "Back to buddies"
  - [session 2 (reopened)] choose Hoppy
  - [session 2 (reopened)] tap "Homework"

### `screens/taskbuddies/55-prod-reopened-tasks.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build, reopened: saved tasks still there
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile
  - [session 1] tap "Set up"
  - [session 1] parent gate 8 × 6, type 48
  - [session 1] tap "Open Parent Area"
  - [session 1] tap "Done"
  - [session 1] choose Hoppy
  - [session 1] tap "Homework"
  - [session 1] tap "Edit tasks"
  - [session 1] parent gate 8 × 3, type 24
  - [session 1] tap "Continue"
  - [session 1] remove "Reading"
  - [session 1] remove "Pack Backpack for Tomorrow"
  - [session 1] tap "Add task"
  - [session 1] tap "Custom task"
  - [session 1] type "Tidy up"
  - [session 1] tap "Save"
  - [session 1] tap "Done"
  - [session 1] scroll to the top
  - [session 1] tap "Start routine"
  - [session 1] task 1: tap "Done! Feed Hoppy"
  - [session 1] task 2: tap "Done! Feed Hoppy"
  - [session 1] task 3: tap "Done! Feed Hoppy"
  - [session 1] task 4: tap "Done! Feed Hoppy"
  - [session 1] open the reward chest
  - [session 1] close the browser
  - [session 2 (reopened)] relaunch with the same profile and open http://localhost:4173
  - [session 2 (reopened)] app opens on "All Done!"
  - [session 2 (reopened)] tap "Back to buddies"
  - [session 2 (reopened)] choose Hoppy
  - [session 2 (reopened)] tap "Homework"
  - [session 2 (reopened)] tap "Edit tasks"
  - [session 2 (reopened)] parent gate 3 × 5, type 15
  - [session 2 (reopened)] tap "Continue"
  - [session 2 (reopened)] tasks after reopening: Unpack Backpack, Have a Snack, Homework, Tidy up

### `screens/taskbuddies/56-prod-reopened-tasks-all.png`

- Session: tb04-verify. URL: http://localhost:4173/
- production build, reopened: all four saved tasks, including the typed "Tidy up"
- Actions to reach it:
  - [session 1] open http://localhost:4173 in a fresh profile
  - [session 1] tap "Set up"
  - [session 1] parent gate 8 × 6, type 48
  - [session 1] tap "Open Parent Area"
  - [session 1] tap "Done"
  - [session 1] choose Hoppy
  - [session 1] tap "Homework"
  - [session 1] tap "Edit tasks"
  - [session 1] parent gate 8 × 3, type 24
  - [session 1] tap "Continue"
  - [session 1] remove "Reading"
  - [session 1] remove "Pack Backpack for Tomorrow"
  - [session 1] tap "Add task"
  - [session 1] tap "Custom task"
  - [session 1] type "Tidy up"
  - [session 1] tap "Save"
  - [session 1] tap "Done"
  - [session 1] scroll to the top
  - [session 1] tap "Start routine"
  - [session 1] task 1: tap "Done! Feed Hoppy"
  - [session 1] task 2: tap "Done! Feed Hoppy"
  - [session 1] task 3: tap "Done! Feed Hoppy"
  - [session 1] task 4: tap "Done! Feed Hoppy"
  - [session 1] open the reward chest
  - [session 1] close the browser
  - [session 2 (reopened)] relaunch with the same profile and open http://localhost:4173
  - [session 2 (reopened)] app opens on "All Done!"
  - [session 2 (reopened)] tap "Back to buddies"
  - [session 2 (reopened)] choose Hoppy
  - [session 2 (reopened)] tap "Homework"
  - [session 2 (reopened)] tap "Edit tasks"
  - [session 2 (reopened)] parent gate 3 × 5, type 15
  - [session 2 (reopened)] tap "Continue"
  - [session 2 (reopened)] tasks after reopening: Unpack Backpack, Have a Snack, Homework, Tidy up
  - [session 2 (reopened)] scroll down to the end of the task list

