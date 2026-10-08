// TB-02: Setting up a routine. node films/tb-02-setup/build.mjs
// One continuous take (screens/taskbuddies/video/setup-take.mp4). No time is removed: it plays at
// real speed, then at x2 with an on-screen "x2". The only change mid-take is a visible reframe
// while the Parent Area is on screen, to keep another product's card out of frame.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { text, screen, clip, endcard, frame, perLayout, speedTag, writeDocs, writeTimeline, LAYOUTS, CAPTURES, stepTime } from '../_pipeline/lib.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DURATION = 35;
const TAKE = 'setup-take';
const take = CAPTURES[`video/${TAKE}`];
const [inMark, outMark] = take.marks; // other product may enter / has left frame

// Take segments: [takeFrom, takeTo, rate]. Contiguous, so nothing is skipped.
const T0 = 0.8;                       // first screen, before "Set up" is tapped
const T1 = inMark.t;                  // "Open Parent Area" tapped: real speed up to here
const T2 = outMark.t;                 // Parent Area gone
const T3 = stepTime(TAKE, /scroll back to the top/) + 1.6; // routine ready, buddy waiting
const F0 = 7.5;                       // film time the take starts
const film = (tt) => (tt <= T1 ? F0 + (tt - T0) : F0 + (T1 - T0) + (tt - T1) / 2);
const F1 = film(T1), F2 = film(T2), F3 = film(T3);

// Question: a long, grey sign-up form scrolling.
const FIELDS = ['Email address', 'Create a password', 'Confirm password', 'Your full name', 'Phone number', 'Postcode', 'Date of birth', 'How did you hear about us?', 'Choose a username', 'Security question', 'Answer'];
const field = (label) => `<div style="margin:0 9cqw 6cqw"><div style="font-family:'DM Sans';font-size:4.6cqw;color:#9A9089;margin-bottom:1.6cqw">${label}</div><div style="height:11cqw;border-radius:2.4cqw;background:#E9E5E1;border:1px solid #D6D0CA"></div></div>`;
const form = `<div data-scroll style="position:absolute;left:0;right:0;top:0;padding-top:9cqw;background:#F4F2F0">
  <div style="margin:0 9cqw 7cqw;font-family:'DM Sans';font-weight:600;font-size:7.4cqw;color:#7D756F">Create an account</div>
  ${FIELDS.map(field).join('')}
  <div style="margin:0 9cqw 6cqw;display:flex;gap:3cqw;align-items:center"><div style="width:6cqw;height:6cqw;border:1px solid #B9B1AA;border-radius:1cqw"></div><div style="font-family:'DM Sans';font-size:4.2cqw;color:#9A9089">I agree to the terms and conditions</div></div>
  <div style="margin:0 9cqw 9cqw;height:12cqw;border-radius:3cqw;background:#C9C3BD"></div></div>`;

const E = [];
E.push(frame(form, 0, 4.6, { fadeIn: 0.5, fadeOut: 0, innerY: [[0.3, 0], [4.0, -48]], scale: [[3.9, 1], [4.6, 0.86]], opacity: [[3.9, 1], [4.6, 0]] }));
// Model: the real first screen.
E.push(screen('01-first-open', 4.0, F0 + 0.05, { fadeIn: 0.6, fadeOut: 0 }));
E.push(text('Open it.', 4.3, 7.3));
// Proof and Turn: the take.
E.push(clip(TAKE, F0, F1, { start: T0, fadeIn: 0, fadeOut: 0 }));
// Parent Area on screen: reframe to its top, above another product's card.
const keep = 0.29; // fraction of screen height kept (03-parent-area.png crop: 250 of 844 px)
E.push(...perLayout(LAYOUTS, (l, c) => {
  const w = Math.min(c.w * 1.35, l === '1x1' ? 470 : 1000), h = w * (keep * 2532) / 1170;
  return clip(TAKE, F1, F2, { start: T1, rate: 2, fadeIn: 0, fadeOut: 0, region: { x: c.x + c.w / 2 - w / 2, y: c.y + c.h * 0.3 - h / 2, w, h }, focus: [[0, [0, 0, 1, keep]]] });
}));
E.push(clip(TAKE, F2, F3, { start: T2, rate: 2, fadeIn: 0, fadeOut: 0 }));
E.push(speedTag('x2', F1, F3));
E.push(text('Pick the kind of routine.', film(stepTime(TAKE, /choose Hoppy/)) + 0.1, film(stepTime(TAKE, /tap "Homework"/)) + 2.4));
E.push(text('Add what needs doing.', film(stepTime(TAKE, /remove task "Reading"/)) - 0.3, film(stepTime(TAKE, /type "Tidy up"/)) + 1.0));
const tTurn = stepTime(TAKE, /more time/);
E.push(text('Change it whenever.', film(tTurn) - 0.2, film(stepTime(TAKE, /tap "Save"/)) + 0.4));
// Payoff: the phone turned round, routine ready, buddy waiting.
const P0 = F3, P1 = P0 + 0.6, P2 = P1 + 0.6;
E.push(screen('10-homework-ready', P0, P1, { fadeIn: 0.15, fadeOut: 0, rotY: [[P0, 0], [P1, 90]] }));
E.push(frame('', P1, P1 + 0.3, { fadeIn: 0, fadeOut: 0, rotY: [[P1, 90], [P1 + 0.3, 90]] }));
E.push(screen('10-homework-ready', P1, 32.0, { fadeIn: 0, fadeOut: 0.35, rotY: [[P1, -90], [P2, 0]] }));
E.push(text('Hand it over.', P2, P2 + 3.4));
E.push(endcard(32.0, DURATION, { fadeIn: 0.4 }));

