/**
 * Social media asset pack.
 *
 * Produces PNGs a designer can slice, dice and splice:
 *   buddies/<id>/<pose>.png              hero pose, transparent, 1024px
 *   buddies/<id>/frames/<pose>-NN.png    every animation frame, transparent, 512px (for GIFs/reels)
 *   buddies/<id>/contact-sheet.png       all poses and frames at a glance
 *   group/                               all buddies together (transparent and on cream)
 *   screens/phone|ipad-portrait|ipad-landscape/  raw app screens, no frame, high resolution
 *   mockups/iphone|android|ipad/         app screens inside a device frame, transparent background
 *
 * Usage:
 *   npm run dev       # in another terminal
 *   npm run social    # -> store-assets/social/
 *   OUT=tmp/social npm run social
 *
 * Only buddies listed in src/data/characters.js are exported, so unreleased art stays private.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CHARACTERS } from '../../src/data/characters.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUT = resolve(ROOT, process.env.OUT || 'store-assets/social');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const POSTER = pathToFileURL(resolve(ROOT, 'scripts/screenshots/poster.html')).href;

const POSES = ['idle', 'bored', 'chomp', 'celebrate'];
const FRAMES = 16; // 4x4 sheet, 256px frames
const CREAM = '#FAF3E8';
const BOOT = `if (!window.__tb) throw new Error('window.__tb missing: run against the Vite dev server (npm run dev)');`;

const write = async (rel, buf) => {
  const file = resolve(OUT, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buf);
};
const fromDataUrl = (url) => Buffer.from(url.split(',')[1], 'base64');

// ── Buddies: cut frames straight from the sprite sheets in the browser ────────────────
async function exportBuddies(browser) {
  const heroFrames = {};
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'load' });
  for (const c of CHARACTERS) {
    process.stdout.write(`buddy ${c.id} `);
    const result = await page.evaluate(async ({ id, poses, frames }) => {
      const load = (src) => new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
      const cut = (img, n, size) => {
        const f = img.naturalWidth / 4;
        const cv = document.createElement('canvas');
        cv.width = cv.height = size;
        const ctx = cv.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, (n % 4) * f, Math.floor(n / 4) * f, f, f, 0, 0, size, size);
        return cv;
      };
      // Pixel difference between two small frames, used to find each mood's most expressive frame.
      const pixels = (cv) => cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      const diff = (a, b) => { let d = 0; for (let i = 0; i < a.length; i += 4) d += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) + Math.abs(a[i + 3] - b[i + 3]); return d; };
      // Crop a transparent canvas to its artwork plus a little padding.
      const trim = (cv, padRatio = 0.04) => {
        const { width: w, height: h } = cv;
        const data = cv.getContext('2d').getImageData(0, 0, w, h).data;
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        if (x1 < 0) return cv;
        const pad = Math.round(Math.max(x1 - x0, y1 - y0) * padRatio);
        x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
        const out = document.createElement('canvas');
        out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
        out.getContext('2d').drawImage(cv, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
        return out;
      };
      const restImg = await load(`/buddy-watercolor/${id}-idle.webp`);
      const rest = pixels(cut(restImg, 0, 96));
      const out = { hero: {}, heroFrame: {}, frames: {}, sheet: null };
      const sheet = document.createElement('canvas');
      const cell = 160;
      sheet.width = cell * frames + 40;
      sheet.height = cell * poses.length + 40;
      const sctx = sheet.getContext('2d');
      sctx.fillStyle = '#FAF3E8';
      sctx.fillRect(0, 0, sheet.width, sheet.height);
      sctx.font = '600 14px sans-serif';
      sctx.fillStyle = '#8A7560';
      for (const [row, pose] of poses.entries()) {
        const img = await load(`/buddy-watercolor/${id}-${pose}.webp`);
        // Idle keeps the calm rest pose; other moods use the frame that differs most from it.
        let best = 0;
        if (pose !== 'idle') {
          let bestScore = -1;
          for (let n = 0; n < frames; n++) { const sc = diff(pixels(cut(img, n, 96)), rest); if (sc > bestScore) { bestScore = sc; best = n; } }
        }
        out.heroFrame[pose] = best + 1;
        out.hero[pose] = trim(cut(img, best, 1024)).toDataURL('image/png');
        out.frames[pose] = [];
        for (let n = 0; n < frames; n++) {
          out.frames[pose].push(cut(img, n, 512).toDataURL('image/png'));
          sctx.drawImage(cut(img, n, cell), 20 + n * cell, 20 + row * cell);
          sctx.fillText(`${pose} ${String(n + 1).padStart(2, '0')}`, 26 + n * cell, 36 + row * cell);
        }
      }
      out.sheet = sheet.toDataURL('image/png');
      return out;
    }, { id: c.id, poses: POSES, frames: FRAMES });
    for (const pose of POSES) {
      await write(`buddies/${c.id}/${pose}.png`, fromDataUrl(result.hero[pose]));
      for (const [n, url] of result.frames[pose].entries()) {
        await write(`buddies/${c.id}/frames/${pose}-${String(n + 1).padStart(2, '0')}.png`, fromDataUrl(url));
      }
    }
    await write(`buddies/${c.id}/contact-sheet.png`, fromDataUrl(result.sheet));
    heroFrames[c.id] = result.heroFrame;
    process.stdout.write(`(hero frames ${POSES.map((p) => `${p} ${result.heroFrame[p]}`).join(', ')}) `);
  }
  console.log();
  await page.close();
  return heroFrames;
}

// ── Group shots: all buddies together ─────────────────────────────────────────────────
async function exportGroups(browser, heroFrames) {
  const ids = CHARACTERS.map((c) => c.id);
  const layouts = [
    { name: 'lineup-celebrate-transparent', w: 3000, h: 800, pose: 'celebrate', bg: null },
    { name: 'lineup-idle-transparent', w: 3000, h: 800, pose: 'idle', bg: null },
    { name: 'lineup-celebrate-cream-square', w: 1080, h: 1080, pose: 'celebrate', bg: CREAM, grid: true, size: 320 },
    { name: 'lineup-celebrate-cream-story', w: 1080, h: 1920, pose: 'celebrate', bg: CREAM, grid: true, size: 460 },
    { name: 'lineup-celebrate-cream-wide', w: 1920, h: 1080, pose: 'celebrate', bg: CREAM },
  ];
  for (const l of layouts) {
    const page = await browser.newPage({ viewport: { width: l.w, height: l.h } });
    // Same frame as the hero pose, scaled like the app does (sprite frames carry built-in padding).
    const cells = CHARACTERS.map((c) => {
      const n = (heroFrames[c.id]?.[l.pose] || 1) - 1;
      const pos = `${((n % 4) * 100) / 3}% ${(Math.floor(n / 4) * 100) / 3}%`;
      return `<div class="b"><div class="s" style="background-image:url('${BASE_URL}/buddy-watercolor/${c.id}-${l.pose}.webp');background-position:${pos};transform:scale(${(c.spriteScale * 0.9).toFixed(3)})"></div></div>`;
    }).join('');
    const size = l.size || Math.round(Math.min(l.h * 0.8, (l.w / ids.length) * 0.92));
    await page.setContent(`<!doctype html><style>
      html,body{margin:0;width:${l.w}px;height:${l.h}px;background:${l.bg || 'transparent'};overflow:hidden}
      body{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:${l.grid ? 10 : 0}px}
      ${l.bg ? `body{background:radial-gradient(ellipse at 50% 30%,#fff 0%,${l.bg} 60%,#F0E4CC 100%)}` : ''}
      .b{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;
         filter:drop-shadow(0 ${Math.round(size / 18)}px ${Math.round(size / 12)}px rgba(74,52,38,.18))}
      .s{width:100%;height:100%;flex-shrink:0;background-size:400% 400%;background-repeat:no-repeat}
    </style>${cells}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => Promise.all([...document.querySelectorAll('.s')].map((el) => new Promise((ok) => {
      const i = new Image(); i.onload = ok; i.onerror = ok; i.src = getComputedStyle(el).backgroundImage.slice(5, -2);
    }))));
    await page.waitForTimeout(300);
    await write(`group/${l.name}.png`, await page.screenshot({ omitBackground: !l.bg }));
    await page.close();
  }
  console.log('group shots ok');
}

// ── App screens ───────────────────────────────────────────────────────────────────────
const startAt = (buddy, routine, patch) => `(() => { ${BOOT}
  const s = window.__tb.getState(); s.setSelectedCharacter('${buddy}'); s.setRoutine('${routine}'); s.startRoutine();
  const st = window.__tb.getState(); clearInterval(st.timerInterval);
  window.__tb.setState(Object.assign({ timerInterval: null, timerEndsAt: null }, ${JSON.stringify(patch || {})}));
})()`;

const SCREENS = [
  { id: 'setup-welcome', firstRun: true },
  { id: 'parent-gate', seed: `(() => { ${BOOT} window.__tb.getState().openParentGate('setup'); })()` },
  ...CHARACTERS.map((c, i) => ({ id: `buddies-${c.id}`, seed: `(() => { ${BOOT} window.__tb.setState({ screen: 'selection' }); })()`, clickNext: i })),
  { id: 'routines', seed: `(() => { ${BOOT} window.__tb.setState({ screen: 'picker' }); })()` },
  { id: 'routine-bedtime-snoozy', seed: `(() => { ${BOOT} const s = window.__tb.getState(); s.setSelectedCharacter('snoozy'); s.setRoutine('bedtime'); })()` },
  { id: 'routine-morning-hoppy', seed: `(() => { ${BOOT} const s = window.__tb.getState(); s.setSelectedCharacter('hoppy'); s.setRoutine('morning'); })()` },
  { id: 'routine-homework-snapper', seed: `(() => { ${BOOT} const s = window.__tb.getState(); s.setSelectedCharacter('snapper'); s.setRoutine('homework'); })()` },
  ...CHARACTERS.map((c, i) => ({ id: `timer-running-${c.id}`, seed: startAt(c.id, ['bedtime', 'morning', 'homework', 'bedtime', 'morning'][i], { currentTaskIndex: i % 3, timeLeft: 47 + i * 9, totalTime: 120, isRunning: true, rexState: 'idle' }) })),
  { id: 'timer-bored-flutty', seed: startAt('flutty', 'morning', { currentTaskIndex: 1, timeLeft: 9, totalTime: 120, rexState: 'bored' }) },
  ...CHARACTERS.map((c) => ({ id: `timer-hungry-${c.id}`, seed: startAt(c.id, 'bedtime', { currentTaskIndex: 2, timeLeft: 0, rexState: 'hungry', isRunning: false }) })),
  { id: 'timer-eating-hoppy', seed: startAt('hoppy', 'bedtime', { currentTaskIndex: 1, timeLeft: 40, isRunning: true, rexState: 'idle' }), tapDone: 900 },
  { id: 'timer-eating-buddy', seed: startAt('buddy', 'morning', { currentTaskIndex: 0, timeLeft: 40, isRunning: true, rexState: 'idle' }), tapDone: 1500 },
  { id: 'all-done-gift', seed: `(() => { ${BOOT} const s = window.__tb.getState(); s.setSelectedCharacter('snapper'); s.setRoutine('bedtime'); window.__tb.setState({ screen: 'complete', rexState: 'celebrating', isRunning: false }); })()`, wait: 2600 },
  { id: 'all-done-reward', seed: `(() => { ${BOOT} const s = window.__tb.getState(); s.setSelectedCharacter('buddy'); s.setRoutine('morning'); window.__tb.setState({ screen: 'complete', rexState: 'celebrating', isRunning: false }); })()`, openReward: true },
  { id: 'parent-area', seed: `(() => { ${BOOT} window.__tb.setState({ screen: 'settings' }); })()` },
];

const VIEWPORTS = {
  phone: { width: 390, height: 844, dsf: 3, safeTop: 14 },
  'ipad-portrait': { width: 820, height: 1180, dsf: 2, safeTop: 20 },
  'ipad-landscape': { width: 1180, height: 820, dsf: 2, safeTop: 20 },
};
// iPad gets a focused subset: the screens that show off the tablet layouts.
const IPAD_SCREENS = new Set(['setup-welcome', 'buddies-hoppy', 'routines', 'routine-bedtime-snoozy', 'timer-running-hoppy', 'timer-hungry-snoozy', 'all-done-reward', 'parent-area']);

async function captureScreen(browser, vpName, screen) {
  const vp = VIEWPORTS[vpName];
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dsf, isMobile: true, hasTouch: true, colorScheme: 'light' });
  if (!screen.firstRun) await ctx.addInitScript(() => localStorage.setItem('task-buddy:setup-complete', 'true'));
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'load' });
  await page.locator('.app-viewport').waitFor({ timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: `:root { --safe-area-top: ${vp.safeTop}px !important; }` });
  if (screen.seed) await page.evaluate(screen.seed);
  await page.waitForTimeout(900);
  for (let i = 0; i < (screen.clickNext || 0); i++) {
    await page.getByRole('button', { name: /next buddy/i }).click();
    await page.waitForTimeout(450);
  }
  if (screen.openReward) {
    await page.getByRole('button', { name: /open your reward/i }).click({ timeout: 6000 });
    await page.waitForTimeout(1400);
    await page.evaluate(() => document.querySelector('[data-buddy-scroll="true"]')?.scrollTo(0, 0));
    await page.waitForTimeout(200);
  }
  if (screen.tapDone) {
    await page.getByRole('button', { name: /^Done! Feed/ }).tap();
    await page.waitForTimeout(screen.tapDone);
  } else {
    await page.waitForTimeout(screen.wait || 700);
  }
  const png = await page.screenshot({ type: 'png' });
  await ctx.close();
  return png;
}

async function mockup(browser, png, { frame, device }) {
  const sizes = { phone: [1290, 2420], ipad: [2064, 2200] };
  const [w, h] = sizes[device];
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(POSTER);
  await page.evaluate(({ device, frame, dataUrl }) => {
    document.body.classList.add('layout-mockup', `device-${device}`);
    if (frame) document.body.classList.add(`frame-${frame}`);
    document.getElementById('shot').src = dataUrl;
  }, { device, frame, dataUrl: `data:image/png;base64,${png.toString('base64')}` });
  await page.locator('#shot').evaluate((img) => img.complete || new Promise((r) => { img.onload = r; }));
  await page.waitForTimeout(200);
  const out = await page.screenshot({ omitBackground: true });
  await page.close();
  return out;
}

async function exportScreens(browser) {
  // Mockups need the screen captured with room for the drawn status bar.
  const mockupSafeTop = { phone: 54, android: 36, ipad: 32 };
  for (const [vpName] of Object.entries(VIEWPORTS)) {
    const list = vpName === 'phone' ? SCREENS : SCREENS.filter((s) => IPAD_SCREENS.has(s.id));
    for (const screen of list) {
      process.stdout.write(`${vpName}/${screen.id} `);
      await write(`screens/${vpName}/${screen.id}.png`, await captureScreen(browser, vpName, screen));
    }
    console.log();
  }
  // Device mockups for a curated set
  const MOCKUP_SCREENS = ['setup-welcome', 'buddies-snoozy', 'timer-running-hoppy', 'timer-hungry-flutty', 'timer-eating-hoppy', 'all-done-reward', 'routine-bedtime-snoozy', 'parent-area'];
  const saved = VIEWPORTS.phone.safeTop;
  for (const [label, frame, safeTop] of [['iphone', null, mockupSafeTop.phone], ['android', 'android', mockupSafeTop.android]]) {
    VIEWPORTS.phone.safeTop = safeTop;
    for (const id of MOCKUP_SCREENS) {
      const png = await captureScreen(browser, 'phone', SCREENS.find((s) => s.id === id));
      await write(`mockups/${label}/${id}.png`, await mockup(browser, png, { frame, device: 'phone' }));
    }
  }
  VIEWPORTS.phone.safeTop = saved;
  // iPad mockups use the iPad Pro 11" portrait capture, matching the store posters
  VIEWPORTS.ipadMock = { width: 834, height: 1194, dsf: 2, safeTop: mockupSafeTop.ipad };
  for (const id of ['buddies-hoppy', 'timer-running-hoppy', 'routines', 'parent-area']) {
    const png = await captureScreen(browser, 'ipadMock', SCREENS.find((s) => s.id === id));
    await write(`mockups/ipad/${id}.png`, await mockup(browser, png, { device: 'ipad' }));
  }
  console.log('mockups ok');
}

const README = `Task Buddies social pack
========================

All files are PNG. Transparent backgrounds where noted.

buddies/<name>/
  idle.png, bored.png, chomp.png, celebrate.png
      Hero pose for each mood, transparent background, 1024 x 1024.
  frames/<pose>-01..16.png
      Every animation frame, transparent, 512 x 512. Play 01 to 16 at about 10 fps
      for a looping GIF, sticker or reel overlay.
  contact-sheet.png
      All poses and frames on one sheet, to pick favourites quickly.

group/
  lineup-*-transparent.png   All buddies in a row, transparent background.
  lineup-*-cream-*.png       Ready-made square (1080), story (1080 x 1920) and wide (1920 x 1080).

screens/
  phone/            Raw app screens, iPhone size, 1170 x 2532, no device frame.
  ipad-portrait/    Raw iPad screens, 1640 x 2360.
  ipad-landscape/   Raw iPad screens, 2360 x 1640.

mockups/
  iphone/ android/ ipad/
      App screens inside a device frame, transparent background. Drop onto any background.

Notes
  The buddy art is watercolour, drawn at 256 px per frame. The 1024 px hero poses are
  smoothly upscaled, so they look best at up to about phone-screen size.
  Copy in the app follows the store rules: please avoid calling it an app "for kids"
  or "for children" in captions. "Family routine app" is the safe phrasing.
`;

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    const heroFrames = await exportBuddies(browser);
    await exportGroups(browser, heroFrames);
    await exportScreens(browser);
  } finally {
    await browser.close();
  }
  await writeFile(resolve(OUT, 'README.txt'), README);
  console.log(`\nSocial pack written to ${OUT}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
