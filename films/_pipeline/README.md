# Explainer film pipeline

Real app captures, laid out by a deterministic HTML timeline, rendered frame by frame with Playwright and encoded with ffmpeg. Ported from the Lovou run and rethemed to Task Buddies.

- `capture.mjs`: drives the real app (Vite dev server, http://localhost:5173) through its UI from a fresh install. Sessions: `setup` (TB-02 continuous take), `morning` (TB-01 run and Bedtime turn), `timeout` (a 1-minute task left to run out in real time), `buddies` (TB-03). Frames out any other product's card by cropping, never by editing the page. Writes `screens/taskbuddies/*.png`, `video/*.mp4` and `capture-log.json`.
- `screencast.mjs`, `encode-rec.mjs`: record a page repaint by repaint over CDP and conform it to constant 60 fps at 1170x2532.
- `stage.html`, `engine.js`: the renderer. Every frame is a pure function of time. Element kinds: `screen` (still or video, with `rate`, `start`, `focus`, and `mw`/`mh` for cropped stills), `text`, `html`, `sprite` (frames stepped from a 4x4 buddy sheet at the app's rate, with an optional ink silhouette), `endcard`, `placeholder`. Tracks: `opacity`, `x`, `y`, `scale`, `rotY`, `innerY`, `ink`.
- `lib.mjs`: timeline helpers, the reading-pace guard (1.5 s plus 0.3 s a word; 8 words a line by default), layout geometry, and SCRIPT.md / VO.md / captions.srt / STRINGS.txt generation. `screen()` picks up crops from `capture-log.json`.
- `render.mjs`, `deliver.mjs`: render one cut, or every deliverable for a film (cuts, storyboard, 1080x1350 carousel stills, posters, `contact.png`). `--store` gives Apple's constant 11 Mbps encode.
- `report.mjs` (with `report-head.md` and `report-tail.md`): rebuilds `TB_MORNING_REPORT.md` and `screens/taskbuddies/CAPTURE_LOG.md`, and runs the house-rules search.
- `films/tb-04-what-it-doesnt-ask/verify.mjs`: the runtime check against the production build (http://localhost:4173), writing `NETWORK_LOG.md`, `storage.json` and the `5x-prod-*.png` captures.

## Commands used for this run

```
npm run dev -- --port 5173 --strictPort            # in one terminal
node films/_pipeline/capture.mjs setup morning timeout buddies

npm run build:web && npx vite preview --port 4173 --strictPort   # in another
node films/tb-04-what-it-doesnt-ask/verify.mjs

node films/tb-01-what-it-is/build.mjs
node films/_pipeline/deliver.mjs films/tb-01-what-it-is tb-01-what-it-is --layouts 9x16,4x5,1x1 --stills 2.5,5.0,7.5,10.5,12.0,14.5,16.7,17.7,18.4,19.5,22.0,25.4,27.0,29.0 --poster 7.5
node films/tb-03-buddies/build.mjs
node films/_pipeline/deliver.mjs films/tb-03-buddies tb-03-buddies --layouts 9x16,4x5,1x1 --stills 1.5,3.4,5.0,8.5,11.0,15.0,17.4,18.5,19.5 --poster 8.5
node films/tb-02-setup/build.mjs
node films/_pipeline/deliver.mjs films/tb-02-setup tb-02-setup --layouts 9x16,4x5,1x1 --stills 2.0,4.4,6.0,9.0,11.6,13.0,15.5,19.0,22.5,24.5,25.9,26.5,28.5,33 --poster 28.5
node films/tb-05-appstore-preview/build.mjs
node films/_pipeline/deliver.mjs films/tb-05-appstore-preview tb-05-appstore-preview --layouts store886,store1080 --store --stills 3.0,7.5,10.5,13.0,17.0,19.0 --poster 10.5
node films/tb-04-what-it-doesnt-ask/build.mjs
node films/_pipeline/deliver.mjs films/tb-04-what-it-doesnt-ask tb-04-what-it-doesnt-ask --layouts 9x16,4x5,1x1 --stills 2.0,3.9,5.5,9.0,13.0,15.6,16.8,17.9,20.0,22.3,24.3 --poster 9.0
node films/_pipeline/report.mjs
```

Rendering three cuts in parallel takes several minutes per film on this machine.
