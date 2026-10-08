# TB-04 What it doesn't ask for: decisions

**REVIEW: MARK** (stamped regardless of outcome, as the brief requires).

- **Verification ran on the production build**, not the dev server, so Vite's own requests and the dev-only store hook play no part. Every TB-04 screen is from that run (`screens/taskbuddies/50-` to `56-prod-*.png`), not from the dev captures.
- **Four statements survived** (see `SOURCES.md`): no sign-up, your routine stays on your device, no ads, and still there after reopening. More than two survived, so the film was made.
- **"Free" cut.** The code has no payment path, but the store price is UNKNOWN in `APP_FACTS.md`. The audience line in the brief says "free app", but the film itself never says it.
- **Same-origin requests.** All 119 requests went to the app's own origin: the page, its scripts, fonts, sprite sheets and the service worker's precache of the app's files. None carried user-entered text, and none had a body.
- **Reopen behaviour shown honestly.** On relaunch, the app reopened on the screen it was left on (the finished screen) rather than on the routine. The Turn beat shows that screen first, then the Homework routine after "Back to buddies", then its task list. The list is behind the parent gate; the gate screen itself is not shown in this film because it carries a shield icon, and the film adds no shields.
- **Reward re-rolled on reopen.** When the app reopens on the finished screen, it offers a new chest. That is what the app does; it is shown as captured.
- **No privacy framing.** No padlocks, shields, "secure", "private" or regulation names, and no "we never". Each line says what the app does today.
- **Question beat.** The app icon (`brand/taskbuddies/icon.png`, the app's own icon) with a plain "Email address" field drawn in front of it. The field blurs away; it is not app interface.
- **Sound.** Silent stereo track.
