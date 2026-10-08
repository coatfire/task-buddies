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
