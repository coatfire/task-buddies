/**
 * Store screenshot generator.
 *
 * 1. Drives the running app (Vite dev server) in a phone-sized Chromium,
 *    seeds each state directly through the zustand store, and captures it.
 * 2. Composes each capture into a marketing poster (headline + phone frame)
 *    at App Store and Play Store dimensions.
 *
 * Usage:
 *   npm run dev              # in another terminal
 *   npm run screenshots      # -> store-assets/screenshots/{ios-6.7,ios-6.9,android}/
 *
 *   BASE_URL=http://localhost:4173 npm run screenshots   # against `vite preview`
 *   ONLY=hero,player-running npm run screenshots         # subset by id
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CHARACTERS } from '../../src/data/characters.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUT = resolve(ROOT, 'store-assets/screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ONLY = process.env.ONLY?.split(',').map((s) => s.trim()).filter(Boolean);

// Logical phone viewport used to capture the app. 390x844 = iPhone 14/15 class.
const PHONE = { width: 390, height: 844, deviceScaleFactor: 3 };
const SAFE_TOP_PX = 54; // room for the fake status bar drawn by the poster

const TARGETS = [
  { dir: 'ios-6.7', width: 1290, height: 2796 },
  { dir: 'ios-6.9', width: 1320, height: 2868 },
  { dir: 'android', width: 1080, height: 2340 },
];

/**
 * The app exposes its live zustand store as window.__tb in dev builds (see src/main.jsx).
 * Importing the module here would get a separate instance once Vite HMR has re-versioned it.
 */
const STORE_BOOTSTRAP = `
  if (!window.__tb) throw new Error('window.__tb missing: run against the Vite dev server (npm run dev)');
`;

const bedtimeTasks = (idx) => [
  { key: 'put_on_pyjamas' }, { key: 'brush_teeth' }, { key: 'go_potty' }, { key: 'pick_a_book' }, { key: 'lights_off' },
][idx];

// Sprite sheets live in public/buddy-watercolor/<id>-celebrate.webp (4x4, 128px frames).
// Positions are in poster pixels (1290x2796 base). Scale multiplies the app's spriteScale.
const HERO_BUDDIES = [
  { id: 'hoppy',   x: 645,  y: 1640, scale: 6.4, rot: -4 },
  { id: 'snapper', x: 300,  y: 1260, scale: 4.6, rot: 8 },
  { id: 'snoozy',  x: 990,  y: 1290, scale: 4.8, rot: -7 },
  { id: 'flutty',  x: 280,  y: 2180, scale: 4.5, rot: 6 },
  { id: 'buddy',   x: 1010, y: 2220, scale: 4.5, rot: -5 },
];

const SHOTS = [
  {
    id: 'hero',
    layout: 'buddies',
    headline: 'Routines are hard. Buddies help.',
    sub: 'A gentle companion that sits with your child through bedtime, mornings and homework.',
    tint: 'sand',
    seed: async () => {},
  },
  {
    id: 'player-running',
    headline: 'A timer that never rushes',
    sub: 'Your buddy waits patiently. No alarms, no countdown pressure.',
    tint: 'sky',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        const s = window.__tb.getState();
        s.setSelectedCharacter('hoppy');
        s.setRoutine('bedtime');
        s.startRoutine();
        const st = window.__tb.getState();
        const total = st.tasks[1].durationMinutes * 60;
        clearInterval(st.timerInterval);
        window.__tb.setState({
          currentTaskIndex: 1, totalTime: total, timeLeft: Math.round(total * 0.45),
          rexState: 'idle', isRunning: true, timerInterval: null, timerEndsAt: null,
        });
      })()`);
    },
  },
  {
    id: 'player-hungry',
    headline: 'Every finished task feeds your buddy',
    sub: 'Done? Tap to feed. Watch them chomp and cheer.',
    tint: 'peach',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        const s = window.__tb.getState();
        s.setSelectedCharacter('flutty');
        s.setRoutine('morning');
        s.startRoutine();
        const st = window.__tb.getState();
        clearInterval(st.timerInterval);
        window.__tb.setState({
          currentTaskIndex: 2, timeLeft: 0, rexState: 'hungry', isRunning: false,
          timerInterval: null, timerEndsAt: null,
        });
      })()`);
      await page.waitForTimeout(600);
    },
  },
  {
    id: 'reward',
    headline: 'Rewards that bring you closer',
    sub: 'Not screen time. A secret handshake, a dance-off, one more story.',
    tint: 'sand',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        const s = window.__tb.getState();
        s.setSelectedCharacter('buddy');
        s.setRoutine('bedtime');
        window.__tb.setState({ screen: 'complete', rexState: 'celebrating', isRunning: false });
      })()`);
      // chest appears after ~2s, then tap to open and wait for the reveal
      await page.getByRole('button', { name: /open your reward/i }).click({ timeout: 6000 });
      await page.waitForTimeout(1400);
    },
  },
  {
    id: 'buddies',
    headline: 'Five buddies. Pick a favorite.',
    sub: 'Each one brings a slightly different energy to the routine.',
    tint: 'lilac',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        window.__tb.setState({ screen: 'selection', selectedCharacter: 'snoozy' });
      })()`);
      await page.getByRole('button', { name: /next buddy/i }).click();
      await page.getByRole('button', { name: /next buddy/i }).click();
      await page.waitForTimeout(700);
    },
  },
  {
    id: 'routines',
    headline: 'Bedtime, morning, homework — or your own',
    sub: 'Ready-made routines with sensible defaults. Change anything.',
    tint: 'sky',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        window.__tb.getState().setSelectedCharacter('snapper');
        window.__tb.setState({ screen: 'picker' });
      })()`);
    },
  },
  {
    id: 'setup',
    headline: 'Set it up once. One tap to start.',
    sub: 'Drag to reorder, tap to adjust minutes. It remembers for next time.',
    tint: 'sage',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        const s = window.__tb.getState();
        s.setSelectedCharacter('snoozy');
        s.setRoutine('bedtime');
      })()`);
      await page.getByRole('button', { name: /edit tasks/i }).click();
      await page.waitForTimeout(500);
    },
  },
  {
    id: 'parents',
    headline: 'Parents stay in control',
    sub: 'Edit rewards and settings behind a grown-ups-only gate. Free, offline, no signup, no tracking.',
    tint: 'peach',
    seed: async (page) => {
      await page.evaluate(`(async () => { ${STORE_BOOTSTRAP}
        window.__tb.setState({ screen: 'settings' });
      })()`);
    },
  },
];

