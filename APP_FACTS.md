# Task Buddies: app facts

Read from the codebase on branch `content/taskbuddies-explainers-v1` (based on `dev` at e8ab1ad, app version 1.0.6). Every film draws its product facts from this file. An UNKNOWN fact may not be stated in any film.

## UNKNOWN

- **Store price.** The code has no purchase path (see Payment), and `package.json:6` describes the app as "free", but the price set in App Store Connect and Google Play Console is not in the repo.
- **Native network behaviour at runtime.** The code makes no network calls on any platform (see Network), but tonight's runtime check covers the web build only. What the Capacitor shells or the OS do on their own is not in the repo.

## Name

| Fact | Source |
|---|---|
| The product name is **Task Buddies**, two words. | `vite.config.js:14-15` (PWA `name`, `short_name`), `capacitor.config.ts:5` (`appName`), `index.html:12` (`<title>`), `src/components/Logo.jsx:16,33` (logo text and label) |

## Routine types

The routine picker shows four tiles, in this order (`src/pages/RoutinePicker.jsx:8-13`):

| Label | Description shown | Notes |
|---|---|---|
| Bedtime | Wind down & get ready for sleep | default tasks `src/store/taskLibrary.js:59` |
| Morning | Start the day the right way | default tasks `src/store/taskLibrary.js:60` |
| Homework | Focus up & get it done | default tasks `src/store/taskLibrary.js:61` |
| Custom | Create your own routine | opens "Your Routines"; creating one is behind the parent gate (`src/pages/CustomRoutineList.jsx:46`) |

- Default Morning tasks in order: Get Dressed, Eat Breakfast, Brush Teeth, Go Potty, Wash Face, Put on Shoes, Brush Hair, Pack Backpack (`src/store/taskLibrary.js:60`, labels at lines 9-31).
- Default Homework tasks in order: Unpack Backpack, Have a Snack, Reading, Homework, Pack Backpack for Tomorrow (`src/store/taskLibrary.js:61`).
- Each task has a name and minutes from 1 to 60 (`src/pages/RoutineSetup.jsx:32`). Tasks can be renamed (`:282-290`), reordered by dragging (`:163`, `:261-280`), removed (`:317-324`), added from the library or as a custom task you name yourself (`:220-247`), and saved (`:183-189`).
- One routine-type tile may be marked "Suggested" by time of day (`src/pages/RoutinePicker.jsx:15-23`).

## Buddies

The roster, in the order the selection carousel shows it (`src/data/characters.js:5-11`, rendered in order at `src/pages/CharacterSelection.jsx:72`):

1. Hoppy (trait line shown: "Energetic & Bouncy")
2. Snapper ("Playful & Cheeky")
3. Snoozy ("Calm & Cozy")
4. Flutty ("Gentle & Graceful")
5. Buddy ("Loyal & Friendly")

- There are **five** buddies (`src/data/characters.js:5-11`; the selection screen counts them at `src/pages/CharacterSelection.jsx:32`).
- The carousel loops and starts on Hoppy (`src/pages/CharacterSelection.jsx:31`). Tapping a card chooses that buddy (`:34-37`, button text "Choose <name>" at `:89`).
- Hoppy is the default buddy before one is chosen (`src/data/characters.js:14`, `src/store/useRoutineStore.js:62`).
- Sprite sheets exist in `public/buddy-watercolor/` for finn, luna, masha, rex, sparky, stella and zen, but none of them is in the roster, so the app never shows them.

## What a buddy does during a routine

| Fact | Source |
|---|---|
| The running screen shows one task at a time: its name, "Task n of N", a progress bar per task and a countdown ring with the buddy inside it. | `src/pages/ActivePlayer.jsx:174-216`, `:269-285` |
| The buddy has four animation states: idle, bored, chomp (eating) and celebrate. | `src/components/rex/PixelRexCharacter.jsx:76-79` |
| The buddy starts each task idle, turns bored when less than a fifth of the task's time (at least 30 s) is left, and turns hungry when the time runs out. | `src/store/useRoutineStore.js:214-232` |
| When the time runs out, nothing ends: a "Feed <buddy>" button appears and a bubble reads "All done? Come feed me!". | `src/pages/ActivePlayer.jsx:255-267`, `:292-304` |
| While a task is running, "Done! Feed <buddy>" finishes it early. | `src/pages/ActivePlayer.jsx:144-148`, `:307-321` |
| Feeding plays a chomp, then a short celebration, then the next task starts by itself. | `src/pages/ActivePlayer.jsx:105-133`, `src/store/useRoutineStore.js:241-254` |
| A task can be paused, resumed or skipped, and the routine can be stopped (with a confirm). | `src/pages/ActivePlayer.jsx:328-343`, `:347-357` |

