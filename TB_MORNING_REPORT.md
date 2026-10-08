# Task Buddies explainer films: morning report

Branch `content/taskbuddies-explainers-v1`. Nothing has been posted; every output is a draft for review.

| Film | Status | Length | Cuts exported |
|---|---|---|---|
| TB-01 What Task Buddies is | DONE | 30.0 s (target 30 s) | `tb-01-what-it-is_1x1_1080x1080.mp4`, `tb-01-what-it-is_4x5_1080x1350.mp4`, `tb-01-what-it-is_9x16_1080x1920.mp4` |
| TB-03 Meet the buddies | DONE | 20.0 s (target 20 s) | `tb-03-buddies_1x1_1080x1080.mp4`, `tb-03-buddies_4x5_1080x1350.mp4`, `tb-03-buddies_9x16_1080x1920.mp4` |
| TB-02 Setting up a routine | DONE | 35.0 s (target 35 s) | `tb-02-setup_1x1_1080x1080.mp4`, `tb-02-setup_4x5_1080x1350.mp4`, `tb-02-setup_9x16_1080x1920.mp4` |
| TB-05 App Store preview | DONE | 20.0 s (target 20 s) | `tb-05-appstore-preview_store1080_1080x1920.mp4`, `tb-05-appstore-preview_store886_886x1920.mp4` |
| TB-04 What it doesn't ask for | DONE, REVIEW: MARK | 25.0 s (target 25 s) | `tb-04-what-it-doesnt-ask_1x1_1080x1080.mp4`, `tb-04-what-it-doesnt-ask_4x5_1080x1350.mp4`, `tb-04-what-it-doesnt-ask_9x16_1080x1920.mp4` |

## APP_FACTS.md in ten lines

1. UNKNOWN: the store price (set in App Store Connect and Play Console, not in the repo). So no film says "free".
2. UNKNOWN: what the native shells do on the network at runtime; tonight's runtime check covered the web build only.
3. Name: Task Buddies, two words (manifest, Capacitor config, page title, in-app logo).
4. Routine types: Bedtime, Morning, Homework, Custom. Tasks can be renamed, timed (1 to 60 min), reordered, added, removed and saved.
5. Buddies, in the app's order: Hoppy, Snapper, Snoozy, Flutty, Buddy. Five in all.
6. During a routine: one task at a time with a countdown ring; the buddy idles, gets bored near the end, gets hungry when time runs out; "Done! Feed <buddy>" or "Feed <buddy>" plays a chomp and moves to the next task.
7. When it is finished: "All Done!", the buddy celebrating, a summary, and (on by default) a reward chest with one reward from an editable list.
8. No account, sign-up, login or email capture. No ads, analytics or third-party scripts. No payment or upgrade path.
9. Data stays in `localStorage` on web and Capacitor Preferences on iOS and Android. The code makes no network requests; fonts are bundled.
10. Parent gate: a random multiplication question. First open goes through it; behind it are the Parent Area (rewards, privacy and support links), editing tasks, creating and deleting custom routines, and every external link.

## Other product in the app

The app shows Lovou in three places: a card on the routine-finished screen (always), a card in the Parent Area, and "Lovou on Instagram" and "Lovou on TikTok" buttons in the Parent Area footer. Every capture used in a film is framed so none of it is visible (crops listed below). If the films are to show those screens whole, the Lovou elements have to come out of the app and the screens be recaptured.

## App copy shown as captured

These are the app's own words inside real captures. They would break a house rule if they were the films' own words, and are listed so the app copy can be changed and the screens recaptured if wanted.

