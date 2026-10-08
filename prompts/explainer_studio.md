<!--
Studio prompt for Task Buddies, adapted from the Lovou run (prompts/explainer_studio.md in that repo).
The run brief (prompts/taskbuddies_explainers_brief.md) overrides this file wherever they disagree.
-->

# Explainer studio

You are making one short explainer film for Task Buddies. It works with the sound off.

## Inputs

- TOPIC: {{TOPIC}}
- AUDIENCE: {{AUDIENCE}}
- OUTCOME: {{OUTCOME}}
- SECONDS: {{SECONDS}}

## Method

1. Name the one question the audience is really asking, the belief they hold that turns out wrong, and what is true instead. Write these three lines down before anything else.
2. Build the film on five beats, in this order:
   - **Question**: the belief, shown in one simple image.
   - **Model**: the simple picture of what is really going on.
   - **Proof**: the real app doing the thing, on screen.
   - **Turn**: change one thing and show the app respond.
   - **Payoff**: the opening image again, now understood differently. Then the end card.
3. Rough timing: Question 15%, Model 25%, Proof 30%, Turn 20%, Payoff and end card 10%. Hold any line of on-screen text for at least 1.5 seconds plus 0.3 seconds a word (`films/_pipeline/lib.mjs` enforces this and the words-per-line limit).
4. One idea per shot. One line of text on screen at a time.

## Look

- Brand tokens, logo and sprites come from `./brand/taskbuddies/` and `public/buddy-watercolor/` only. No stock imagery, no generated illustration of people.
- Palette and type: `brand/taskbuddies/tokens.json`. Cream background, cocoa ink, peach accent. Captions in Nunito 800, small labels in DM Sans.
- Motion is simple: fades, slides and scale. Nothing spins or bounces unless the app itself does it.
- Real app captures sit full frame or in a plain rounded card. No device mock-ups unless the brief asks for them.
- Safe margins: keep text at least 80 px from the left and right edges and 120 px from the top on 9:16.

## Delivery set (per film folder)

- `SCRIPT.md`: the three framing lines, then every beat with its on-screen text.
- `TIMELINE.json`: one entry per shot with `start`, `end`, `beat`, `source` (capture file or frame), `text` and `transition`. Later cuts reuse this.
- `build.mjs`: writes `TIMELINE.json`, `SCRIPT.md`, `VO.md`, `captions.srt` and `STRINGS.txt` using `films/_pipeline/lib.mjs`.
- `storyboard/`: one 1080x1920 still per shot.
- `export/`: the film at 1080x1920 (9:16), 1080x1350 (4:5) and 1080x1080 (1:1), H.264, 30 fps, with a stereo AAC track (soft bed or silence) so a voice can be laid in.
- `poster.png` (one per cut in `export/`): one frame that stands on its own.
- `captions.srt`: built from `VO.md`, or from the on-screen words if there is no VO.

Render with `node films/<film>/build.mjs` then `node films/_pipeline/deliver.mjs films/<film> <film> --layouts 9x16,4x5,1x1 --stills <t1,t2,...> --poster <t>`.

## Verification

Before calling a film finished, check:

- It hits the OUTCOME with the sound off.
- Its length is within one second of SECONDS.
- Every product statement is backed by `APP_FACTS.md` and listed in `SOURCES.md`.
- Every frame passes the house rules in the run brief.

## Autonomy

<autonomy>
Replaced by the run brief. See "Replaces the `<autonomy>` block in the studio prompt".
</autonomy>
