// Screencast recorder for a Playwright page: every repaint is saved with its timestamp,
// then conformed to constant 60 fps by encode-rec.mjs.
// Usage:
//   const rec = await startRec(context, page, 'screens/taskbuddies/rec/morning-run');
//   ...drive the app...
//   await stopRec(rec);
//   node films/_pipeline/encode-rec.mjs screens/taskbuddies/rec/morning-run screens/taskbuddies/video/morning-run.mp4
import fs from 'node:fs';
import path from 'node:path';

export async function startRec(context, page, dir) {
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await context.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = path.join(dir, `${String(frames.length).padStart(5, '0')}.jpg`);
    frames.push({ file: path.basename(file), t: metadata.timestamp });
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: 1170, maxHeight: 2532, everyNthFrame: 1 });
  return { cdp, frames, dir };
}

export async function stopRec(rec) {
  await rec.cdp.send('Page.stopScreencast');
  await new Promise((r) => setTimeout(r, 300));
  fs.writeFileSync(path.join(rec.dir, 'frames.json'), JSON.stringify({ frames: rec.frames, end: Date.now() / 1000 }));
  await rec.cdp.detach();
  return rec.frames.length;
}