async function captureApp(browser, shot) {
  const ctx = await browser.newContext({
    viewport: { width: PHONE.width, height: PHONE.height },
    deviceScaleFactor: PHONE.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce', // settle animations instantly
    colorScheme: 'light',
  });
  const page = await ctx.newPage();
  // Vite's HMR websocket keeps the network busy, so don't wait for networkidle.
  await page.goto(BASE_URL, { waitUntil: 'load' });
  await page.locator('.app-viewport').waitFor({ timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: `:root { --safe-area-top: ${SAFE_TOP_PX}px !important; }` });
  // fresh storage for every shot so seeds don't bleed into each other
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(`(async () => { ${STORE_BOOTSTRAP} })()`);
  await shot.seed(page);
  // let AnimatePresence page transitions and staggered entrances finish
  await page.waitForTimeout(1500);
  const png = await page.screenshot({ type: 'png' });
  await ctx.close();
  return png;
}

async function composePoster(browser, shot, appPng, target) {
  const ctx = await browser.newContext({ viewport: { width: target.width, height: target.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(resolve(__dirname, 'poster.html')).href);
  await page.evaluate(({ headline, sub, tint, layout, dataUrl, zoom, buddies, spriteBase }) => {
    document.body.classList.add(`tint-${tint}`);
    if (layout) document.body.classList.add(`layout-${layout}`);
    document.body.style.zoom = String(zoom);
    document.getElementById('headline').textContent = headline;
    document.getElementById('sub').textContent = sub || '';
    if (dataUrl) document.getElementById('shot').src = dataUrl;
    const host = document.getElementById('buddies');
    for (const b of buddies) {
      const blob = document.createElement('div');
      blob.className = 'blob';
      const d = 128 * b.scale * 0.95;
      blob.style.cssText = `left:${b.x - d / 2}px; top:${b.y - d / 2 + 10}px; width:${d}px; height:${d}px;`;
      host.appendChild(blob);
      const el = document.createElement('div');
      el.className = 'buddy';
      el.style.cssText = `left:${b.x - 64}px; top:${b.y - 64}px; transform: scale(${b.scale * b.spriteScale}) rotate(${b.rot}deg); background-image: url('${spriteBase}/${b.id}-celebrate.webp');`;
      host.appendChild(el);
    }
  }, {
    headline: shot.headline,
    sub: shot.sub,
    tint: shot.tint,
    layout: shot.layout || null,
    dataUrl: appPng ? `data:image/png;base64,${appPng.toString('base64')}` : null,
    zoom: target.width / 1290,
    buddies: shot.layout === 'buddies' ? HERO_BUDDIES.map((b) => ({ ...b, spriteScale: CHARACTERS.find((c) => c.id === b.id)?.spriteScale ?? 1 })) : [],
    spriteBase: pathToFileURL(resolve(ROOT, 'public/buddy-watercolor')).href,
  });
  await page.evaluate(() => document.fonts.ready);
  if (appPng) await page.locator('#shot').evaluate((img) => img.complete || new Promise((r) => { img.onload = r; }));
  await page.waitForTimeout(300); // let sprite images decode
  const png = await page.screenshot({ type: 'png', fullPage: false });
  await ctx.close();
  return png;
}

async function main() {
  const shots = ONLY ? SHOTS.filter((s) => ONLY.includes(s.id)) : SHOTS;
  const browser = await chromium.launch();
  try {
    for (const t of TARGETS) await mkdir(resolve(OUT, t.dir), { recursive: true });
    await mkdir(resolve(OUT, 'raw'), { recursive: true });

    for (const [i, shot] of shots.entries()) {
      const n = String(i + 1).padStart(2, '0');
      process.stdout.write(`${n} ${shot.id} … `);
      const appPng = shot.layout === 'buddies' ? null : await captureApp(browser, shot);
      if (appPng) await writeFile(resolve(OUT, 'raw', `${n}-${shot.id}.png`), appPng);
      for (const t of TARGETS) {
        const poster = await composePoster(browser, shot, appPng, t);
        await writeFile(resolve(OUT, t.dir, `${n}-${shot.id}.png`), poster);
      }
      console.log('ok');
    }
  } finally {
    await browser.close();
  }
  console.log(`\nWrote ${shots.length} shots × ${TARGETS.length} sizes to ${OUT}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
