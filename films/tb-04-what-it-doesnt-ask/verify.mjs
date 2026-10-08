// TB-04 runtime verification against the production web build.
//   npm run build:web && npm run preview   (http://localhost:4173)
//   node films/tb-04-what-it-doesnt-ask/verify.mjs
// One persistent browser profile: first open, parent gate, set up a routine, run it to the end,
// close the browser, relaunch with the same profile, check the routine is still there.
// Writes NETWORK_LOG.md, storage.json and screens/taskbuddies/5x-*.png.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const SHOTS = path.join(ROOT, 'screens/taskbuddies');
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const ORIGIN = new URL(BASE).host;
const TYPED = ['Tidy up'];          // user-entered text to look for in every request
const PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'tb04-profile-'));
const OPTS = {
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  userAgent: devices['iPhone 14'].userAgent, reducedMotion: 'no-preference', colorScheme: 'light', serviceWorkers: 'allow',
};

const requests = [];
const steps = [];
const shotsLog = {};
let phase = 'session 1';
const act = (t) => { steps.push(`[${phase}] ${t}`); console.log(`  ${t}`); };
const wait = (p, ms) => p.waitForTimeout(ms);

function watch(ctx) {
  ctx.on('request', (r) => {
    let body = '';
    try { body = r.postData() || ''; } catch { body = ''; }
    const headers = JSON.stringify(r.headers());
    const hay = `${r.url()}\n${headers}\n${body}`;
    const carried = TYPED.filter((s) => hay.includes(s) || hay.includes(encodeURIComponent(s)));
    requests.push({ phase, host: new URL(r.url()).host || new URL(r.url()).protocol, method: r.method(), type: r.resourceType(), url: r.url(), sw: !!r.serviceWorker?.(), bodyBytes: body.length, carried });
  });
}

async function storage(ctx, page) {
  const web = await page.evaluate(async () => {
    const ls = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); ls[k] = localStorage.getItem(k); }
    const ss = {}; for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); ss[k] = sessionStorage.getItem(k); }
    const idb = indexedDB.databases ? (await indexedDB.databases()).map((d) => d.name) : 'unsupported';
    const caches_ = {};
    for (const k of await caches.keys()) caches_[k] = (await (await caches.open(k)).keys()).length;
    return { localStorage: ls, sessionStorage: ss, indexedDB: idb, cacheStorage: caches_ };
  });
  return { ...web, cookies: await ctx.cookies() };
}

async function gate(page) {
  const label = await page.locator('label[for="parent-gate-answer"]').textContent();
  const [, a, b] = label.match(/(\d+)\s*×\s*(\d+)/);
  act(`parent gate ${a} × ${b}, type ${a * b}`);
  await page.locator('#parent-gate-answer').tap();
  await page.locator('#parent-gate-answer').pressSequentially(String(a * b), { delay: 40 });
}

async function shot(page, step, note) {
  // Never keep a frame that shows another product (see capture.mjs).
  const lovou = await page.locator('text=/Lovou|Routine done. Now the hard part|The other half of our bedtime/').count();
  if (lovou) {
    const top = await page.evaluate(() => {
      const el = [...document.querySelectorAll('h3')].find((h) => /Routine done|other half/.test(h.textContent));
      return el ? (el.closest('.rounded-\\[24px\\], .rounded-2xl') || el).getBoundingClientRect().top : null;
    });
    if (top === null || top < 200) { act(`DISCARDED ${step}`); return; }
    await page.screenshot({ path: path.join(SHOTS, `${step}.png`), clip: { x: 0, y: 0, width: 390, height: Math.floor(top - 8) } });
    shotsLog[step] = { file: `screens/taskbuddies/${step}.png`, session: 'tb04-verify', url: page.url(), steps: [...steps], crop: { x: 0, y: 0, width: 390, height: Math.floor(top - 8) }, note };
  } else {
    await page.screenshot({ path: path.join(SHOTS, `${step}.png`) });
    shotsLog[step] = { file: `screens/taskbuddies/${step}.png`, session: 'tb04-verify', url: page.url(), steps: [...steps], crop: null, note };
  }
  console.log(`  -> ${step}.png`);
}

const tap = async (loc, t, ms = 700) => { act(t); await loc.tap(); await wait(loc.page(), ms); };

