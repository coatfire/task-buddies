// TB-04: What it doesn't ask for. node films/tb-04-what-it-doesnt-ask/build.mjs
// Statements only where APP_FACTS.md and the runtime log (NETWORK_LOG.md, storage.json) both support them.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { text, screen, endcard, writeDocs, writeTimeline } from '../_pipeline/lib.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DURATION = 25;
const ICON = 'brand/taskbuddies/icon.png';

// The app icon, centred in the screen area, with an optional empty email field in front of it.
const icon = (tin, tout, extra = {}) => ({
  kind: 'html', region: 'screen', in: tin, out: tout,
  html: `<img src="${ICON}" style="position:absolute;left:50%;top:44%;width:52cqw;height:52cqw;transform:translate(-50%,-50%);border-radius:11.5cqw;box-shadow:0 3cqw 8cqw rgba(74,52,38,0.22)">`,
  ...extra,
});
const emailField = (tin, tout, extra = {}) => ({
  kind: 'html', region: 'screen', in: tin, out: tout,
  html: `<div style="position:absolute;left:8cqw;right:8cqw;top:58%;padding:4.5cqw 5cqw;border-radius:4cqw;background:#FFFFFF;border:1px solid #D6D0CA;box-shadow:0 4cqw 10cqw rgba(74,52,38,0.25);font-family:'DM Sans';font-size:5.4cqw;color:#A79E96">Email address</div>`,
  ...extra,
});

const E = [];
// Question: the icon with an empty email field hovering in front of it.
E.push(icon(0, 4.4, { fadeIn: 0.5, fadeOut: 0.4 }));
E.push(emailField(0.6, 4.2, { fadeIn: 0.4, fadeOut: 0, enter: 'up', opacity: [[3.5, 1], [4.2, 0]], filter: [[3.5, 0], [4.2, 14]] }));
E.push(text("What's the catch?", 0.4, 3.4));
// Model: the field dissolves; the real first screen is already usable.
E.push(screen('50-prod-first-open', 4.1, 7.2, { fadeIn: 0.5, fadeOut: 0.3 }));
E.push(text('No sign-up.', 4.5, 7.0));
// Proof: each surviving statement beside the real screen it relates to.
E.push(screen('51-prod-ready', 7.0, 11.4, { fadeIn: 0.35, fadeOut: 0.3 }));
E.push(text('Your routine stays on your device.', 7.3, 11.2));
E.push(screen('52-prod-finished', 11.2, 15.4, { fadeIn: 0.35, fadeOut: 0.3 }));
E.push(text('No ads.', 11.5, 15.0));
// Turn: close it, reopen it, the routine is still there.
E.push(screen('52-prod-finished', 15.2, 15.9, { fadeIn: 0, fadeOut: 0, scale: [[15.2, 1], [15.9, 0.6]], opacity: [[15.2, 1], [15.9, 0]] }));
E.push(screen('53-prod-reopened', 16.3, 17.3, { fadeIn: 0.0, fadeOut: 0.2, enter: 'scale', scale: [[16.3, 0.6], [16.8, 1]] }));
E.push(screen('54-prod-reopened-ready', 17.2, 18.5, { fadeIn: 0.2, fadeOut: 0.2 }));
E.push(text('Close it. Open it again.', 15.5, 18.6));
E.push(screen('56-prod-reopened-tasks-all', 18.4, 21.2, { fadeIn: 0.2, fadeOut: 0.35 }));
E.push(text('Still there.', 18.8, 21.1));
// Payoff: the icon again, nothing in front of it.
E.push(icon(21.2, 23.4, { fadeIn: 0.4, fadeOut: 0.35 }));
E.push(endcard(23.4, DURATION, { fadeIn: 0.4 }));

const tl = { duration: DURATION, fps: 30, elements: E };
writeTimeline(DIR, tl);
writeDocs(DIR, {
  title: "TB-04 What it doesn't ask for", seconds: DURATION,
  framing: {
    question: "What's the catch?",
    belief: 'Free means you hand something over.',
    truth: 'It asks for no account or email, shows no ads, and keeps your routine on your device.',
  },
  beats: [
    { name: 'Question', from: 0, to: 4.1, picture: 'The Task Buddies icon with an empty "Email address" field hovering in front of it.' },
    { name: 'Model', from: 4.1, to: 7.0, picture: 'The field blurs away. The real first screen of the production build, usable straight away.' },
    { name: 'Proof', from: 7.0, to: 15.4, picture: 'Each surviving statement beside its screen: the saved Homework routine ("stays on your device"), then the finished routine with its reward ("no ads").' },
    { name: 'Turn', from: 15.4, to: 21.2, picture: 'The screen shrinks away as the browser is closed; it reopens where it was left, then the same Homework routine, then its task list with the typed "Tidy up" still there. All from one persistent profile in the runtime check.' },
    { name: 'Payoff', from: 21.2, to: DURATION, picture: 'The icon again, nothing in front of it. End card: logo and taskbuddies.app.' },
  ],
  vo: [
    { in: 0.4, out: 3.4, text: "What's the catch?" },
    { in: 4.5, out: 7.0, text: 'There is no sign-up. No email.' },
    { in: 7.3, out: 11.2, text: 'The routine you set up stays on your device.' },
    { in: 11.5, out: 15.0, text: 'There are no ads.' },
    { in: 15.5, out: 21.1, text: 'Close it, open it again, and the routine is still there.' },
  ],
  tl,
});
