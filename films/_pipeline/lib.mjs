// Shared helpers for film timeline generators.
import fs from 'node:fs';
import path from 'node:path';

export const S = (step) => `screens/taskbuddies/${step}.png`;
export const V = (name) => `screens/taskbuddies/video/${name}.mp4`;
export const LOGO = 'brand/taskbuddies/logo.svg';
export const LAYOUTS = ['9x16', '4x5', '1x1'];

// House pace rule from the studio prompt: 1.5 s plus 0.3 s a word.
export const minHold = (text) => 1.5 + 0.3 * text.trim().split(/\s+/).length;

export function text(t, tin, tout, extra = {}) {
  const need = minHold(t.replace(/\n/g, ' '));
  if (tout - tin + 1e-6 < need) throw new Error(`"${t}" held ${(tout - tin).toFixed(2)}s, needs ${need.toFixed(2)}s`);
  const words = t.split(/\n/).map((l) => l.trim().split(/\s+/).length);
  if (Math.max(...words) > (extra.maxWords || 8)) throw new Error(`"${t}" has a line over ${extra.maxWords || 8} words`);
  delete extra.maxWords;
  return { kind: 'text', text: t, region: 'caption', in: tin, out: tout, enter: 'up', ...extra };
}

// Capture log written by capture.mjs: crops, recording durations and step times.
export const CAPTURES = JSON.parse(fs.readFileSync(path.resolve('screens/taskbuddies/capture-log.json'), 'utf8'));
export const stepTime = (video, re) => {
  const st = CAPTURES[`video/${video}`].steps.find((x) => re.test(x.text));
  if (!st) throw new Error(`no step ${re} in ${video}`);
  return st.t;
};
export const screen = (src, tin, tout, extra = {}) => {
  const c = CAPTURES[src];
  if (!c || c.discarded) throw new Error(`capture ${src} missing or discarded`);
  const crop = c.crop ? { mw: c.crop.width * 3, mh: c.crop.height * 3 } : {};
  return { kind: 'screen', src: S(src), region: 'screen', in: tin, out: tout, ...crop, ...extra };
};
export const clip = (name, tin, tout, extra = {}) => ({ kind: 'screen', video: V(name), region: 'screen', in: tin, out: tout, ...extra });
// A buddy stepped from its sheet. size is in stage px; the app's spriteScale is applied on top.
export const SPRITE = (id, state) => `public/buddy-watercolor/${id}-${state}.webp`;
// cx, cy: centre in stage px; mult: the buddy's spriteScale. x, y, scale stay free for animation tracks.
export const sprite = (id, state, tin, tout, { cx, cy, size, mult = 1, ...extra }) => {
  const d = size * mult;
  return { kind: 'sprite', sheet: SPRITE(id, state), region: { x: cx - d / 2, y: cy - d / 2, w: d, h: d }, in: tin, out: tout, ...extra };
};
export const endcard = (tin, tout, extra = {}) => ({ kind: 'endcard', logo: LOGO, url: 'taskbuddies.app', label: '', region: 'full', in: tin, out: tout, fadeOut: 0, ...extra });

