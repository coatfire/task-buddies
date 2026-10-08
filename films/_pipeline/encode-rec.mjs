// Conform a screencast recording (variable frame times) to constant 60 fps MP4.
// Usage: node films/_pipeline/encode-rec.mjs <recDir> <out.mp4>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const [dir, outFile] = process.argv.slice(2);
const { frames } = JSON.parse(fs.readFileSync(path.join(dir, 'frames.json'), 'utf8'));
if (!frames.length) throw new Error('no frames');
const lines = [];
for (let i = 0; i < frames.length; i++) {
  const next = frames[i + 1]?.t ?? frames[i].t + 0.5;
  lines.push(`file '${frames[i].file}'`, `duration ${Math.max(0.001, next - frames[i].t).toFixed(4)}`);
}
lines.push(`file '${frames.at(-1).file}'`);
fs.writeFileSync(path.join(dir, 'list.txt'), lines.join('\n'));
fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'list.txt',
  '-vf', 'scale=1170:2532:flags=lanczos,fps=60', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', path.resolve(outFile)], { cwd: dir });
console.log('wrote', outFile, `${frames.length} source frames, ${(frames.at(-1).t - frames[0].t).toFixed(2)}s`);
