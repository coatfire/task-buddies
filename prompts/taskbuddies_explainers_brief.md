# Task Buddies explainer films: overnight run brief

Five films, one unattended run, one branch. Read this whole file before starting.

The studio prompt is `prompts/explainer_studio.md` (the base prompt with `{{TOPIC}}`, `{{AUDIENCE}}`, `{{OUTCOME}}`, `{{SECONDS}}`). Run it once per film using the inputs below. Where this file and the studio prompt disagree, this file wins.

This brief stands alone. The Lovou run's film 03 (in the Lovou repo) is superseded by TB-01 here for any Task Buddies use.

## 0. How this run works

- Branch: `content/taskbuddies-explainers-v1`, already created from `dev`. Never commit to `main` or `dev`. Never merge. Open one draft PR against `dev` at the end.
- One folder per film: `films/tb-01-what-it-is`, `films/tb-02-setup`, `films/tb-03-buddies`, `films/tb-04-what-it-doesnt-ask`, `films/tb-05-appstore-preview`. Commit after each film.
- Run order: TB-01, TB-03, TB-02, TB-05, TB-04. TB-04 depends on verification work and goes last.
- Nobody is awake. Do not stop to ask. Make the call, log it in that film's `DECISIONS.md`, keep moving.
- If a film fails verification twice, write what failed in `DECISIONS.md`, mark it FAILED and start the next one.
- Nothing from this run gets posted. Every output is a draft for human review.
- Do not change anything under `src/`, `public/`, `android/`, `ios/` or `landing/`. The films show the app as it is today.

### What is already set up (do not reinstall)

- Node 22.15, Playwright 1.63 with Chromium, ffmpeg 8.1.1 (libx264, aac), all on PATH. `npm install` has been run.
- `films/_pipeline/`: the deterministic renderer from the Lovou run, rethemed to Task Buddies.
  - `stage.html`, `engine.js`: every frame is a pure function of time. Layouts `9x16`, `4x5`, `1x1`, `store886`, `store1080`.
  - `lib.mjs`: `text()`, `screen()`, `clip()`, `endcard()` (logo plus `taskbuddies.app`), the reading-pace guard, and `writeDocs()` / `writeTimeline()` which write `SCRIPT.md`, `VO.md`, `captions.srt`, `STRINGS.txt` and `TIMELINE.json`. `screen('x')` points at `screens/taskbuddies/x.png`; `clip('x')` at `screens/taskbuddies/video/x.mp4`.
  - `render.mjs`, `deliver.mjs`: render cuts, storyboard, carousel stills (1080x1350 in `stills/`), posters and `contact.png`. `--store` gives Apple's constant-bitrate encode.
  - `screencast.mjs` (`startRec`, `stopRec`) and `encode-rec.mjs`: record a Playwright page repaint by repaint and conform it to constant 60 fps at 1170x2532.
  - There is no capture script and no report script yet. Write `films/_pipeline/capture.mjs` and `films/_pipeline/report.mjs` yourself. The Lovou repo (`../Fancast AI - kiro/DreamStation-Restyled/Dreamstation/films/_pipeline/explore.mjs`, `report.mjs`) can be read for the pattern; do not copy anything Lovou-specific.