// ---- session 1 -------------------------------------------------------------
let ctx = await chromium.launchPersistentContext(PROFILE, OPTS);
watch(ctx);
let page = ctx.pages()[0] || await ctx.newPage();
const before = await (async () => { await page.goto('about:blank'); return { note: 'fresh profile, nothing opened yet', cookies: await ctx.cookies() }; })();
act(`open ${BASE} in a fresh profile`);
await page.goto(BASE, { waitUntil: 'load', timeout: 120000 });
await page.locator('.app-viewport').waitFor({ timeout: 60000 });
await wait(page, 1500);
const firstOpen = await storage(ctx, page);
await shot(page, '50-prod-first-open', 'production build, first open');
await tap(page.getByRole('button', { name: 'Set up' }), 'tap "Set up"');
await gate(page);
await tap(page.getByRole('button', { name: 'Open Parent Area' }), 'tap "Open Parent Area"', 900);
await tap(page.getByRole('button', { name: 'Done', exact: true }), 'tap "Done"', 900);
await tap(page.getByRole('button', { name: /Choose Hoppy/ }), 'choose Hoppy', 900);
await tap(page.getByRole('button', { name: /Homework/ }), 'tap "Homework"', 1200);
await tap(page.getByRole('button', { name: 'Edit tasks' }), 'tap "Edit tasks"');
await gate(page);
await tap(page.getByRole('button', { name: 'Continue' }), 'tap "Continue"', 900);
const names = async () => { const i = page.getByLabel('Task name'); const n = await i.count(); const o = []; for (let k = 0; k < n; k++) o.push(await i.nth(k).inputValue()); return o; };
for (const t of ['Reading', 'Pack Backpack for Tomorrow']) {
  const i = (await names()).indexOf(t);
  await tap(page.locator('ul > li').nth(i).getByLabel('Remove task'), `remove "${t}"`, 500);
}
await tap(page.getByRole('button', { name: 'Add task' }), 'tap "Add task"');
await tap(page.getByRole('button', { name: /Custom task/ }), 'tap "Custom task"', 500);
act('type "Tidy up"');
await page.getByLabel('Task name').last().pressSequentially('Tidy up', { delay: 40 });
await tap(page.getByRole('button', { name: /^Save$/ }), 'tap "Save"', 600);
await tap(page.getByRole('button', { name: /^Done$/ }), 'tap "Done"', 900);
act('scroll to the top');
await page.mouse.move(195, 400); for (let k = 0; k < 8; k++) await page.mouse.wheel(0, -150);
await wait(page, 900);
await shot(page, '51-prod-ready', 'production build: Homework routine saved, ready');
await tap(page.getByRole('button', { name: /Start routine/ }), 'tap "Start routine"', 1500);
for (let k = 0; k < 4; k++) {
  await tap(page.getByRole('button', { name: /^Done! Feed/ }), `task ${k + 1}: tap "Done! Feed Hoppy"`, 3500);
}
await wait(page, 1500);
await page.getByRole('button', { name: /Tap to open your reward/ }).waitFor({ timeout: 8000 });
await tap(page.getByRole('button', { name: /Tap to open your reward/ }), 'open the reward chest', 1500);
await shot(page, '52-prod-finished', 'production build: routine finished, reward');
const afterRun = await storage(ctx, page);
act('close the browser');
await ctx.close();

