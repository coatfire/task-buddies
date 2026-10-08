// TB-01: What Task Buddies is. node films/tb-01-what-it-is/build.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { text, screen, clip, endcard, frame, perLayout, sprite, writeDocs, writeTimeline, LAYOUTS, CAPTURES, stepTime } from '../_pipeline/lib.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DURATION = 30;
const HOPPY = 1.56; // spriteScale, src/data/characters.js:6

// Paper checklist drawn in brand tokens. Rows from the brief; the first two ticked.
const ROWS = ['Get dressed', 'Breakfast', 'Teeth', 'Shoes', 'Bag'];
const row = (label, i, ticked, top) => `<div style="position:absolute;left:12cqw;right:12cqw;top:${top}cqh;height:8cqh;display:flex;align-items:center;gap:5cqw;border-bottom:2px solid #E0CDB4">
  <div style="width:9cqw;height:9cqw;border:0.9cqw solid #8A7560;border-radius:1.6cqw;display:flex;align-items:center;justify-content:center;color:#4A3426;font-family:'DM Sans';font-weight:600;font-size:7cqw;line-height:1">${ticked ? '✓' : ''}</div>
  <div style="font-family:'DM Sans';font-weight:400;font-size:7.4cqw;color:${ticked ? '#8A7560' : '#4A3426'};${ticked ? 'text-decoration:line-through;' : ''}">${label}</div></div>`;
const paper = (inner) => `<div style="position:absolute;inset:6cqw 5cqw;background:#FFFDF8;border-radius:4cqw;box-shadow:0 2cqw 6cqw rgba(74,52,38,0.12)">${inner}</div>`;
const heading = `<div style="position:absolute;left:12cqw;top:9cqh;font-family:'Nunito';font-weight:800;font-size:9cqw;color:#4A3426">Morning</div>`;
const checklist = (tin, tout, extra = {}) => frame(paper(heading + ROWS.map((r, i) => row(r, i, i < 2, 20 + i * 11)).join('')), tin, tout, extra);
// The same rows one at a time, so the list can fold away.
const rowsOnly = (keep, tin, tout, extra = {}) => frame(paper(heading + ROWS.map((r, i) => (keep(i) ? row(r, i, i < 2, 20 + i * 11) : '')).join('')), tin, tout, extra);
// The other rows alone on a transparent layer, laid exactly over the paper.
const looseRows = (tin, tout, extra = {}) => ({ kind: 'html', region: 'screen', in: tin, out: tout,
  html: `<div style="position:absolute;inset:6cqw 5cqw">${ROWS.map((r, i) => (i > 0 ? row(r, i, i < 2, 20 + i * 11) : '')).join('')}</div>`, ...extra });
// One task on its own, as the app shows it: just the task.
const single = (tin, tout, extra = {}) => frame(`<div style="position:absolute;left:0;right:0;top:12cqh;text-align:center;font-family:'Nunito';font-weight:800;font-size:11cqw;color:#4A3426">Get dressed</div>`, tin, tout, extra);

const morning = 'morning-run';
const bedtime = 'bedtime-run';
const tDone1 = stepTime(morning, /task 1 .*Done! Feed/);
const tBedDone = stepTime(bedtime, /Done! Feed/);

