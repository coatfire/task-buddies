// Render a film timeline to video, stills and a contact sheet.
// Usage:
//   node films/_pipeline/render.mjs <filmDir> video <layout> <out.mp4> [--crf N] [--store]
//   node films/_pipeline/render.mjs <filmDir> stills <layout> <outDir> <t1,t2,...>
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [filmDir, mode, layout, out, extra] = process.argv.slice(2);
const flags = process.argv.slice(2);
const timeline = JSON.parse(fs.readFileSync(path.join(filmDir, 'TIMELINE.json'), 'utf8'));

// Asset paths in TIMELINE.json are repo-relative; the stage lives in films/_pipeline.
const rel = (p) => (p && !/^(https?:|data:|file:)/.test(p) ? pathToFileURL(path.join(ROOT, p)).href : p);
for (const e of timeline.elements) {
  for (const k of ['src', 'video', 'logo', 'sheet']) if (e[k]) e[k] = rel(e[k]);
  if (e.html) e.html = e.html.replace(/src="([^"]+)"/g, (m, p) => `src="${rel(p)}"`).replace(/url\('([^']+)'\)/g, (m, p) => `url('${rel(p)}')`);
}

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
await page.goto(pathToFileURL(path.join(ROOT, 'films/_pipeline/stage.html')).href);
const { W, H } = await page.evaluate(([tl, l]) => window.setup(tl, l), [timeline, layout]);
await page.setViewportSize({ width: W, height: H });
const shoot = (type = 'jpeg') => page.locator('#stage').screenshot({ type, ...(type === 'jpeg' ? { quality: 94 } : {}) });

if (mode === 'video') {
  const fps = timeline.fps || 30;
  const n = Math.round(timeline.duration * fps);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  const crf = flags.includes('--crf') ? flags[flags.indexOf('--crf') + 1] : '17';
  const store = flags.includes('--store');
  const vArgs = store
    // Apple asks for 10 to 12 Mbps; mostly still frames undershoot a VBR target, so force constant 11 Mbps.
    ? ['-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-b:v', '11M', '-minrate', '11M', '-maxrate', '11M', '-bufsize', '11M', '-x264-params', 'nal-hrd=cbr']
    : ['-c:v', 'libx264', '-profile:v', 'high', '-crf', crf, '-preset', 'medium'];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    ...vArgs, '-pix_fmt', 'yuv420p', '-r', String(fps),
    '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart',
    path.resolve(out)], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error('ffmpeg ' + c)))));
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.renderAt(t), i / fps);
    const buf = await shoot();
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`${layout} frame ${i}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await done;
  console.log('wrote', out, `${n} frames`);
} else if (mode === 'stills') {
  fs.mkdirSync(out, { recursive: true });
  const times = extra.split(',').map(Number);
  const jpg = flags.includes('--jpg');
  for (const [i, t] of times.entries()) {
    await page.evaluate((x) => window.renderAt(x), t);
    fs.writeFileSync(path.join(out, `${String(i + 1).padStart(2, '0')}.${jpg ? 'jpg' : 'png'}`), await shoot(jpg ? 'jpeg' : 'png'));
  }
  console.log('wrote', times.length, 'stills to', out);
}
await browser.close();
