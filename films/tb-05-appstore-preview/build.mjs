// TB-05: App Store preview. A recut of the TB-01 and TB-02 captures. node films/tb-05-appstore-preview/build.mjs
// Real app screens only, full frame. No Question beat, no end card, no web address, no on-screen text.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { screen, clip, writeDocs, writeTimeline, stepTime } from '../_pipeline/lib.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DURATION = 20;
const TAKE = 'setup-take';
const BG = '#FAF3E8'; // the app's background (tailwind.config.js bg-base), behind the cropped finished screens

const tRemove = stepTime(TAKE, /remove task "Reading"/);
const tChoose = stepTime(TAKE, /choose Hoppy/);
const tDone1 = stepTime('morning-run', /task 1 .*Done! Feed/);

const E = [];
// Full-frame app background, so the cropped finished screens sit on the app's own colour.
E.push({ kind: 'html', region: 'full', in: 0, out: DURATION, fadeIn: 0, fadeOut: 0, html: `<div style="position:absolute;inset:0;background:${BG}"></div>` });
// Routine set-up: removing two defaults and typing a custom task, real speed.
E.push(clip(TAKE, 0, 6.1, { start: tRemove - 0.5, fadeIn: 0, fadeOut: 0.25 }));
// Buddy chosen: the selection screen and "Choose Hoppy", real speed.
E.push(clip(TAKE, 5.9, 9.1, { start: tChoose - 2.0, fadeIn: 0.25, fadeOut: 0.25 }));
// Routine running: Get Dressed, "Done! Feed Hoppy", the chomp, the next task, real speed.
E.push(clip('morning-run', 8.9, 16.1, { start: tDone1 - 1.8, fadeIn: 0.25, fadeOut: 0.25 }));
// Routine finished, then the reward. Cropped above another product's card; pinned to the top.
E.push(screen('22-routine-finished', 15.9, 17.7, { fadeIn: 0.25, fadeOut: 0.2 }));
E.push(screen('24-reward', 17.5, DURATION, { fadeIn: 0.2, fadeOut: 0 }));

const tl = { duration: DURATION, fps: 30, elements: E };
writeTimeline(DIR, tl);
writeDocs(DIR, {
  title: 'TB-05 App Store preview', seconds: DURATION,
  framing: {
    question: 'What would I do with this tomorrow morning?',
    belief: '(No Question beat in a store preview.)',
    truth: 'Set the tasks, your child picks a buddy, the routine runs one task at a time, then a reward.',
  },
  beats: [
    { name: 'Routine set-up', from: 0, to: 6.0, picture: 'Real speed, from the TB-02 take: removing Reading and Pack Backpack for Tomorrow, adding a custom task and typing "Tidy up".' },
    { name: 'Buddy chosen', from: 6.0, to: 9.0, picture: 'Real speed, from the TB-02 take: the buddy selection screen and "Choose Hoppy".' },
    { name: 'Routine running', from: 9.0, to: 16.0, picture: 'Real speed, from the TB-01 Morning run: Get Dressed, "Done! Feed Hoppy", the chomp and celebration, the next task.' },
    { name: 'Routine finished', from: 16.0, to: 20.0, picture: '"All Done!" then the reward revealed, from TB-01. Both are cropped above another product\'s card and pinned to the top of the frame on the app\'s own background colour.' },
  ],
  vo: [],
  tl,
});