## What happens when a routine is finished

| Fact | Source |
|---|---|
| The finished screen shows confetti, "All Done!", a closing line naming the buddy, the buddy celebrating, and a summary of tasks, minutes and buddy. | `src/pages/RoutineComplete.jsx:113-169`, `:274-289` |
| If rewards are switched on (the default), a reward chest appears after about 2 s; tapping it reveals one reward from the list. | `src/pages/RoutineComplete.jsx:107-111`, `:171-232`; default on at `src/store/localStore.js:103-105` |
| Rewards are things to do together, from a list the parent can edit (for example "Make up a secret handshake together"). | `src/data/rewards.json`, `src/pages/Settings.jsx:180-268` |
| "Back to buddies" returns to the buddy selection screen. | `src/pages/RoutineComplete.jsx:245-247`, `src/store/useRoutineStore.js:256-260` |
| On later opens, after at least one finished routine, the app goes straight to the last buddy and routine. | `src/App.jsx:107-118` |

## Account, sign-up, login, email

- **None.** There is no account, sign-up, login or email field anywhere in the app. The only text inputs are task names (`src/pages/RoutineSetup.jsx:282`), custom routine names (`src/pages/CustomRoutineList.jsx:173`), reward text (`src/pages/Settings.jsx:197`) and the parent gate answer (`src/pages/ParentGate.jsx:79`).
- `index.html:11` and `package.json:6` both say "No signup".
- `docs/STORE_RELEASE.md:133`: "has no account system, backend, analytics, advertising, tracking, or in-app purchases".

## Where data is stored

| Fact | Source |
|---|---|
| Web: everything is kept in the browser's `localStorage`. | `src/platform/storage.js:92,105,118` |
| iOS and Android: everything is kept with Capacitor Preferences on the device. | `src/platform/storage.js:2`, `:27-43`, `:61-76` |
| Keys: `routine-timer-state`, `task-buddy:routines/v1`, `task-buddy:custom-routines/v1`, `task-buddy:rewards/v1`, `task-buddy:last-buddy`, `task-buddy:last-routine`, `task-buddy:has-completed-run`, `taskbuddy_rewards`, `taskbuddy_rewards_enabled`, `task-buddy:setup-complete`. | `src/platform/storage.js:4-15`, `src/store/localStore.js:16-26` |
| A saved routine is still there after the app is closed and reopened (tasks per routine type are written on Save, and the running state is persisted). | `src/store/localStore.js:42-46`, `src/store/useRoutineStore.js:166-182`, `:299-319` |
| `docs/STORE_RELEASE.md:134`: "stores routines, rewards, buddy choices, and timer state on the device". | |

## Network

| Fact | Source |
|---|---|
| The app's code makes no network requests: no `fetch`, `XMLHttpRequest`, `sendBeacon` or `WebSocket` anywhere in `src/`. | search of `src/` (see `films/tb-04-what-it-doesnt-ask/SOURCES.md`) |
| Fonts are bundled with the app (`@fontsource`), not loaded from a font service. | `src/main.jsx:3-10`, `package.json` dependencies, `docs/STORE_RELEASE.md:139` |
| The web build registers a service worker that caches the app's own files for offline use. | `vite.config.js:9-33` |
| The only outbound actions are links that open in the browser when tapped: privacy, support, Lovou, Lovou on Instagram, Lovou on TikTok. All of them are behind the parent gate. | `src/platform/externalLinks.js:4-37`, `src/pages/Settings.jsx:19-22,169-176,274-301`, `src/pages/RoutineComplete.jsx:264-271` with `src/pages/ParentGate.jsx:34-36` |
| `buymeacoffee.com` is in the link allowlist, but no link points to it. | `src/platform/externalLinks.js:19` |

