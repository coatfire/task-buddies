// TB-03: Meet the buddies. node films/tb-03-buddies/build.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHARACTERS } from '../../src/data/characters.js';
import { text, clip, endcard, frame, perLayout, sprite, writeDocs, writeTimeline, LAYOUTS, stepTime } from '../_pipeline/lib.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DURATION = 20;
// Roster positions inside the screen card (fractions), in the app's order.
const POS = [[0.5, 0.2], [0.27, 0.46], [0.73, 0.46], [0.27, 0.72], [0.73, 0.72]];
const ARRIVE = [3.0, 4.8, 5.6, 6.4, 7.2];
const CHOSEN = 'snoozy';
const ci = CHARACTERS.findIndex((c) => c.id === CHOSEN);

const nameLabel = (name, c, x, y, d, tin, tout, extra = {}) => ({
  kind: 'html', region: { x: x - c.w * 0.25, y: y + d * 0.3, w: c.w * 0.5, h: c.w * 0.1 }, in: tin, out: tout,
  html: `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Nunito';font-weight:800;font-size:${c.w * 0.062}px;color:#4A3426">${name}</div>`,
  ...extra,
});

const E = [];
E.push(frame('', 0, 18.8, { fadeIn: 0.4, fadeOut: 0, layouts: undefined }));
E.push(...perLayout(LAYOUTS, (l, c) => CHARACTERS.flatMap((ch, i) => {
  const [fx, fy] = POS[i];
  const x = c.x + c.w * fx, y = c.y + c.h * fy, d = c.w * 0.4 * ch.spriteScale;
  const out = [];
  if (i === 0) {
    // Question: one silhouette where a mascot would be, then it fills in as Hoppy and takes its place.
    const cx = c.x + c.w / 2 - x, cy = c.y + c.h * 0.45 - y;
    out.push(sprite(ch.id, 'idle', 0, 9.0, { cx: x, cy: y, size: c.w * 0.4, mult: ch.spriteScale, fadeIn: 0.5, fadeOut: 0.3,
      ink: [[0, 1], [3.0, 1], [3.7, 0]], scale: [[0, 1.5], [3.7, 1.5], [4.4, 1]], x: [[3.7, cx], [4.4, 0]], y: [[0, cy], [3.7, cy], [4.4, 0]] }));
  } else {
    out.push(sprite(ch.id, 'idle', ARRIVE[i], 9.0, { cx: x, cy: y, size: c.w * 0.4, mult: ch.spriteScale, fadeIn: 0.4, fadeOut: 0.3, enter: 'scale', offset: i * 0.37 }));
  }
  out.push(nameLabel(ch.name, c, x, y, d, i === 0 ? 4.2 : ARRIVE[i] + 0.1, 9.0, { fadeIn: 0.3, fadeOut: 0.3 }));
  // Payoff: the full roster again; the chosen buddy steps forward.
  const chosen = i === ci;
  const fwd = { x: c.x + c.w * 0.5 - x, y: c.y + c.h * 0.58 - y };
  out.push(sprite(ch.id, chosen ? 'celebrate' : 'idle', 17.0, 18.8, { cx: x, cy: y, size: c.w * 0.4, mult: ch.spriteScale, fadeIn: 0.4, fadeOut: 0.3, offset: i * 0.37,
    ...(chosen ? { x: [[17.5, 0], [18.1, fwd.x]], y: [[17.5, 0], [18.1, fwd.y]], scale: [[17.5, 1], [18.1, 1.3]] } : { opacity: [[17.5, 1], [18.1, 0.2]] }) }));
  if (!chosen) out.push(nameLabel(ch.name, c, x, y, d, 17.0, 18.8, { fadeIn: 0.4, fadeOut: 0.3, opacity: [[17.5, 1], [18.1, 0.2]] }));
  return out;
})));
// Names in z-order above every sprite, chosen buddy's label last so it stays on top.
E.push(...perLayout(LAYOUTS, (l, c) => {
  const ch = CHARACTERS[ci];
  const d = c.w * 0.4 * ch.spriteScale * 1.3;
  return nameLabel(ch.name, c, c.x + c.w * 0.5, c.y + c.h * 0.58, d, 17.9, 18.8, { fadeIn: 0.3, fadeOut: 0.3 });
}));
E.push(text("Who's the buddy?", 0.3, 2.9));

// Proof: the real selection screen; Snoozy is chosen.
const tChoose = stepTime('selection', /choose Snoozy/);
E.push(clip('selection', 9.0, 13.4, { start: tChoose - 4.1, fadeIn: 0.35, fadeOut: 0 }));
E.push(text('They choose.', 9.3, 12.0));
// Turn: Snoozy in a running routine, fed, celebrating, then the next task.
const tFeed = stepTime('snoozy-run', /Done! Feed/);
E.push(clip('snoozy-run', 13.4, 17.2, { start: tFeed - 1.0, fadeIn: 0.2, fadeOut: 0.35 }));
E.push(text('Then they get going together.', 13.6, 17.0));
E.push(endcard(18.8, DURATION, { fadeIn: 0.4 }));
// Drop the undefined layouts key on the shared frame.
delete E[0].layouts;

const tl = { duration: DURATION, fps: 30, elements: E };
writeTimeline(DIR, tl);
writeDocs(DIR, {
  title: 'TB-03 Meet the buddies', seconds: DURATION,
  framing: {
    question: 'Who is the buddy?',
    belief: 'The buddy is one generic mascot.',
    truth: 'There are five buddies, and your child picks one.',
  },
  beats: [
    { name: 'Question', from: 0, to: 3.0, picture: 'One ink silhouette where a mascot would be (Hoppy\'s real idle frames, filled flat).' },
    { name: 'Model', from: 3.0, to: 9.0, picture: 'The silhouette fills in as Hoppy, then Snapper, Snoozy, Flutty and Buddy arrive one at a time in the app\'s order, each named and playing its real idle animation from its sprite sheet.' },
    { name: 'Proof', from: 9.0, to: 13.4, picture: 'The real buddy selection screen, recorded at real speed: browsing back to Snoozy and tapping "Choose Snoozy".' },
    { name: 'Turn', from: 13.4, to: 17.2, picture: 'Snoozy in a running Morning routine, recorded at real speed: "Done! Feed Snoozy", the chomp, the celebration, the next task.' },
    { name: 'Payoff', from: 17.2, to: 20, picture: 'All five together again; Snoozy steps forward, celebrating. End card: logo and taskbuddies.app.' },
  ],
  vo: [
    { in: 0.3, out: 2.9, text: "Who's the buddy?" },
    { in: 3.2, out: 8.8, text: 'There are five. Hoppy, Snapper, Snoozy, Flutty and Buddy.' },
    { in: 9.3, out: 12.6, text: 'Your child picks one.' },
    { in: 13.6, out: 17.0, text: 'Then they get going together.' },
  ],
  tl,
});
