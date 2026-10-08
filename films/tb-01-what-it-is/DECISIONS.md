# TB-01 What Task Buddies is: decisions

- **Brand tokens.** There was no brand folder. Palette, type and logo were taken from the app itself (`tailwind.config.js`, `src/components/Logo.jsx`, the PWA manifest) into `brand/taskbuddies/`. The end card uses the logo the app shows, not the concept logo, which carries a "Cozy focus companions" tagline and a background panel.
- **Body doubling.** Left out at the founder's instruction. The phrase is on the banned list for every film.
- **Question beat.** The checklist is drawn in brand tokens with the brief's five items (get dressed, breakfast, teeth, shoes, bag), two ticked. It is a generic paper chart, not app interface, so it carries no app styling.
- **Model beat.** The ticked rows and the rest fold away, leaving "Get dressed" on its own. Hoppy appears beside it, stepped frame by frame from `public/buddy-watercolor/hoppy-idle.webp` at the app's own rate (16 frames in 1.6 s, `src/components/rex/PixelRexCharacter.jsx:5,8`).
- **Proof beat.** The Morning routine was set up through the UI (Edit tasks, parent gate, remove Go Potty, Wash Face and Brush Hair, Save), leaving the app's own five tasks in this order: Get Dressed, Eat Breakfast, Brush Teeth, Put on Shoes, Pack Backpack. The run was recorded at real speed and each task finished with the app's "Done! Feed Hoppy" button. The film shows the first task in full (recording, real speed), then tasks 3, 4 and 5 as half-second stills, then the finished screen and the reward. Task 2 appears at the end of the recording. These are cuts in time; TB-01 has no uncut rule and no time claim is made.
- **Other product kept out.** The routine-finished screen always shows a Lovou card below "Back to buddies". Both finished-screen stills are cropped above it (570 px and 621 px of 844, see `screens/taskbuddies/CAPTURE_LOG.md`) and shown at their own aspect. The recording is cut before the finished screen appears, so the card never enters any frame.
- **Turn beat.** "Same buddy, another routine." is a line outside the word bank. It describes what the screen shows (Hoppy in a Bedtime routine) and makes no claim about outcomes.
- **Payoff.** "Not another chart." returns over Hoppy celebrating, as a callback to the opening.
- **Reward shown.** The reward the app picked at random was "You choose tomorrow's breakfast". It is shown as the app showed it.
- **Emoji.** Captures were made in Chromium on Windows, so task emoji render in the Windows emoji font, not Apple's. The interface is otherwise the real app.
- **Sound.** Silent stereo track, no sound bed. The film works fully with the sound off.
- **Captions.** `captions.srt` carries the on-screen words. `VO.md` is a proposal only.