## Ads, analytics, third-party scripts

- **None found.** No ad, analytics, crash-reporting or tracking package in `package.json` dependencies (lines 29-46: Capacitor plugins, @fontsource fonts, embla-carousel-react, framer-motion, lucide-react, nanoid, react, react-dom, zustand). No external `<script>` in `index.html`. No match in `src/` for gtag, analytics, sentry, posthog, mixpanel, firebase, admob or amplitude.
- `docs/STORE_RELEASE.md:133` agrees.

## Payment, purchase, upgrade

- **None.** No purchase, subscription, paywall or upgrade code in `src/` and no billing plugin in `package.json`. `docs/STORE_RELEASE.md:133`: no in-app purchases.
- `package.json:6` calls the app "free". The store price itself is UNKNOWN (see top).

## Parent gate

| Fact | Source |
|---|---|
| The gate is a "Grown-Ups Only" screen asking a random multiplication question (each number 3 to 9), typed as a number. | `src/pages/ParentGate.jsx:10-18`, `:69-90` |
| A wrong answer gives a new question. | `src/pages/ParentGate.jsx:41-43` |
| First open goes through the gate: the first screen ("Set up a family routine") has one button, "Set up", which opens the gate, then the Parent Area. There is no skip. | `src/pages/FirstRunSetup.jsx:10`, `:40-42`; `src/store/useRoutineStore.js:95-96`, `:100-104` |
| Behind the gate: the Parent Area (rewards on or off, the reward list, privacy and support links), editing a routine's tasks, creating and deleting custom routines, and every external link. | `src/store/useRoutineStore.js:28-33`, `src/pages/RoutineSetup.jsx:25`, `src/pages/CustomRoutineList.jsx:46-47`, `src/components/TabBar.jsx:23`, `src/pages/ParentGate.jsx:34-36` |
| Choosing a buddy, choosing a routine type and starting a routine are not behind the gate. | `src/pages/CharacterSelection.jsx:34-37`, `src/pages/RoutinePicker.jsx:29-35`, `src/pages/RoutineSetup.jsx:122-129` |
| The tab bar has two tabs, "Buddy" and "Parent Area". | `src/components/TabBar.jsx:7-10` |

## Other products shown in the app

None of these may appear in any film. Captures are framed to keep them out (see `screens/taskbuddies/CAPTURE_LOG.md`).

| Where | What | Source |
|---|---|---|
| Routine-finished screen, below "Back to buddies", fades in after 0.55 s | Lovou card: "Routine done. Now the hard part." with a "See how it works" button | `src/pages/RoutineComplete.jsx:58-62`, `:250-272` |
| Parent Area, under "Enable rewards" | Lovou card: "The other half of our bedtime" with "Have a look at Lovou" | `src/pages/Settings.jsx:157-177` |
| Parent Area footer | "Lovou on Instagram", "Lovou on TikTok" icon buttons | `src/pages/Settings.jsx:19-22`, `:290-301` |

## App copy that breaks a house rule if it were the film's own words

Shown as captured, never edited.

- Exclamation marks: "Done! Feed <buddy>" (`ActivePlayer.jsx:319`), "Go, Go, Go!" (`:224`), "Yum!" (`:224`), "<buddy> is hungry! Tap the button…" and "You've got this!" (`:156-160`), "All Done!" (`RoutineComplete.jsx:148`), closing lines such as "What a great start!" and "Sleep tight!" (`:17-21`), "Tap to open your reward!" (`:195`).
- Em dash: the parent gate's wrong-answer message "Not quite — try this one." (`ParentGate.jsx:43`). Never captured.
- US spellings and terms: "Pajamas" (`taskLibrary.js:17`), "Backpack" (`:31-33`), "Go Potty" (`:13`), "Cozy" (`characters.js:8`), "Clean Up Room" (`:27`).
- Trait lines on the selection screen (`characters.js:6-10`) and routine descriptions such as "Focus up & get it done" (`RoutinePicker.jsx:11`).
- "Grown-Ups Only" on the parent gate (`ParentGate.jsx:69`).
