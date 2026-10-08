# TB-03 Meet the buddies: decisions

- **Roster.** All five buddies in the app are shown, in the app's order: Hoppy, Snapper, Snoozy, Flutty, Buddy (`src/data/characters.js:5-11`). No other sheet from `public/buddy-watercolor/` is used. The roster is not stated as a number on screen, because every buddy is shown and named. The proposed VO says "There are five".
- **Real sprites, stepped.** Every buddy in the drawn beats is stepped frame by frame from its own sheet at the app's rate (16 frames in 1.6 s). Each one is shown no larger than 2x its 256 px source frame, with the app's own size multiplier per buddy (`spriteScale`). Nothing is redrawn or restyled. Model and the non-chosen buddies in the payoff use the idle sheets; the chosen buddy in the payoff uses its celebrate sheet, as the app does on the finished screen.
- **Silhouette.** The Question beat's silhouette is Hoppy's real idle frames filled flat in brand ink (a CSS mask over the real sheet), so the shape that fills in is the actual first buddy.
- **No personalities.** Only names appear in film text. The trait lines ("Calm & Cozy" and so on) appear only where the real selection screen shows them inside the capture.
- **Who is chosen.** Snoozy, so the film shows browsing past the first buddy. The selection recording browses all five at real speed, then goes back two and taps "Choose Snoozy". The film uses the last 4.4 s of that recording.
- **Turn.** Snoozy in a Morning routine, recorded at real speed: "Done! Feed Snoozy", the chomp, the celebration and the move to the next task, as the app does it (`src/pages/ActivePlayer.jsx:105-148`).
- **Word bank.** "Who's the buddy?", "They choose.", the five names, "Then they get going together." Nothing else in the film's own words.
- **"They choose."** The app lets whoever holds the phone choose; nothing in the app checks who that is. The line describes the selection screen, not a promise.
- **Sound.** Silent stereo track.