- Exclamation marks: "Done! Feed Hoppy" / "Done! Feed Snoozy" (TB-01, TB-02 payoff, TB-03, TB-05), "Go, Go, Go!", "Yum!", "Hoppy is cheering you on. You've got this!", "Yum! Hoppy loved that. Next task coming up...", "All Done!", "What a great start! Hoppy is cheering for you.", "All done! Hoppy is proud of your focus today.", "Tap to open your reward!".
- US spellings and terms: "Put on Pajamas" (TB-01 Turn), "Unpack Backpack", "Pack Backpack", "Pack Backpack for Tomorrow" (TB-01, TB-02, TB-04, TB-05), "Calm & Cozy" (Snoozy's trait line, visible on the TB-03 selection screen when Snoozy is chosen).
- "Grown-Ups Only" on the parent gate (TB-02).
- Trait lines on the selection screen ("Energetic & Bouncy", "Gentle & Graceful") and routine descriptions ("Wind down & get ready for sleep", "Focus up & get it done") use "&".
- The wrong-answer message on the gate has an em dash. It was never triggered or captured.

## On-screen words and VO, per film

### TB-01 What Task Buddies is

On screen, in order:

- Morning
- ✓
- Get dressed
- Breakfast
- Teeth
- Shoes
- Bag
- Not another chart.
- One thing at a time.
- Pick a routine.
- The buddy stays with them.
- Same buddy, another routine.
- taskbuddies.app

Proposed VO, in order:

- Not another chart.
- Task Buddies shows one thing at a time.
- You pick a routine.
- Their buddy stays on screen for each task, and gets fed when it is done.
- At the end, a reward.
- The same buddy carries on at bedtime.
- Not another chart.

### TB-03 Meet the buddies

On screen, in order:

- Who's the buddy?
- Hoppy
- Snapper
- Snoozy
- Flutty
- Buddy
- They choose.
- Then they get going together.
- taskbuddies.app

Proposed VO, in order:

- Who's the buddy?
- There are five. Hoppy, Snapper, Snoozy, Flutty and Buddy.
- Your child picks one.
- Then they get going together.

### TB-02 Setting up a routine

On screen, in order:

- Create an account
- Email address
- Create a password
- Confirm password
- Your full name
- Phone number
- Postcode
- Date of birth
- How did you hear about us?
- Choose a username
- Security question
- Answer
- I agree to the terms and conditions
- Open it.
- x2
- Pick the kind of routine.
- Add what needs doing.
- Change it whenever.
- Hand it over.
- taskbuddies.app

Proposed VO, in order:

- You might expect an account and a long form first.
- Open it.
- Answer the grown-up question.
- Pick the kind of routine.
- Add what needs doing.
- Change times and order whenever you like.
- Then hand it over.

### TB-05 App Store preview

On screen, in order:

- (none; the app's own screens only)

Proposed VO, in order:

- (none)

### TB-04 What it doesn't ask for

On screen, in order:

- What's the catch?
- Email address
- No sign-up.
- Your routine stays on your device.
- No ads.
- Close it. Open it again.
- Still there.
- taskbuddies.app

Proposed VO, in order:

- What's the catch?
- There is no sign-up. No email.
- The routine you set up stays on your device.
- There are no ads.
- Close it, open it again, and the routine is still there.

## Product statements and their sources

### TB-01 What Task Buddies is

Every product statement in the film's words, on screen or in the proposed VO.

| Statement | Where | Code reference | Capture tonight |
|---|---|---|---|
| One thing at a time (one task on screen at a time) | on screen, VO | `src/pages/ActivePlayer.jsx:174-216` | `video/morning-run.mp4`, `21-morning-task3..5.png` |
| You pick a routine | on screen, VO | `src/pages/RoutinePicker.jsx:8-35` | `05-routine-picker.png` |
| The buddy stays with them / stays on screen for each task | on screen, VO | `src/pages/ActivePlayer.jsx:269-285` | `video/morning-run.mp4` |
| The buddy gets fed when a task is done | VO | `src/pages/ActivePlayer.jsx:144-148`, `:105-133` | `video/morning-run.mp4` |
| A reward at the end | VO | `src/pages/RoutineComplete.jsx:171-232`; on by default `src/store/localStore.js:103-105` | `24-reward.png` |
| Same buddy, another routine | on screen, VO | `src/store/useRoutineStore.js:122-164` (buddy kept when the routine changes) | `video/bedtime-run.mp4` |

### TB-03 Meet the buddies

| Statement | Where | Code reference | Capture tonight |
|---|---|---|---|
| The buddies are Hoppy, Snapper, Snoozy, Flutty and Buddy, in that order | on screen (names), VO | `src/data/characters.js:5-11`, `src/pages/CharacterSelection.jsx:72-94` | `40-select-*.png`, `video/selection.mp4` |
| There are five | VO | `src/data/characters.js:5-11`, `src/pages/CharacterSelection.jsx:32` | `video/selection.mp4` |
| They choose / your child picks one | on screen, VO | `src/pages/CharacterSelection.jsx:34-37`, `:89` | `video/selection.mp4` |
| The chosen buddy is the one in the routine | on screen (picture) | `src/store/useRoutineStore.js:122`, `src/pages/ActivePlayer.jsx:278-284` | `video/snoozy-run.mp4` |
| Idle, chomp and celebrate animations | picture | `src/components/rex/PixelRexCharacter.jsx:22-79` | sheets in `public/buddy-watercolor/`, `video/snoozy-run.mp4` |

### TB-02 Setting up a routine

| Statement | Where | Code reference | Capture tonight |
|---|---|---|---|
| No account or sign-up before use (the contrast in the Question and Model beats) | picture, VO | `APP_FACTS.md` "Account, sign-up, login, email"; `src/pages/FirstRunSetup.jsx:10-42` | `01-first-open.png`, `video/setup-take.mp4` |
| Open it (the first screen is the set-up screen) | on screen, VO | `src/store/useRoutineStore.js:100-104`, `src/pages/FirstRunSetup.jsx` | `01-first-open.png` |
| A grown-up question gates set-up and editing tasks | picture, VO | `src/pages/ParentGate.jsx:10-18,69-104`, `src/pages/RoutineSetup.jsx:25` | `02-parent-gate.png`, `video/setup-take.mp4` |
| Pick the kind of routine | on screen, VO | `src/pages/RoutinePicker.jsx:8-35` | `05-routine-picker.png` |
| Add what needs doing (remove, add, name tasks) | on screen, VO | `src/pages/RoutineSetup.jsx:35-61`, `:220-247`, `:282-290` | `07-`, `08-homework-*.png` |
| Change it whenever (times and order) | on screen, VO | `src/pages/RoutineSetup.jsx:31-33`, `:163`, `:261-280`, Save `:183-189` | `09-homework-edited.png` |
| Hand it over (routine ready, buddy waiting) | on screen, VO | `src/pages/RoutineSetup.jsx:105-129` | `10-homework-ready.png` |

### TB-05 App Store preview

#### Apple app preview requirements

Checked on 2026-10-08 at <https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications> (App Store Connect Help, "App preview specifications"):

| Requirement | Apple's page | This export |
|---|---|---|
| Length | 15 to 30 seconds | 20.0 s |
| Format | H.264 or ProRes 422 HQ | H.264 (.mp4) |
| H.264 bit rate | target 10 to 12 Mbps | 11 Mbps constant |
| H.264 profile | progressive, up to High Profile Level 4.0 | High, Level 4.0, progressive |
| Frame rate | 30 fps max | 30 fps |
| Audio | stereo, 256 kbps AAC, 44.1 or 48 kHz, all tracks enabled | 1 track, 2-channel stereo AAC-LC, 48 kHz, encoded at a 256 kbps setting. The track is silent, so ffmpeg's encoder writes it at about 2 kbps; if App Store Connect objects, lay in any audio and re-encode |
| Maximum size | 500 MB | see `export/` |
| Resolution | iPhone 6.9", 6.5", 6.3", 6.1": 886 x 1920 portrait. iPhone 5.5" and 4": 1080 x 1920 portrait | `tb-05-appstore-preview_store886_886x1920.mp4`, `tb-05-appstore-preview_store1080_1080x1920.mp4` |
| Poster frame | defaults to 5 s; set in App Store Connect | one poster PNG per cut in `export/`, taken at 10.5 s (set the poster time to match when uploading) |

Status: VERIFIED against Apple's page on the night of the run.

#### Product statements

The film has no on-screen words and no VO. Its pictures show:

| What is shown | Code reference | Capture |
|---|---|---|
| Removing, adding and naming tasks | `src/pages/RoutineSetup.jsx:35-61,220-247,282-290` | `video/setup-take.mp4` |
| Choosing a buddy | `src/pages/CharacterSelection.jsx:34-37` | `video/setup-take.mp4` |
| One task at a time, buddy fed when it is done | `src/pages/ActivePlayer.jsx:105-148,174-285` | `video/morning-run.mp4` |
| Routine finished, reward | `src/pages/RoutineComplete.jsx:113-232` | `22-routine-finished.png`, `24-reward.png` |

No pricing, no "free", no comparison, no other product.

### TB-04 What it doesn't ask for

A statement appears only if both the code and the runtime log support it. Runtime evidence comes from `verify.mjs`, run against the production web build (`npm run build:web`, `npm run preview`, http://localhost:4173) in one persistent Chromium profile: first open, parent gate, set up a Homework routine (typed task "Tidy up"), run it to the end, open the reward, close the browser, relaunch with the same profile, check the routine. Results: `NETWORK_LOG.md` (every request) and `storage.json` (localStorage, sessionStorage, IndexedDB, Cache Storage and cookies at each stage).

**Scope.** The runtime check covers the web build only. The iOS and Android builds keep the same data with Capacitor Preferences on the device (`src/platform/storage.js:2,27-76`). That is supported by code only; no statement depends on native behaviour beyond it.

#### Statements in the film

| Statement | Code reference | Runtime evidence | Verdict |
|---|---|---|---|
| No sign-up. (VO: "No email.") | No account, login or email field anywhere: `APP_FACTS.md` "Account, sign-up, login, email"; only inputs are task names, routine names, reward text and the gate answer. First screen: `src/pages/FirstRunSetup.jsx:10-42`. | The full flow from first open to a finished routine had no account or email step (`NETWORK_LOG.md` "Steps"). No request had a body (0 POST/PUT). | **Kept** |
| Your routine stays on your device. | Web: `localStorage` (`src/platform/storage.js:92,105,118`); tasks saved per routine `src/store/localStore.js:42-46`. No `fetch`, `XMLHttpRequest`, `sendBeacon` or `WebSocket` in `src/`. Native: Capacitor Preferences (`src/platform/storage.js:27-76`). | 119 requests, all GET to the app's own origin (localhost:4173): the app's files and the service worker's precache. 0 to any other host, 0 carrying "Tidy up" in URL, headers or body. "Tidy up" is in `localStorage['task-buddy:routines/v1']` (`storage.json` afterRun, afterReopen). No cookies, no sessionStorage, no IndexedDB. | **Kept** |
| No ads. | No ad, analytics or tracking dependency (`package.json:29-46`), no external script in `index.html`, no ad code in `src/`; `docs/STORE_RELEASE.md:133`. | 0 requests to any third-party host, so 0 ad or tracking hosts. No ad appeared on any screen in the session. | **Kept** |
| Close it, open it again: still there. | Saved tasks and app state persisted to storage: `src/store/localStore.js:42-46`, `src/store/useRoutineStore.js:299-319`. | Browser closed and relaunched with the same profile; the app reopened on the screen it was left on ("All Done!"), and the Homework routine's tasks were Unpack Backpack, Have a Snack, Homework, Tidy up (`55-`, `56-prod-reopened-tasks*.png`, `storage.json` afterReopen). | **Kept** |

## Statements cut, and why

### TB-01 What Task Buddies is

- "Built on the process of body doubling": removed at the founder's instruction before the run.

### TB-03 Meet the buddies

Nothing.

### TB-02 Setting up a routine

Nothing.

### TB-05 App Store preview

Nothing.

### TB-04 What it doesn't ask for

| Statement | Why |
|---|---|
| Free | The code has no purchase, subscription or upgrade path, and the runtime session met none. But the store price is set outside the repo and is UNKNOWN in `APP_FACTS.md`, so "free" cannot be stated. |
| No tracking / no analytics | The runtime log supports it (no third-party host), but the brief lists only "free", "no sign-up", "no ads" and "stays on your device" as allowed claims of this kind, and TB-04's limits rule out privacy framing. Not used. |
| Works offline | Supported by the service worker precache (`vite.config.js:9-33`, Cache Storage in `storage.json`), but not tested offline tonight. Not used. |

## MISSING.md, all films

- TB-01 What Task Buddies is: Nothing. Every beat uses a real capture or a frame drawn in brand tokens that does not depict app interface.
- TB-03 Meet the buddies: Nothing.
- TB-02 Setting up a routine: Nothing.
- TB-05 App Store preview: Nothing. See DECISIONS.md for the review risk on the two cropped finished-screen shots.
- TB-04 What it doesn't ask for: Nothing.

## Crops made to keep another product out of frame

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


## House-rules self-check

Searches every on-screen string, caption and VO line in every film for the banned words, em dashes, exclamation marks and other product names.

```
$ grep -rniE "neurodivergent|adhd|autism|diagnos|therap|clinical|evidence|proven|science-backed|study|executive function|regulat|dopamine|behaviour chart|behaviour problem|nagging|lazy|defiant|meltdown|body doubl|kids' app|for children|—|!|lovou|dreamstation|fancast|bedtime buddy|instagram|tiktok" films/*/STRINGS.txt films/*/VO.md films/*/captions.srt
(no output)
exit status 1 (1 means no matches)
```

## The three creative decisions I am least sure about

1. **Framing Lovou out instead of dropping the screens.** The routine-finished screen always carries a Lovou card, and the first-run Parent Area has one too. I cropped stills above the card, and in TB-02's continuous take I reframed to the top 29% of the screen for the 2.6 s the Parent Area is up (a visible change of frame, not a cut). In TB-05 the cropped finished screens sit at the top of a full-frame store preview on the app's background colour. That may read as "not full frame" to App Review, and a developer has reported a rejection for previews with the recording shrunk onto a background. The clean fix is in the app: remove or move the Lovou card, recapture, rerender (all scripted).
2. **TB-02 at x2.** The whole set-up takes about 33 s of real time, so after the first parent gate (real speed) the take plays at x2 with an "x2" tag. Nothing is cut, but at x2 the second parent gate and the drag to reorder go by quickly. The alternative is a slower film or a shorter edit, which would mean a cut.
3. **TB-04's "Close it. Open it again."** On relaunch the app reopens on the screen it was left on (the finished screen, offering a new reward chest), not on the routine. The film shows that, then "Back to buddies", Hoppy and Homework to reach the same routine, then its task list. Strictly true, but it takes three steps to get back to the routine. Someone may prefer to cut the Turn beat or rephrase it once the app's reopen behaviour has been looked at.

## Other things to know

- **Status meanings.** DONE means every beat uses a real capture or a frame drawn in brand tokens that does not depict app interface. Nothing is in any MISSING.md. TB-04 is also stamped REVIEW: MARK, as the brief requires.
- **Body doubling** was removed from the brief and every film at the founder's instruction.
- **Free.** Cut everywhere. The code has no payment path, but the price is not in the repo.
- **Apple preview spec** (TB-05) was checked against Apple's page during the run; details and link in `films/tb-05-appstore-preview/SOURCES.md`. Set the poster frame to 10.5 s when uploading.
- **Emoji** in captures are the Windows emoji font (captured in Chromium on Windows), not Apple's.
- **Sound.** Every film has a silent stereo AAC track and no sound bed. Proposed VO per film is in its `VO.md`; `captions.srt` carries the on-screen words.
- **Rerendering.** `node films/_pipeline/capture.mjs setup morning timeout buddies` (dev server running) recaptures; `node films/tb-04-what-it-doesnt-ask/verify.mjs` (preview server running) reruns the runtime check; `node films/<film>/build.mjs` then the `deliver.mjs` command in `films/_pipeline/README.md` rerenders a film; `node films/_pipeline/report.mjs` rebuilds this report and the capture log.
- **Nothing in `src/`, `public/`, `android/`, `ios/` or `landing/` was changed.**

