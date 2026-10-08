// Captures the real Task Buddies app for the explainer films.
// Everything is driven through the UI from a fresh install; nothing is seeded into the store.
// Usage (dev server running on :5173):
//   node films/_pipeline/capture.mjs <session> [<session> ...]
// Sessions: setup (TB-02 continuous take), morning (TB-01 run), bedtime (TB-01 turn), timeout, buddies (TB-03)
// Writes PNGs to screens/taskbuddies, recordings to screens/taskbuddies/video, and log entries to
// screens/taskbuddies/capture-log.json (CAPTURE_LOG.md is generated from it).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';
import { startRec, stopRec } from './screencast.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'screens/taskbuddies');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const LOG_FILE = path.join(OUT, 'capture-log.json');
fs.mkdirSync(path.join(OUT, 'video'), { recursive: true });
const log = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')) : {};

export const CONTEXT = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: devices['iPhone 14'].userAgent,
  reducedMotion: 'no-preference',
  colorScheme: 'light',
};

const LOVOU_TEXT = ['Routine done. Now the hard part.', 'The other half of our bedtime'];
const wait = (page, ms) => page.waitForTimeout(ms);

class Session {
  constructor(name, page, context) { this.name = name; this.page = page; this.context = context; this.steps = []; this.rec = null; }

  act(text) { this.steps.push(text); this.times = this.times || []; this.times.push(Date.now() / 1000); console.log(`  ${this.name}: ${text}`); }

  // Mark a moment in the current recording (for example, another product entering or leaving frame).
  mark(label) { this.marks = this.marks || []; this.marks.push({ label, wall: Date.now() / 1000 }); }

  // Top edge (CSS px) of any other-product card on screen, or null.
  async otherProductTop() {
    return this.page.evaluate((needles) => {
      let top = null;
      for (const el of document.querySelectorAll('h3')) {
        if (!needles.includes(el.textContent.trim())) continue;
        const card = el.closest('.rounded-\\[24px\\], .rounded-2xl') || el;
        const r = card.getBoundingClientRect();
        if (r.height > 0 && r.top < window.innerHeight) top = top === null ? r.top : Math.min(top, r.top);
      }
      // Footer social links in the Parent Area
      for (const el of document.querySelectorAll('[aria-label^="Lovou"]')) {
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.top < window.innerHeight) top = top === null ? r.top : Math.min(top, r.top);
      }
      return top;
    }, LOVOU_TEXT);
  }

  async shot(step, note = '') {
    const top = await this.otherProductTop();
    const opts = { path: path.join(OUT, `${step}.png`) };
    let crop = null;
    if (top !== null) {
      const h = Math.floor(top - 8);
      if (h < 200) { this.act(`DISCARDED ${step}: another product fills the frame`); log[step] = { discarded: true, session: this.name, steps: [...this.steps] }; return null; }
      crop = { x: 0, y: 0, width: 390, height: h };
      opts.clip = crop;
    }
    await this.page.screenshot(opts);
    log[step] = { file: `screens/taskbuddies/${step}.png`, session: this.name, url: this.page.url(), steps: [...this.steps], crop, note };
    console.log(`  -> ${step}.png${crop ? ` (cropped to ${crop.height}px above another product's card)` : ''}`);
    return crop;
  }

  async startRec(name) {
    this.rec = { name, h: await startRec(this.context, this.page, path.join(OUT, 'rec', name)), from: this.steps.length };
  }

  async stopRec(note = '') {
    const { name, h, from } = this.rec;
    const frames = await stopRec(h);
    const t0 = h.frames[0].t;
    const out = path.join(OUT, 'video', `${name}.mp4`);
    execFileSync('node', [path.join(ROOT, 'films/_pipeline/encode-rec.mjs'), path.join(OUT, 'rec', name), out], { stdio: 'inherit' });
    const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).toString().trim());
    const steps = this.steps.slice(from).map((text, i) => ({ t: +(this.times[from + i] - t0).toFixed(2), text }));
    const marks = (this.marks || []).filter((m) => m.wall >= t0).map((m) => ({ t: +(m.wall - t0).toFixed(2), label: m.label }));
    this.marks = [];
    log[`video/${name}`] = { file: `screens/taskbuddies/video/${name}.mp4`, session: this.name, url: this.page.url(), steps, marks, frames, duration: dur, note };
    this.rec = null;
    return dur;
  }

  // ---- app actions -------------------------------------------------------
  async solveGate({ slow = false } = {}) {
    const label = await this.page.locator('label[for="parent-gate-answer"]').textContent();
    const [, a, b] = label.match(/(\d+)\s*×\s*(\d+)/);
    const answer = String(Number(a) * Number(b));
    this.act(`parent gate asks ${a} × ${b}; type ${answer}`);
    const input = this.page.locator('#parent-gate-answer');
    await input.tap();
    await input.pressSequentially(answer, { delay: slow ? 220 : 40 });
    if (slow) await wait(this.page, 700);
  }

  async tap(locator, text, pause = 0) {
    this.act(text);
    await locator.tap();
    if (pause) await wait(this.page, pause);
  }

  async taskNames() {
    const inputs = this.page.getByLabel('Task name');
    const n = await inputs.count();
    const names = [];
    for (let i = 0; i < n; i++) names.push(await inputs.nth(i).inputValue());
    return names;
  }

  async removeTask(name, pause = 500) {
    const names = await this.taskNames();
    const i = names.indexOf(name);
    if (i < 0) throw new Error(`no task ${name}: ${names.join(', ')}`);
    await this.tap(this.page.locator('ul > li').nth(i).getByLabel('Remove task'), `remove task "${name}"`, pause);
  }

  async dragTask(name, toIndex, { steps = 24 } = {}) {
    const names = await this.taskNames();
    const i = names.indexOf(name);
    const rows = this.page.locator('ul > li');
    const grip = rows.nth(i).getByLabel('Drag to reorder');
    const gb = await grip.boundingBox();
    const tb = await rows.nth(toIndex).boundingBox();
    this.act(`drag "${name}" from position ${i + 1} to position ${toIndex + 1}`);
    const sx = gb.x + gb.width / 2, sy = gb.y + gb.height / 2;
    const ty = toIndex < i ? tb.y + 10 : tb.y + tb.height - 10;
    await this.page.mouse.move(sx, sy);
    await this.page.mouse.down();
    for (let k = 1; k <= steps; k++) { await this.page.mouse.move(sx, sy + ((ty - sy) * k) / steps); await wait(this.page, 25); }
    await wait(this.page, 200);
    await this.page.mouse.up();
    await wait(this.page, 500);
  }
}

