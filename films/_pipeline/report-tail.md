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
