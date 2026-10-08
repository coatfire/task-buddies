// Render every deliverable for a film.
// Usage: node films/_pipeline/deliver.mjs <filmDir> <name> --layouts 9x16,4x5,1x1 --stills 2,8,20 --poster 26 [--store] [--only video|stills]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [filmDir, name] = process.argv.slice(2);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const layouts = arg('--layouts', '9x16,4x5,1x1').split(',');
const stills = arg('--stills', '').split(',').filter(Boolean);
const posterT = arg('--poster', stills[0]);
const only = arg('--only', '');
const store = process.argv.includes('--store');
const SIZE = { '9x16': '1080x1920', '4x5': '1080x1350', '1x1': '1080x1080', store886: '886x1920', store1080: '1080x1920' };

const run = (args) => new Promise((res, rej) => {
  const p = spawn('node', [path.join(HERE, 'render.mjs'), ...args], { stdio: 'inherit' });
  p.on('close', (c) => (c === 0 ? res() : rej(new Error(args.join(' ') + ' failed'))));
});

const exportDir = path.join(filmDir, 'export');
fs.mkdirSync(exportDir, { recursive: true });

if (only !== 'stills') {
  await Promise.all(layouts.map((l) => run([filmDir, 'video', l, path.join(exportDir, `${name}_${l}_${SIZE[l]}.mp4`), ...(store ? ['--store'] : [])])));
}

if (only !== 'video') {
  // Storyboard: one 9x16 still per beat moment; carousel stills: same moments at 1080x1350.
  if (stills.length) {
    // Store previews deliver portrait cuts and posters only, so their frames go to the storyboard and there is no carousel set.
    await run([filmDir, 'stills', store ? layouts[0] : '9x16', path.join(filmDir, 'storyboard'), stills.join(','), '--jpg']);
    if (!store) await run([filmDir, 'stills', '4x5', path.join(filmDir, 'stills'), stills.join(',')]);
  }
  // Poster frame per cut.
  for (const l of layouts) {
    const tmp = path.join(filmDir, '.poster-' + l);
    await run([filmDir, 'stills', l, tmp, String(posterT)]);
    fs.renameSync(path.join(tmp, '01.png'), path.join(exportDir, `${name}_${l}_poster.png`));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  // Contact sheet from the storyboard (or stills for store cuts).
  const src = fs.existsSync(path.join(filmDir, 'storyboard')) ? path.join(filmDir, 'storyboard') : path.join(filmDir, 'stills');
  const files = fs.readdirSync(src).filter((f) => /\.(png|jpg)$/.test(f)).sort();
  const ext = path.extname(files[0]);
  const cols = Math.min(files.length, 5), rows = Math.ceil(files.length / cols);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(src, '%02d' + ext),
    '-vf', `scale=360:-1,tile=${cols}x${rows}:padding=8:margin=8:color=0x140E0A`, '-frames:v', '1', path.join(filmDir, 'contact.png')]);
  console.log('contact sheet from', files.length, 'frames');
}