async function open(browser, name, { clock = false } = {}) {
  const context = await browser.newContext(CONTEXT);
  const page = await context.newPage();
  if (clock) await page.clock.install();
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  const s = new Session(name, page, context);
  s.act(`fresh install, open ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 120000 });
  await page.locator('.app-viewport').waitFor({ timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await wait(page, 1200);
  return s;
}

// First-run set-up done quickly, off camera: Set up, parent gate, Parent Area, Done.
async function quickFirstRun(s) {
  const p = s.page;
  await s.tap(p.getByRole('button', { name: 'Set up' }), 'tap "Set up"', 500);
  await s.solveGate();
  await s.tap(p.getByRole('button', { name: 'Open Parent Area' }), 'tap "Open Parent Area"', 700);
  await s.tap(p.getByRole('button', { name: 'Done', exact: true }), 'tap "Done" in the Parent Area', 900);
}

async function scrollTop(s) {
  s.act('scroll back to the top');
  await s.page.mouse.move(195, 400);
  for (let k = 0; k < 8; k++) { await s.page.mouse.wheel(0, -150); await wait(s.page, 40); }
  await wait(s.page, 900);
}

async function chooseBuddy(s, name, pause = 900) {
  const p = s.page;
  for (let k = 0; k < 6; k++) {
    const btn = p.getByRole('button', { name: new RegExp(`Choose ${name}`) });
    const box = await btn.boundingBox().catch(() => null);
    if (box && box.x > 0 && box.x + box.width < 390) break;
    await s.tap(p.getByRole('button', { name: 'Next buddy' }), 'tap "Next buddy"', 600);
  }
  await s.tap(p.getByRole('button', { name: new RegExp(`Choose ${name}`) }), `choose ${name}`, pause);
}

async function editTasks(s, { slowGate = false } = {}) {
  const p = s.page;
  await s.tap(p.getByRole('button', { name: 'Edit tasks' }), 'tap "Edit tasks"', 600);
  await s.solveGate({ slow: slowGate });
  await s.tap(p.getByRole('button', { name: 'Continue' }), 'tap "Continue"', 900);
}

async function feedThrough(s, prefix, count, { shotEach = false } = {}) {
  const p = s.page;
  for (let i = 0; i < count; i++) {
    await wait(p, 1200);
    const title = (await p.locator('h2').last().textContent()).trim();
    if (shotEach) await s.shot(`${prefix}-task${i + 1}`, `running, task ${i + 1}: ${title}`);
    await s.tap(p.getByRole('button', { name: /^Done! Feed/ }), `task ${i + 1} "${title}": tap "Done! Feed"`);
    await wait(p, 700);
    await wait(p, 2600);
  }
}

// ---- sessions ---------------------------------------------------------------
const SESSIONS = {
  // TB-02: one continuous take from first open to a ready Homework routine.
  async setup(browser) {
    const s = await open(browser, 'setup');
    const p = s.page;
    await s.shot('01-first-open', 'first open after a fresh install');
    await s.startRec('setup-take');
    await wait(p, 1500);
    await s.tap(p.getByRole('button', { name: 'Set up' }), 'tap "Set up"', 900);
    await s.shot('02-parent-gate', 'parent gate on first open');
    await s.solveGate({ slow: true });
    s.mark('other product may enter frame');
    await s.tap(p.getByRole('button', { name: 'Open Parent Area' }), 'tap "Open Parent Area"', 1400);
    await s.shot('03-parent-area', 'Parent Area on first open');
    await s.tap(p.getByRole('button', { name: 'Done', exact: true }), 'tap "Done"', 700);
    s.mark('other product has left frame');
    await wait(p, 800);
    await s.shot('04-buddy-selection', 'buddy selection, Hoppy first');
    await chooseBuddy(s, 'Hoppy', 1300);
    await s.shot('05-routine-picker', 'routine type picker');
    await s.tap(p.getByRole('button', { name: /Homework/ }), 'tap "Homework"', 1500);
    await s.shot('06-homework-default', 'Homework routine with its default tasks');
    await editTasks(s, { slowGate: true });
    await s.shot('07-homework-editor', 'task editor open with the default Homework tasks');
    await s.removeTask('Reading', 800);
    await s.removeTask('Pack Backpack for Tomorrow', 800);
    await s.tap(p.getByRole('button', { name: 'Add task' }), 'tap "Add task"', 900);
    await s.tap(p.getByRole('button', { name: /Custom task/ }), 'tap "Custom task"', 700);
    const blank = p.getByLabel('Task name').last();
    await blank.tap();
    s.act('type "Tidy up"');
    await blank.pressSequentially('Tidy up', { delay: 130 });
    await p.locator('body').tap({ position: { x: 5, y: 5 } }).catch(() => {});
    await wait(p, 800);
    await s.shot('08-homework-tasks', 'tasks set: Unpack Backpack, Have a Snack, Homework, Tidy up');
    s.recTurnStart = s.steps.length;
    // Turn: edit one task, reorder another.
    const names = await s.taskNames();
    const hw = names.indexOf('Homework');
    for (let k = 0; k < 5; k++) await s.tap(p.locator('ul > li').nth(hw).getByLabel('More time'), 'Homework: tap + (more time)', 260);
    await wait(p, 500);
    await s.dragTask('Have a Snack', 0);
    await s.shot('09-homework-edited', 'Homework 25 min, Have a Snack moved to the top');
    await s.tap(p.getByRole('button', { name: /^Save$/ }), 'tap "Save"', 1000);
    await s.tap(p.getByRole('button', { name: /^Done$/ }), 'tap "Done" to close the editor', 900);
    await scrollTop(s);
    await s.shot('10-homework-ready', 'routine ready, buddy waiting, Start routine');
    await wait(p, 1500);
    const dur = await s.stopRec('continuous take, real speed, no cuts');
    console.log(`  setup take ${dur.toFixed(1)} s`);
    await s.context.close();
  },

  // TB-01: Morning routine run start to finish, then the reward.
  async morning(browser) {
    const s = await open(browser, 'morning');
    const p = s.page;
    await quickFirstRun(s);
    await chooseBuddy(s, 'Hoppy');
    await s.tap(p.getByRole('button', { name: /Morning/ }), 'tap "Morning"', 1200);
    await editTasks(s);
    for (const t of ['Go Potty', 'Wash Face', 'Brush Hair']) await s.removeTask(t, 400);
    await s.tap(p.getByRole('button', { name: /^Save$/ }), 'tap "Save"', 600);
    await s.tap(p.getByRole('button', { name: /^Done$/ }), 'tap "Done"', 900);
    await scrollTop(s);
    await s.shot('20-morning-ready', 'Morning routine ready: Get Dressed, Eat Breakfast, Brush Teeth, Put on Shoes, Pack Backpack');
    await s.startRec('morning-run');
    await s.tap(p.getByRole('button', { name: /Start routine/ }), 'tap "Start routine"', 1500);
    await feedThrough(s, '21-morning', 5, { shotEach: true });
    await wait(p, 1400);
    await s.shot('22-routine-finished', 'routine finished');
    await p.getByRole('button', { name: /Tap to open your reward/ }).waitFor({ timeout: 8000 });
    await wait(p, 800);
    await s.shot('23-reward-chest', 'reward chest waiting');
    await s.tap(p.getByRole('button', { name: /Tap to open your reward/ }), 'tap the reward chest', 1800);
    await s.shot('24-reward', 'reward revealed');
    await wait(p, 1000);
    await s.stopRec('Start routine to reward, real speed; tasks finished with "Done! Feed Hoppy"');
    // Turn: same buddy, different routine type.
    await s.tap(p.getByRole('button', { name: 'Back to buddies' }), 'tap "Back to buddies"', 1200);
    await chooseBuddy(s, 'Hoppy');
    await s.tap(p.getByRole('button', { name: /Bedtime/ }), 'tap "Bedtime"', 1300);
    await s.shot('25-bedtime-ready', 'Bedtime routine with Hoppy, default tasks');
    await s.startRec('bedtime-run');
    await s.tap(p.getByRole('button', { name: /Start routine/ }), 'tap "Start routine"', 2000);
    await s.shot('26-bedtime-task1', 'Bedtime running, task 1');
    await wait(p, 1500);
    await s.tap(p.getByRole('button', { name: /^Done! Feed/ }), 'tap "Done! Feed Hoppy"', 3600);
    await s.shot('27-bedtime-task2', 'Bedtime running, task 2');
    await wait(p, 1200);
    await s.stopRec('Bedtime with the same buddy, real speed');
    await s.context.close();
  },

  // Timer runs out, in real time: the first Morning task is set to 1 minute and left to run.
  async timeout(browser) {
    const s = await open(browser, 'timeout');
    const p = s.page;
    await quickFirstRun(s);
    await chooseBuddy(s, 'Hoppy');
    await s.tap(p.getByRole('button', { name: /Morning/ }), 'tap "Morning"', 1200);
    await editTasks(s);
    for (let k = 0; k < 4; k++) await s.tap(p.locator('ul > li').first().getByLabel('Less time'), 'Get Dressed: tap - (less time)', 250);
    await s.tap(p.getByRole('button', { name: /^Save$/ }), 'tap "Save"', 600);
    await s.tap(p.getByRole('button', { name: /^Done$/ }), 'tap "Done"', 900);
    await scrollTop(s);
    await s.tap(p.getByRole('button', { name: /Start routine/ }), 'tap "Start routine"', 0);
    s.act('wait 33 s in real time');
    await wait(p, 33000);
    await s.shot('30-bored', 'under 30 s left on a 1 minute task: buddy bored');
    s.act('wait until the minute is up');
    await wait(p, 29500);
    await s.shot('31-timer-ran-out', 'time ran out: Feed button and bubble');
    await s.startRec('feed');
    await wait(p, 1500);
    await s.tap(p.getByRole('button', { name: /^Feed Hoppy/ }), 'tap "Feed Hoppy"', 3600);
    await s.stopRec('feeding after the timer ran out (real time)');
    await s.context.close();
  },

  // TB-03: the selection carousel and choosing a buddy.
  async buddies(browser) {
    const s = await open(browser, 'buddies');
    const p = s.page;
    await quickFirstRun(s);
    await s.startRec('selection');
    await wait(p, 1500);
    const names = ['Hoppy', 'Snapper', 'Snoozy', 'Flutty', 'Buddy'];
    for (let i = 0; i < names.length; i++) {
      await s.shot(`40-select-${names[i].toLowerCase()}`, `selection carousel on ${names[i]}`);
      if (i < names.length - 1) { await s.tap(p.getByRole('button', { name: 'Next buddy' }), 'tap "Next buddy"', 1300); }
    }
    for (let i = 0; i < 2; i++) await s.tap(p.getByRole('button', { name: 'Previous buddy' }), 'tap "Previous buddy"', 1100);
    await wait(p, 600);
    await s.tap(p.getByRole('button', { name: /Choose Snoozy/ }), 'choose Snoozy', 1400);
    await s.stopRec('browsing all five buddies, then choosing Snoozy');
    await s.tap(p.getByRole('button', { name: /Morning/ }), 'tap "Morning"', 1300);
    await s.shot('41-snoozy-ready', 'Morning routine with Snoozy');
    await s.startRec('snoozy-run');
    await s.tap(p.getByRole('button', { name: /Start routine/ }), 'tap "Start routine"', 2000);
    await s.tap(p.getByRole('button', { name: /^Done! Feed/ }), 'tap "Done! Feed Snoozy"', 3600);
    await wait(p, 800);
    await s.stopRec('Snoozy in a running Morning routine: idle, chomp, celebrate, next task');
    await s.context.close();
  },
};

const wanted = process.argv.slice(2);
const browser = await chromium.launch();
try {
  for (const name of wanted) {
    if (!SESSIONS[name]) throw new Error(`unknown session ${name}`);
    console.log(`session ${name}`);
    await SESSIONS[name](browser);
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2) + '\n');
  }
} finally {
  await browser.close();
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2) + '\n');
}
