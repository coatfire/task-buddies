// Builds screens/taskbuddies/CAPTURE_LOG.md and TB_MORNING_REPORT.md from the films' own files.
// Usage: node films/_pipeline/report.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rel = (...p) => path.join(ROOT, ...p);
const read = (...p) => (fs.existsSync(rel(...p)) ? fs.readFileSync(rel(...p), 'utf8').replace(/\r\n/g, '\n') : '');
// Drop a file's own title and demote its sections so they nest under the report's headings.
const body = (md) => md.split('\n').filter((l, i) => !(i === 0 && l.startsWith('# '))).join('\n').replace(/^## /gm, '#### ').trim();

const FILMS = [
  { dir: 'tb-01-what-it-is', title: 'TB-01 What Task Buddies is', status: 'DONE', target: 30 },
  { dir: 'tb-03-buddies', title: 'TB-03 Meet the buddies', status: 'DONE', target: 20 },
  { dir: 'tb-02-setup', title: 'TB-02 Setting up a routine', status: 'DONE', target: 35 },
  { dir: 'tb-05-appstore-preview', title: 'TB-05 App Store preview', status: 'DONE', target: 20 },
  { dir: 'tb-04-what-it-doesnt-ask', title: "TB-04 What it doesn't ask for", status: 'DONE, REVIEW: MARK', target: 25 },
];

// ---- CAPTURE_LOG.md ----------------------------------------------------------
const log = JSON.parse(read('screens/taskbuddies/capture-log.json'));
const cap = ['# Capture log', '',
  'Every capture is of the real app, driven through its UI from a fresh install by `films/_pipeline/capture.mjs` (dev server, http://localhost:5173) or `films/tb-04-what-it-doesnt-ask/verify.mjs` (production build, http://localhost:4173). Viewport 390x844 at device scale 3, `isMobile`, touch, iPhone 14 user agent, reduced motion off, light scheme. Recordings are CDP screencasts conformed to 60 fps (`encode-rec.mjs`). Nothing was seeded into the app\'s store.', '',
  '## Crops to keep another product out of frame', '',
  '| File | Clip (CSS px, x y w h) | Why |', '|---|---|---|',
  ...Object.entries(log).filter(([, v]) => v.crop).map(([k, v]) => `| \`${v.file}\` | ${v.crop.x} ${v.crop.y} ${v.crop.width} ${v.crop.height} | Lovou card below this line |`),
  '| `video/setup-take.mp4` (in TB-02 only) | reframed to the top 29% of the screen from ' + (log['video/setup-take']?.marks?.map((m) => `${m.t} s`).join(' to ') || '') + ' | Lovou card in the Parent Area |', '',
  'Discarded captures: ' + (Object.entries(log).filter(([, v]) => v.discarded).map(([k]) => k).join(', ') || 'none') + '.', '',
  '## Files', ''];
for (const [k, v] of Object.entries(log)) {
  cap.push(`### \`${v.file || k}\``, '', `- Session: ${v.session}. URL: ${v.url || ''}`,
    ...(v.note ? [`- ${v.note}`] : []),
    ...(v.crop ? [`- Cropped to ${v.crop.width}x${v.crop.height} CSS px from the top.`] : []),
    ...(v.duration ? [`- Duration ${v.duration.toFixed(2)} s, ${v.frames} source frames.`] : []));
  cap.push('- Actions to reach it:', ...(v.steps || []).map((s) => (typeof s === 'string' ? `  - ${s}` : `  - ${s.t.toFixed(2)} s: ${s.text}`)), '');
}
fs.writeFileSync(rel('screens/taskbuddies/CAPTURE_LOG.md'), cap.join('\n') + '\n');

// ---- per-film facts ----------------------------------------------------------
const dur = (f) => { try { return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()); } catch { return NaN; } };
const rows = FILMS.map((f) => {
  const exp = rel('films', f.dir, 'export');
  const cuts = fs.existsSync(exp) ? fs.readdirSync(exp).filter((x) => x.endsWith('.mp4')) : [];
  const lens = cuts.map((c) => dur(path.join(exp, c)));
  return { ...f, cuts, len: lens.length ? `${Math.min(...lens).toFixed(1)} s` : '-' };
});