- `brand/taskbuddies/`: `logo.svg`, `logo.png`, `icon.png` and `tokens.json` (palette, type, sprite facts, pulled from the app's own config). Log in TB-01's `DECISIONS.md` that the tokens came from the app's stylesheets.

### Replaces the `<autonomy>` block in the studio prompt

Creative calls: decide and log. Claims: never decide. If a statement about what the app does, stores or costs is not backed by the Task Buddies codebase, a capture you made tonight or the store material in this repo (`docs/STORE_RELEASE.md`), cut the statement and log the cut. Do not soften it, do not reword it into something vaguer, do not keep it "for review". Cut it.

## Before film one: read the app

Write `APP_FACTS.md` at repo root from the Task Buddies codebase only. Every later film draws its facts from this file. Start from these files, but confirm every fact yourself:

- Name: `vite.config.js` (PWA manifest), `capacitor.config.ts`, `index.html`, `src/components/Logo.jsx`.
- Routine types: `src/pages/RoutinePicker.jsx`, `src/store/taskLibrary.js`, `src/store/useRoutineStore.js`.
- Buddy roster and order: `src/data/characters.js`, `src/pages/CharacterSelection.jsx`.
- Running and finishing a routine: `src/pages/ActivePlayer.jsx`, `src/pages/RoutineComplete.jsx`, `src/data/rewards.json`.
- Set-up and first open: `src/pages/FirstRunSetup.jsx`, `src/pages/RoutineSetup.jsx`, `src/pages/CustomRoutineList.jsx`.
- Parent gate: `src/pages/ParentGate.jsx`, `src/store/parentGating.test.js`, `src/pages/Settings.jsx`.
- Storage and network: `src/platform/storage.js`, `src/store/localStore.js`, `src/platform/externalLinks.js`, `src/platform/nativeRuntime.js`, `index.html`, `package.json` dependencies.
- Store material: `docs/STORE_RELEASE.md` ("Privacy and child-safety declarations").

Record:

- The exact product name as shown in the app and manifest.
- The routine types that exist today, with their labels exactly as the picker shows them.
- The full buddy roster: names as shown in the app, in the order the app shows them. The sprite folder `public/buddy-watercolor/` also holds sheets for characters that are not in the app. Only ids in `src/data/characters.js` count.
- What a buddy does during a routine (idle, bored, chomp, celebrate states; what happens when the timer runs out; the "Done" and "Feed" buttons) and what happens when a routine is finished (reward chest, reward text, summary).
- Whether there is any account, sign-up, login or email capture.
- Where data is stored (keys and storage backend on web and native) and whether any network request carries user data.
- Whether there are ads, analytics or third-party scripts. List each one found, including fonts and anything loaded from a CDN.
- Whether there is any payment, purchase or upgrade path.
- Where the parent gate sits, what the challenge is and what is behind it.
- Every place the app names another product, and what triggers it to show. Expect at least: the Lovou card on the routine-finished screen, the Lovou card in the Parent Area, and the "Lovou on Instagram" and "Lovou on TikTok" links in the Parent Area.
- Every piece of the app's own copy that would break the house rules if it were the film's own words (exclamation marks such as "Done! Feed Hoppy", em dashes such as the parent gate's wrong-answer message, US spellings, the buddy trait lines, the routine descriptions).

For each fact give the file path and line. If the code is unclear, write UNKNOWN. An UNKNOWN fact cannot be stated in any film.

## Assets and capture

- Brand: `./brand/taskbuddies` only, plus sprite sheets from `public/buddy-watercolor/` for buddies in the roster.
- Capture the UI yourself with Playwright from the real app running locally. Do not redraw the UI from imagination and do not build look-alike mock screens.
  - Films TB-01, TB-02, TB-03, TB-05: run `npm run dev` (http://localhost:5173). The first page load after Vite re-optimises dependencies can take over 30 s, so load the page once before any timed take and give `page.goto` a 120 s timeout. TB-04: run `npm run build:web` then `npm run preview` (http://localhost:4173), so the network log reflects the built app and not the Vite dev server.
  - Viewport 390x844 at device scale factor 3, `isMobile: true`, `hasTouch: true`, an iPhone Safari user agent, `reducedMotion: 'no-preference'`, `colorScheme: 'light'`. Do not copy the `reducedMotion: 'reduce'` setting from `scripts/screenshots/capture.mjs`.
  - Every capture session starts from a fresh browser context, so the app opens as a first install. Do not pre-set `task-buddy:setup-complete` or any other storage key.
  - Drive everything through the UI as a parent would: taps, typing, drags. The dev build exposes the store as `window.__tb`. You may read it to log state. Never write to it to create a state you then capture.
  - The parent gate asks a multiplication question. Read the numbers off the screen and type the right answer. Never capture the wrong-answer message.
  - Long task timers: use the app's own "Done! Feed <buddy>" button to finish a task. If a film needs the timer-ran-out state, use Playwright's `page.clock` (installed before page load) to move time on, and log it. Never do this inside TB-02's continuous take.
  - Save PNGs to `./screens/taskbuddies/<step>.png`. Write `./screens/taskbuddies/CAPTURE_LOG.md` listing each file, the URL, the actions taken to reach it, and any crop.
  - Capture states as well as screens: first open, parent gate, routine type picker, routine setup, buddy selection, routine running, task finished (chomp), timer ran out (bored and Feed button), routine finished, reward revealed.
  - Buddy sprites are animated. Record those moments with `films/_pipeline/screencast.mjs` and conform with `encode-rec.mjs` to 60 fps, or step the frames straight from the sheets (`<id>-<state>.webp`, 1024x1024, a 4x4 grid of 256 px frames). The sprites are painted, not pixel art: scale with Lanczos, never enlarge a frame beyond 2x its source size, and never redraw, recolour, smooth or restyle them.
  - Set up routines through the UI as a parent would. Use the task names written in the films below.
- Other products in the app. The app shows Lovou cards and Lovou social links on some screens. None of it may appear in any film.
  - Frame it out, never edit it out. You may crop a screenshot or a recording (Playwright `clip`, or an ffmpeg crop) so that no pixel of the card or link is in frame. Do not hide, delete or restyle anything in the app's DOM.
  - The routine-finished screen shows the Lovou card below "Back to buddies", fading in about 0.55 s after the screen appears. Crop the still above the card, and end or crop any recording of that screen before the card's top edge enters frame.
  - In the Parent Area, capture only regions that contain no Lovou card and no social links.
  - If a capture cannot be framed so the other product is fully out, discard it and log it. Log every crop in `CAPTURE_LOG.md` with the clip rectangle.
- If a screen a film needs cannot be captured: build that beat as a plain labelled frame in brand tokens (the `placeholder` element), list it in `MISSING.md`, and stamp the film DRAFT in the report. Do not invent interface.

## Voice

- No synthetic voice. No text to speech.
- Every film must work fully with the sound off. On-screen words carry it.
- Write an optional proposed voiceover to `VO.md` with timecodes. Build `captions.srt` from the on-screen words if no VO is used.
- Sound bed: optional. If used, it must be soft, slow and chiptune-adjacent, with no sudden hits, made from scratch in ffmpeg (for example, gentle sine or square tones under a low-pass filter, at least 12 dB under where a voice would sit), and logged in `DECISIONS.md`. No downloaded or stock music. If in doubt, ship the silent track.

## 1. House rules (apply to every word on screen, every caption, every VO line)

These rules apply to the film's own words. Text inside a real capture is shown as the app has it and is never edited. List every such string that would break a rule (for example "Done! Feed Hoppy", "Grown-Ups Only", "Pack Backpack", "Pajamas") in the report under "App copy shown as captured", so the founder can fix the app copy and recapture if wanted.

### Name

- Use the name exactly as recorded in `APP_FACTS.md`. Expected: Task Buddies, two words.
- No other product is named, shown, hinted at or linked. No "from the makers of". No second logo.
- One of the buddies is called Buddy. When film text means the character, write "Buddy". When it means whichever buddy the child picked, write "the buddy" or "their buddy", lower case. Avoid lines where the two could be confused.

### Language

- British and Irish English.
- No em dashes. No exclamation marks.
- Plain, peer-level, parent to parent. Light and warm is fine. No wellness brand language. No clinical language. No numbered tips. No advice.
- Address the parent. Never address the child. Never call it a kids' app or an app for children. It is a parenting app.

### Words that never appear

- neurodivergent, ADHD, autism, diagnosis, therapy, therapeutic, clinical, evidence, proven, science-backed, study, executive function, regulate, regulation, dopamine, behaviour chart, behaviour problem, nagging, lazy, defiant, meltdown, body doubling.
- Do not describe the idea or method behind the app at all. Show what it does.

### Claims

- Describe what the app does. Never describe what it does for a child or a family.
- Allowed: "The buddy stays on screen for each task." Not allowed: "Mornings get easier." Not allowed: "They'll do it without being asked."
- No outcomes, no before and after, no testimonials, no user numbers, no ratings, no "parents say".
- No time claims ("set up in a minute") unless the film shows it happening in real time, uncut.
- "Free", "no sign-up", "no ads" and "stays on your device" may appear only where `APP_FACTS.md` confirms them, and in TB-04 only where the runtime log confirms them too.
- The studio prompt's "Proof" beat means: show the real app doing the thing on screen. It never means evidence that it works.

### Children and family

- No child is named, drawn, photographed, voiced or implied to be a real child. No hands, no bedrooms, no school uniforms.
- No name in any child-name field on screen. Leave it empty or use "your child". If the app asks for a name anywhere, leave it blank or type "your child", and log it.
- The child is never the problem in any frame or line. The parent is never mocked either.

### End card

- Task Buddies logo (`brand/taskbuddies/logo.svg`) and `taskbuddies.app`. Nothing else. TB-05 has no end card.

## 2. The five films

### Film TB-01: What Task Buddies is

- TOPIC: What Task Buddies is and how a routine runs in it.
- AUDIENCE: Parents who think a routine app is one more thing to set up and one more chart to keep on top of.
- OUTCOME: They can say: you pick a routine, and a buddy keeps your child company while they go through it, one task at a time.
- SECONDS: 30
- The question it answers: "Is this another chart I have to police?"
- The belief that turns out wrong: A routine app is a checklist with a timer.
- Beats
  - Question: a plain paper-style checklist, half ticked, drawn in brand tokens.
  - Model: the checklist folds down into a single task on screen, with a buddy beside it.
  - Proof: one real Morning routine run from first task to last using captured screens. Tasks, using the app's own task labels: Get Dressed, Eat Breakfast, Brush Teeth, Put on Shoes, Pack Backpack. Set them up through the UI (remove the other defaults). Include whatever the app really does when the routine is finished (the summary and the reward chest), cropped clear of the Lovou card.
  - Turn: swap to a different routine type from `APP_FACTS.md` (Bedtime is the natural pick) and show the same buddy carrying on.
  - Payoff: the checklist from the opening, replaced by the buddy. End card.
- Cut list (stays out): how it is built, where data lives, the parent gate, the full buddy roster.
- On-screen word bank (max 8 words a line): "Not another chart." / "Pick a routine." / "One thing at a time." / "The buddy stays with them."

### Film TB-03: Meet the buddies

- TOPIC: Who the buddies are.
- AUDIENCE: Parents wondering whether their child would actually like the thing on the screen.
- OUTCOME: They can name two or three buddies and say that their child picks one.
- SECONDS: 20
- The question it answers: "Who is the buddy?"
- The belief that turns out wrong: The buddy is one generic mascot.
- Beats
  - Question: a single silhouette where a mascot would be (the first buddy's idle frame filled flat in ink colour).
  - Model: the silhouette fills in as the first buddy, then the others arrive one at a time in the app's own order, each with its name from `APP_FACTS.md` and its real idle animation stepped from its sheet.
  - Proof: the real buddy selection screen, captured. One is chosen by tapping its "Choose" button.
  - Turn: the chosen buddy shown in a running routine, reacting as the app really has it react (chomp when a task is done, celebrate at the end).
  - Payoff: the full roster together, the chosen one stepping forward. End card.
- Hard limits for this film
  - Names, order and animations come from the app. Do not give buddies personalities, catchphrases, backstories or favourite things beyond what the app shows. The trait lines on the selection screen ("Energetic & Bouncy" and so on) may be seen inside the capture but are not repeated as film text.
  - Show every buddy in the roster or state on screen how many there are. Do not imply more than exist. Never show a sheet from `public/buddy-watercolor/` whose id is not in the roster.
  - Real sprites only. No redrawn, smoothed or restyled versions.
- On-screen word bank: "Who's the buddy?" / "They choose." / the buddy names themselves / "Then they get going together."

### Film TB-02: Setting up a routine

- TOPIC: How a parent sets up a routine.
- AUDIENCE: Parents who assume set-up means an account, a tutorial and twenty settings.
- OUTCOME: They can say the steps: open it, pick the kind of routine, put in the tasks, hand it over.
- SECONDS: 35
- The question it answers: "How much work is this before it's any use?"
- The belief that turns out wrong: Set-up is a project.
- Beats
  - Question: a long, grey sign-up form scrolling, drawn in brand tokens. This is what people brace for.
  - Model: the form collapses to the real first screen of the app.
  - Proof: the real set-up flow, captured in one continuous take from a fresh install: first open, parent gate, routine type, tasks, timings. The app has no after-school type, so use the Homework routine and set its tasks to: Unpack Backpack, Have a Snack, Homework, and one typed task "Tidy up". Remove the other defaults.
  - Turn: edit one task (its name or its minutes) and drag another to a new position, to show it bends to the household.
  - Payoff: the phone turned round, routine ready, buddy waiting. "Turned round" is a simple card flip of the captured screen in brand tokens, not a device mock-up or a hand.
  - The on-screen label for this routine is whatever the app shows (Homework). Do not call it an after-school routine in film text unless the app does.
- Hard limits for this film
  - The set-up take plays at real speed or is honestly marked as sped up with an on-screen "x2". No hidden cuts.
  - If `APP_FACTS.md` shows any account or sign-up step, the Question beat changes: do not contrast against a sign-up form. Open on a blank routine instead.
  - Show the parent gate plainly. It is part of the app and part of why this is a parenting app.
- On-screen word bank: "Open it." / "Pick the kind of routine." / "Add what needs doing." / "Change it whenever." / "Hand it over."

### Film TB-05: App Store preview

- TOPIC: Task Buddies in the time it takes to decide whether to tap Get.
- AUDIENCE: A parent on the store listing who has read one line of the description.
- OUTCOME: They can say what they would do with it tomorrow morning.
- SECONDS: 20
- Build: a recut from the TB-01 and TB-02 captures. Not a new film.
- Beats: routine set-up, buddy chosen, routine running, routine finished. No Question beat. No end card. No web address.
- Hard limits for this film
  - Real app screens only, full frame. No device mock-ups, no people, no scenes outside the app. Full frame means the capture fills the frame; where the routine-finished screen is cropped to keep the Lovou card out, fill the rest with the app's own background colour (`#FAF3E8`) and log it.
  - Before exporting, look up Apple's current app preview requirements (length, resolutions, frame rate, audio) and export to those. Record what you found and the link in `SOURCES.md`. If you cannot confirm them, export portrait 886x1920 and 1080x1920 at 30 fps and flag it UNVERIFIED in the report.
  - The app was submitted as a parenting app, not in the Kids category. Every word must speak to the parent. Nothing may read as marketing aimed at a child.
  - No pricing, no "free", no comparisons with other apps, no mention of any other product.
  - On-screen text is optional. If used, at most four words a line (pass `maxWords: 4` to `text()`).
- Deliverables differ: portrait cuts only (`--layouts store886,store1080 --store`), plus one poster frame per cut. No 4:5 or 1:1, no carousel stills.

### Film TB-04: What it doesn't ask for

- TOPIC: What Task Buddies needs from you before you can use it, and what it does with what you put in.
- AUDIENCE: Parents who assume any free app for families wants an email address and pays for itself with ads or data.
- OUTCOME: They can say what the app asks for and where their routine lives.
- SECONDS: 25
- The question it answers: "What's the catch?"
- The belief that turns out wrong: Free means you hand something over.
- Verification rule (this film only, and it is absolute)
  - Start from `APP_FACTS.md`.
  - Then prove it at runtime against the production build (`npm run build:web`, `npm run preview`). With Playwright, run a full session in one persistent context (`launchPersistentContext` with a temp profile, so storage survives): first open, parent gate, set up a routine, run it to the end, close the page, open a new page at the same URL, check the routine is still there.
  - Do not tap any external link during the session. If the flow cannot be completed without one, log it.
  - Record every network request to `films/tb-04-what-it-doesnt-ask/NETWORK_LOG.md`: host, method, resource type, and whether the URL, headers or body carried any user-entered data (search for the task names you typed). Service worker and same-origin `localhost:4173` requests are listed too, marked same-origin.
  - Record what is written to `localStorage`, `sessionStorage`, IndexedDB, Cache Storage and cookies, before and after the session.
  - Build `SOURCES.md` as a table: statement, code reference, runtime evidence.
  - A statement may appear in the film only if both the code and the runtime log support it. "No ads" needs zero ad or tracking hosts in the log. "Stays on your device" needs zero requests carrying routine data and zero requests to any host other than the app's own origin. "No sign-up" needs no account step anywhere in the flow. "Free" needs no payment or upgrade path in the code.
  - If analytics, fonts, error reporting or any third-party host shows up, say nothing that the log contradicts. Cut the affected statement.
  - If fewer than two statements survive, do not make this film. Write `BLOCKED.md` with the evidence and stop there.
  - Scope: this proves the web build only. Say so in `SOURCES.md`. The native builds (Capacitor, `@capacitor/preferences`, local notifications) are covered by code references only; if a statement depends on native behaviour that the code does not make plain, cut it.
- Beats
  - Question: the app icon (`brand/taskbuddies/icon.png`) with an empty email field hovering in front of it.
  - Model: the field dissolves. The real first screen is already usable.
  - Proof: each surviving statement lands in turn beside the real screen it relates to.
  - Turn: close the app, reopen it, the routine is still there. Only if the runtime log shows it persisted locally.
  - Payoff: the icon again, nothing in front of it. End card.
- Hard limits: no padlocks, no shields, no "secure", no "private by design", no compliance badges, no named regulations. The parent gate's own shield icon may appear inside its capture, but no shield or padlock is added by the film. Do not say "we never" about anything. Say what the app does today.
- Report flag: stamp this film REVIEW: MARK regardless of how it turns out.

## 3. What to leave for the morning

At repo root, `TB_MORNING_REPORT.md`:

- One row per film: status (DONE, DRAFT, FAILED, BLOCKED), length, cuts exported.
- `APP_FACTS.md` summarised in ten lines, with every UNKNOWN listed first.
- Every on-screen word and every VO line for each film, in order, as plain text.
- Every product statement made, with its source.
- Every statement that was cut and why.
- Everything in `MISSING.md` across all films.
- Every crop made to keep another product out of frame, from `CAPTURE_LOG.md`.
- App copy shown as captured that would break a house rule if it were the film's own words.
- A house-rules self-check over every `STRINGS.txt`, `VO.md` and `captions.srt`. Paste the command and its empty result. Use Git Bash:

  ```
  grep -rniE "neurodivergent|adhd|autism|diagnos|therap|clinical|evidence|proven|science-backed|study|executive function|regulat|dopamine|behaviour chart|behaviour problem|nagging|lazy|defiant|meltdown|body doubl|kids' app|for children|—|!|lovou|dreamstation|fancast|bedtime buddy|instagram|tiktok" films/*/STRINGS.txt films/*/VO.md films/*/captions.srt
  ```

- The three creative decisions you are least sure about.

Per film folder: the studio prompt's delivery set, plus `VO.md`, `DECISIONS.md`, `SOURCES.md` and `contact.png`. Also export each storyboard still as its own 1080x1350 PNG in `stills/` for carousel use (not for TB-05).

Finally: write `films/_pipeline/README.md` with what each pipeline file does and the exact commands used, commit, push the branch and open the draft PR against `dev`.