const tl = { duration: DURATION, fps: 30, elements: E };
writeTimeline(DIR, tl);
console.log({ F1: F1.toFixed(2), F2: F2.toFixed(2), F3: F3.toFixed(2), turn: film(tTurn).toFixed(2) });
writeDocs(DIR, {
  title: 'TB-02 Setting up a routine', seconds: DURATION,
  framing: {
    question: "How much work is this before it's any use?",
    belief: 'Set-up is a project.',
    truth: 'Open it, pick the kind of routine, put in the tasks, hand it over. No account.',
  },
  beats: [
    { name: 'Question', from: 0, to: 4.0, picture: 'A long, grey sign-up form scrolling, drawn in neutral greys. This is what people brace for.' },
    { name: 'Model', from: 4.0, to: F0, picture: 'The form shrinks away; the real first screen of the app ("Set up a family routine") is underneath.' },
    { name: 'Proof', from: F0, to: film(tTurn), picture: `One continuous take from a fresh install. Real speed from the first screen through the parent gate (typed answer), then x2 with an "x2" tag: Parent Area (reframed to its top), Done, choose Hoppy, Homework, Edit tasks, the parent gate again, remove Reading and Pack Backpack for Tomorrow, add a custom task typed as "Tidy up".` },
    { name: 'Turn', from: film(tTurn), to: F3, picture: 'Still the same take at x2: Homework goes up to 25 minutes, Have a Snack is dragged to the top, Save, Done, back to the top: routine ready, Hoppy waiting.' },
    { name: 'Payoff', from: F3, to: DURATION, picture: 'The ready screen turns round, as if handed over, and comes back facing the viewer. End card: logo and taskbuddies.app.' },
  ],
  vo: [
    { in: 0.4, out: 3.8, text: 'You might expect an account and a long form first.' },
    { in: 4.3, out: 7.3, text: 'Open it.' },
    { in: 7.6, out: 11.0, text: 'Answer the grown-up question.' },
    { in: film(stepTime(TAKE, /choose Hoppy/)) + 0.1, out: film(stepTime(TAKE, /tap "Homework"/)) + 2.4, text: 'Pick the kind of routine.' },
    { in: film(stepTime(TAKE, /remove task "Reading"/)) - 0.3, out: film(stepTime(TAKE, /type "Tidy up"/)) + 1.0, text: 'Add what needs doing.' },
    { in: film(tTurn) - 0.2, out: film(stepTime(TAKE, /tap "Save"/)) + 0.4, text: 'Change times and order whenever you like.' },
    { in: P2, out: P2 + 3.4, text: 'Then hand it over.' },
  ],
  tl,
  notes: ['', `Take: screens/taskbuddies/video/${TAKE}.mp4 from ${T0} s to ${T3.toFixed(2)} s, no cuts. Real speed from ${T0} s to ${T1.toFixed(2)} s; x2 from ${T1.toFixed(2)} s to ${T3.toFixed(2)} s, tagged "x2" on screen. Reframed to the top ${Math.round(keep * 100)}% of the screen from ${T1.toFixed(2)} s to ${T2.toFixed(2)} s (Parent Area).`],
});