// ---- house-rules self-check --------------------------------------------------
const PATTERN = "neurodivergent|adhd|autism|diagnos|therap|clinical|evidence|proven|science-backed|study|executive function|regulat|dopamine|behaviour chart|behaviour problem|nagging|lazy|defiant|meltdown|body doubl|kids' app|for children|—|!|lovou|dreamstation|fancast|bedtime buddy|instagram|tiktok";
const targets = FILMS.flatMap((f) => ['STRINGS.txt', 'VO.md', 'captions.srt'].map((x) => `films/${f.dir}/${x}`));
const grep = spawnSync('grep', ['-rniE', PATTERN, ...targets], { cwd: ROOT, encoding: 'utf8' });
const cmd = `grep -rniE "${PATTERN}" films/*/STRINGS.txt films/*/VO.md films/*/captions.srt`;
const grepOut = (grep.stdout || '') + (grep.stderr || '');

// ---- assemble -----------------------------------------------------------------
const R = ['# Task Buddies explainer films: morning report', '',
  'Branch `content/taskbuddies-explainers-v1`. Nothing has been posted; every output is a draft for review.', '',
  '| Film | Status | Length | Cuts exported |', '|---|---|---|---|',
  ...rows.map((r) => `| ${r.title} | ${r.status} | ${r.len} (target ${r.target} s) | ${r.cuts.map((c) => `\`${c}\``).join(', ')} |`), '',
  read('films/_pipeline/report-head.md').trim(), '',
  '## On-screen words and VO, per film', ''];
for (const f of FILMS) {
  const strings = read('films', f.dir, 'STRINGS.txt').trim().split('\n').filter(Boolean);
  R.push(`### ${f.title}`, '', 'On screen, in order:', '', ...(strings.some((s) => s.startsWith('ON SCREEN')) ? strings.filter((s) => s.startsWith('ON SCREEN')).map((s) => `- ${s.replace('ON SCREEN: ', '')}`) : ["- (none; the app's own screens only)"]), '',
    'Proposed VO, in order:', '', ...(strings.some((s) => s.startsWith('VO')) ? strings.filter((s) => s.startsWith('VO')).map((s) => `- ${s.replace('VO: ', '')}`) : ['- (none)']), '');
}
R.push('## Product statements and their sources', '');
for (const f of FILMS) {
  const src = read('films', f.dir, 'SOURCES.md');
  const kept = body(src).split(/\n#### Cut/)[0].trim();
  R.push(`### ${f.title}`, '', kept, '');
}
R.push('## Statements cut, and why', '');
for (const f of FILMS) {
  const src = read('films', f.dir, 'SOURCES.md');
  const cut = (src.split(/\n## Cut\n/)[1]?.trim() || 'Nothing.').replace(/^## /gm, '#### ');
  R.push(`### ${f.title}`, '', cut, '');
}
R.push('## MISSING.md, all films', '', ...FILMS.map((f) => `- ${f.title}: ${body(read('films', f.dir, 'MISSING.md')) || 'Nothing.'}`), '');
R.push('## Crops made to keep another product out of frame', '', ...cap.slice(cap.indexOf('## Crops to keep another product out of frame') + 2, cap.indexOf('## Files')), '');
R.push('## House-rules self-check', '', 'Searches every on-screen string, caption and VO line in every film for the banned words, em dashes, exclamation marks and other product names.', '', '```', `$ ${cmd}`, grepOut.trim() || '(no output)', `exit status ${grep.status} (1 means no matches)`, '```', '');
R.push(read('films/_pipeline/report-tail.md').trim(), '');
fs.writeFileSync(rel('TB_MORNING_REPORT.md'), R.join('\n') + '\n');
console.log('wrote TB_MORNING_REPORT.md and screens/taskbuddies/CAPTURE_LOG.md; self-check exit', grep.status, grepOut.trim() ? 'MATCHES:\n' + grepOut : '');