const E = [];
// Question
E.push(checklist(0, 4.4, { fadeIn: 0.5, fadeOut: 0 }));
E.push(text('Not another chart.', 0.5, 4.2));
// Model: the ticked rows and the rest fold away, leaving one task, then the buddy beside it.
E.push(frame('', 4.4, 9.4, { fadeIn: 0, fadeOut: 0.35 }));
E.push(rowsOnly((i) => i === 0, 4.4, 5.9, { fadeIn: 0, fadeOut: 0.5 }));
E.push(looseRows(4.4, 5.6, { fadeIn: 0, fadeOut: 0, opacity: [[4.4, 1], [5.6, 0]], y: [[4.4, 0], [5.6, 60]] }));
E.push(single(5.5, 9.4, { fadeIn: 0.5 }));
E.push(...perLayout(LAYOUTS, (l, c) => sprite('hoppy', 'idle', 6.3, 9.4, { cx: c.x + c.w / 2, cy: c.y + c.h * 0.56, size: c.w * 0.5, mult: HOPPY, fadeIn: 0.5, enter: 'scale' })));
E.push(text('One thing at a time.', 4.8, 8.6));
// Proof: a real Morning routine, first task to last, then the reward.
E.push(screen('05-routine-picker', 9.4, 11.5, { fadeIn: 0.35, fadeOut: 0 }));
E.push(text('Pick a routine.', 9.6, 12.2));
E.push(clip(morning, 11.4, 16.5, { start: tDone1 - 1.6, fadeIn: 0.2, fadeOut: 0 }));
E.push(text('The buddy stays with them.', 12.6, 16.0));
E.push(screen('21-morning-task3', 16.4, 16.95, { fadeIn: 0.1, fadeOut: 0 }));
E.push(screen('21-morning-task4', 16.9, 17.45, { fadeIn: 0.1, fadeOut: 0 }));
E.push(screen('21-morning-task5', 17.4, 18.0, { fadeIn: 0.1, fadeOut: 0 }));
E.push(screen('22-routine-finished', 17.95, 18.9, { fadeIn: 0.15, fadeOut: 0 }));
E.push(screen('24-reward', 18.85, 20.0, { fadeIn: 0.15, fadeOut: 0.3 }));
// Turn: another routine type, same buddy.
E.push(clip(bedtime, 19.9, 24.9, { start: tBedDone - 1.4, fadeIn: 0.3, fadeOut: 0.3 }));
E.push(text('Same buddy, another routine.', 20.3, 23.6));
// Payoff: the opening checklist, replaced by the buddy.
E.push(checklist(24.8, 26.3, { fadeIn: 0.35, fadeOut: 0.6 }));
E.push(frame('', 25.7, 28.2, { fadeIn: 0.6, fadeOut: 0.35 }));
E.push(...perLayout(LAYOUTS, (l, c) => sprite('hoppy', 'celebrate', 25.8, 28.2, { cx: c.x + c.w / 2, cy: c.y + c.h * 0.5, size: c.w * 0.62, mult: HOPPY, fadeIn: 0.6, enter: 'scale' })));
E.push(text('Not another chart.', 25.6, 28.1));
E.push(endcard(28.2, DURATION, { fadeIn: 0.4 }));

const tl = { duration: DURATION, fps: 30, elements: E };
writeTimeline(DIR, tl);

const beats = [
  { name: 'Question', from: 0, to: 4.4, picture: 'A paper-style Morning checklist drawn in brand tokens, two of five rows ticked.' },
  { name: 'Model', from: 4.4, to: 9.4, picture: 'The ticked rows and the rest fold away, leaving one task, "Get dressed". Hoppy appears beside it, stepped from the real idle sprite sheet.' },
  { name: 'Proof', from: 9.4, to: 19.9, picture: 'The real app: the routine picker, then a real Morning run recorded at real speed (Get Dressed, "Done! Feed Hoppy", the chomp, the next task), the last three tasks, the routine-finished screen and the reward revealed. Finished and reward screens are cropped above another product\'s card.' },
  { name: 'Turn', from: 19.9, to: 24.9, picture: 'The same buddy carrying on in a Bedtime routine (Put on Pajamas, fed, next task), recorded at real speed.' },
  { name: 'Payoff', from: 24.9, to: 30, picture: 'The opening checklist returns, fades, and Hoppy celebrating takes its place. End card: logo and taskbuddies.app.' },
];
const vo = [
  { in: 0.5, out: 4.2, text: 'Not another chart.' },
  { in: 4.8, out: 8.4, text: 'Task Buddies shows one thing at a time.' },
  { in: 9.6, out: 12.2, text: 'You pick a routine.' },
  { in: 12.6, out: 17.8, text: 'Their buddy stays on screen for each task, and gets fed when it is done.' },
  { in: 18.0, out: 19.8, text: 'At the end, a reward.' },
  { in: 20.3, out: 24.0, text: 'The same buddy carries on at bedtime.' },
  { in: 25.6, out: 28.0, text: 'Not another chart.' },
];
writeDocs(DIR, {
  title: 'TB-01 What Task Buddies is', seconds: DURATION,
  framing: {
    question: 'Is this another chart I have to police?',
    belief: 'A routine app is a checklist with a timer.',
    truth: 'You pick a routine and a buddy stays on screen with your child, one task at a time.',
  },
  beats, vo, tl,
});
console.log('captures used:', [...new Set(E.map((e) => e.src || e.video).filter(Boolean))].join(', '), Object.keys(CAPTURES).length);