const tc = (s, sep = '.') => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60, r = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}${sep}${String(r).padStart(3, '0')}`;
};

// On-screen words in order of appearance, taken from the timeline itself.
export const onScreenWords = (tl) => tl.elements.filter((e) => e.kind === 'text').sort((a, b) => a.in - b.in).map((e) => ({ in: e.in, out: e.out, text: e.text.replace(/\n/g, ' ') }));

// SCRIPT.md, VO.md and captions.srt from one source.
export function writeDocs(filmDir, { title, seconds, framing, beats, vo, tl, notes = [] }) {
  const words = onScreenWords(tl);
  const script = [`# ${title}: script`, '', `Length: ${seconds} s. Works with the sound off; every line below is on screen.`, '',
    `- The question: ${framing.question}`, `- The belief that turns out wrong: ${framing.belief}`, `- What is true instead: ${framing.truth}`, '',
    ...beats.flatMap((b) => [`## ${b.name} (${b.from.toFixed(1)} to ${b.to.toFixed(1)} s)`, '', b.picture, '',
      ...words.filter((w) => w.in >= b.from - 0.01 && w.in < b.to - 0.01).map((w) => `- On screen, ${w.in.toFixed(1)} to ${w.out.toFixed(1)} s: "${w.text}"`), '']),
    ...notes].join('\n');
  fs.writeFileSync(path.join(filmDir, 'SCRIPT.md'), script + '\n');

  const voMd = [`# ${title}: proposed voiceover`, '',
    'For a person to record. Nothing here is synthesised. The film works without it; the voice can sit at about -16 LUFS integrated, with any soft sound bed at least 12 dB under it.', '',
    '| In | Out | Line |', '|---|---|---|',
    ...vo.map((l) => `| ${tc(l.in)} | ${tc(l.out)} | ${l.text} |`)].join('\n');
  fs.writeFileSync(path.join(filmDir, 'VO.md'), voMd + '\n');

  // Captions carry the on-screen words, so the film reads the same with or without the proposed VO.
  const srt = words.map((l, i) => `${i + 1}\n${tc(l.in, ',')} --> ${tc(l.out, ',')}\n${l.text}\n`).join('\n');
  fs.writeFileSync(path.join(filmDir, 'captions.srt'), srt);

  // Every string the film shows or says, for the house-rules check.
  const strip = (h) => h.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, '\n').replace(/&#10003;/g, '').split('\n').map((s) => s.trim()).filter(Boolean);
  const shown = [...tl.elements].sort((a, b) => (a.in ?? 0) - (b.in ?? 0)).flatMap((e) => {
    if (e.kind === 'text') return [e.text.replace(/\n/g, ' ')];
    if (e.kind === 'html') return strip(e.html);
    if (e.kind === 'placeholder') return ['Screen not captured', e.label, e.sub].filter(Boolean);
    if (e.kind === 'endcard') return [e.url, e.label].filter(Boolean);
    return [];
  });
  const lines = [...new Set(shown)].map((s) => `ON SCREEN: ${s}`).concat(vo.map((l) => `VO: ${l.text}`));
  fs.writeFileSync(path.join(filmDir, 'STRINGS.txt'), lines.join('\n') + '\n');
}

export function writeTimeline(filmDir, tl) {
  const els = tl.elements;
  const last = Math.max(...els.map((e) => e.out ?? tl.duration));
  if (last > tl.duration + 1e-6) throw new Error('element runs past the end');
  fs.writeFileSync(path.join(filmDir, 'TIMELINE.json'), JSON.stringify(tl, null, 2) + '\n');
  console.log('wrote', path.join(filmDir, 'TIMELINE.json'), els.length, 'elements');
}

// Stage geometry, mirrored from engine.js LAYOUTS, for elements placed in stage pixels (sprites).
export const GEOM = {
  '9x16': { W: 1080, H: 1920, screenArea: { x: 0, y: 440, w: 1080, h: 1420 } },
  '4x5': { W: 1080, H: 1350, screenArea: { x: 0, y: 290, w: 1080, h: 1010 } },
  '1x1': { W: 1080, H: 1080, screenArea: { x: 560, y: 60, w: 470, h: 960 } },
  store886: { W: 886, H: 1920, full: true },
  store1080: { W: 1080, H: 1920, full: true },
};
// The screen card rect for a layout (same maths as engine.js cardRect).
export function card(layout) {
  const g = GEOM[layout];
  if (g.full) return { x: 0, y: 0, w: g.W, h: g.H };
  const a = g.screenArea, aspect = 1170 / 2532;
  let h = a.h, w = h * aspect;
  if (w > a.w) { w = a.w; h = w / aspect; }
  return { x: a.x + (a.w - w) / 2, y: a.y + (a.h - h) / 2, w, h };
}
// Build one element per layout: fn(layout, cardRect) returns an element or array of elements.
export const perLayout = (layouts, fn) => layouts.flatMap((l) => [].concat(fn(l, card(l))).map((e) => ({ ...e, layouts: [l] })));

// Brand-token frame drawn inside the screen card (cq units scale with the card).
export const frame = (inner, tin, tout, extra = {}) => ({
  kind: 'html', region: 'screen', in: tin, out: tout,
  html: `<div style="position:absolute;inset:0;border-radius:6cqw;background:#F2E6D4;border:1px solid #E0CDB4;box-shadow:0 24px 60px rgba(74,52,38,0.18);overflow:hidden">${inner}</div>`,
  ...extra,
});

// "x2" marker for sped-up stretches of a take, top right of the screen card.
export const speedTag = (label, tin, tout, extra = {}) => ({
  kind: 'html', region: 'screen', in: tin, out: tout, fadeIn: 0.2, fadeOut: 0.2,
  html: `<div style="position:absolute;right:4cqw;top:2.5cqw;padding:1.2cqw 3cqw;border-radius:99px;background:rgba(74,52,38,0.82);color:#FAF3E8;font-family:'DM Sans';font-weight:600;font-size:5cqw;letter-spacing:0.04em">${label}</div>`,
  ...extra,
});
