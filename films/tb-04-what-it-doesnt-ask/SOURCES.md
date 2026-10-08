# TB-04 sources

A statement appears only if both the code and the runtime log support it. Runtime evidence comes from `verify.mjs`, run against the production web build (`npm run build:web`, `npm run preview`, http://localhost:4173) in one persistent Chromium profile: first open, parent gate, set up a Homework routine (typed task "Tidy up"), run it to the end, open the reward, close the browser, relaunch with the same profile, check the routine. Results: `NETWORK_LOG.md` (every request) and `storage.json` (localStorage, sessionStorage, IndexedDB, Cache Storage and cookies at each stage).

**Scope.** The runtime check covers the web build only. The iOS and Android builds keep the same data with Capacitor Preferences on the device (`src/platform/storage.js:2,27-76`). That is supported by code only; no statement depends on native behaviour beyond it.

## Statements in the film

| Statement | Code reference | Runtime evidence | Verdict |
|---|---|---|---|
| No sign-up. (VO: "No email.") | No account, login or email field anywhere: `APP_FACTS.md` "Account, sign-up, login, email"; only inputs are task names, routine names, reward text and the gate answer. First screen: `src/pages/FirstRunSetup.jsx:10-42`. | The full flow from first open to a finished routine had no account or email step (`NETWORK_LOG.md` "Steps"). No request had a body (0 POST/PUT). | **Kept** |
| Your routine stays on your device. | Web: `localStorage` (`src/platform/storage.js:92,105,118`); tasks saved per routine `src/store/localStore.js:42-46`. No `fetch`, `XMLHttpRequest`, `sendBeacon` or `WebSocket` in `src/`. Native: Capacitor Preferences (`src/platform/storage.js:27-76`). | 119 requests, all GET to the app's own origin (localhost:4173): the app's files and the service worker's precache. 0 to any other host, 0 carrying "Tidy up" in URL, headers or body. "Tidy up" is in `localStorage['task-buddy:routines/v1']` (`storage.json` afterRun, afterReopen). No cookies, no sessionStorage, no IndexedDB. | **Kept** |
| No ads. | No ad, analytics or tracking dependency (`package.json:29-46`), no external script in `index.html`, no ad code in `src/`; `docs/STORE_RELEASE.md:133`. | 0 requests to any third-party host, so 0 ad or tracking hosts. No ad appeared on any screen in the session. | **Kept** |
| Close it, open it again: still there. | Saved tasks and app state persisted to storage: `src/store/localStore.js:42-46`, `src/store/useRoutineStore.js:299-319`. | Browser closed and relaunched with the same profile; the app reopened on the screen it was left on ("All Done!"), and the Homework routine's tasks were Unpack Backpack, Have a Snack, Homework, Tidy up (`55-`, `56-prod-reopened-tasks*.png`, `storage.json` afterReopen). | **Kept** |

## Cut

| Statement | Why |
|---|---|
| Free | The code has no purchase, subscription or upgrade path, and the runtime session met none. But the store price is set outside the repo and is UNKNOWN in `APP_FACTS.md`, so "free" cannot be stated. |
| No tracking / no analytics | The runtime log supports it (no third-party host), but the brief lists only "free", "no sign-up", "no ads" and "stays on your device" as allowed claims of this kind, and TB-04's limits rule out privacy framing. Not used. |
| Works offline | Supported by the service worker precache (`vite.config.js:9-33`, Cache Storage in `storage.json`), but not tested offline tonight. Not used. |