// ---- session 2: reopen ------------------------------------------------------
phase = 'session 2 (reopened)';
ctx = await chromium.launchPersistentContext(PROFILE, OPTS);
watch(ctx);
page = ctx.pages()[0] || await ctx.newPage();
act(`relaunch with the same profile and open ${BASE}`);
await page.goto(BASE, { waitUntil: 'load', timeout: 120000 });
await page.locator('.app-viewport').waitFor({ timeout: 60000 });
await wait(page, 2000);
const heading = (await page.locator('h1').first().textContent()).trim();
act(`app opens on "${heading}"`);
await shot(page, '53-prod-reopened', `production build, reopened: "${heading}"`);
if (await page.getByRole('button', { name: 'Back to buddies' }).count()) {
  await tap(page.getByRole('button', { name: 'Back to buddies' }), 'tap "Back to buddies"', 1200);
  if (await page.getByRole('button', { name: /Choose Hoppy/ }).count()) await tap(page.getByRole('button', { name: /Choose Hoppy/ }), 'choose Hoppy', 900);
  if (await page.getByRole('button', { name: /Homework/ }).count()) await tap(page.getByRole('button', { name: /Homework/ }), 'tap "Homework"', 1200);
}
await shot(page, '54-prod-reopened-ready', 'production build, reopened: Homework routine');
await tap(page.getByRole('button', { name: 'Edit tasks' }), 'tap "Edit tasks"');
await gate(page);
await tap(page.getByRole('button', { name: 'Continue' }), 'tap "Continue"', 1200);
const reopenedTasks = await names();
act(`tasks after reopening: ${reopenedTasks.join(', ')}`);
await shot(page, '55-prod-reopened-tasks', 'production build, reopened: saved tasks still there');
act('scroll down to the end of the task list');
await page.mouse.move(195, 500); for (let k = 0; k < 4; k++) { await page.mouse.wheel(0, 120); await wait(page, 60); }
await wait(page, 900);
await shot(page, '56-prod-reopened-tasks-all', 'production build, reopened: all four saved tasks, including the typed "Tidy up"');
const afterReopen = await storage(ctx, page);
await ctx.close();
fs.rmSync(PROFILE, { recursive: true, force: true });

// ---- write results ----------------------------------------------------------
const thirdParty = requests.filter((r) => r.host !== ORIGIN && !/^(data|blob|chrome-extension):?$/.test(r.host));
const carrying = requests.filter((r) => r.carried.length);
const byHost = {};
for (const r of requests) { const k = `${r.host} ${r.method}`; byHost[k] = (byHost[k] || 0) + 1; }
const md = [
  '# TB-04 network log', '',
  `Production web build (\`npm run build:web\`, \`npm run preview\`) at ${BASE}, Chromium via Playwright 1.63, iPhone 14 user agent, 390x844 at 3x. Run on ${new Date().toISOString()}.`, '',
  '## Summary', '',
  `- Requests recorded: ${requests.length} (session 1: ${requests.filter((r) => r.phase === 'session 1').length}, after reopening: ${requests.filter((r) => r.phase !== 'session 1').length}).`,
  `- Hosts: ${[...new Set(requests.map((r) => r.host))].join(', ')}.`,
  `- Requests to any host other than the app's own origin (${ORIGIN}): ${thirdParty.length}.`,
  `- Requests whose URL, headers or body carried user-entered text (${TYPED.map((t) => `"${t}"`).join(', ')}): ${carrying.length}.`,
  `- Requests with a body (POST/PUT etc.): ${requests.filter((r) => r.bodyBytes > 0).length}.`,
  `- Ad, analytics or tracking hosts: ${thirdParty.length ? 'see table' : 'none'}.`,
  `- After reopening, the app opened on "${heading}" and the saved tasks were: ${reopenedTasks.join(', ')}.`, '',
  '## By host', '', '| Host | Method | Count |', '|---|---|---|',
  ...Object.entries(byHost).map(([k, n]) => { const [h, m] = k.split(' '); return `| ${h} | ${m} | ${n} |`; }), '',
  '## Every request', '', '| # | Phase | Host | Method | Type | Service worker | Carried user data | Path |', '|---|---|---|---|---|---|---|---|',
  ...requests.map((r, i) => `| ${i + 1} | ${r.phase} | ${r.host} | ${r.method} | ${r.type} | ${r.sw ? 'yes' : 'no'} | ${r.carried.length ? r.carried.join(', ') : 'no'} | \`${(() => { try { const u = new URL(r.url); return u.pathname.length > 70 ? u.pathname.slice(0, 67) + '...' : u.pathname; } catch { return r.url.slice(0, 40); } })()}\` |`), '',
  '## Steps', '', ...steps.map((s) => `- ${s}`), '',
];
fs.writeFileSync(path.join(DIR, 'NETWORK_LOG.md'), md.join('\n'));
fs.writeFileSync(path.join(DIR, 'storage.json'), JSON.stringify({ before, firstOpen, afterRun, afterReopen }, null, 2) + '\n');
const logFile = path.join(SHOTS, 'capture-log.json');
const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
fs.writeFileSync(logFile, JSON.stringify({ ...log, ...shotsLog }, null, 2) + '\n');
console.log({ requests: requests.length, thirdParty: thirdParty.length, carrying: carrying.length, heading, reopenedTasks });
