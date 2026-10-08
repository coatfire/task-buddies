# TB-05 sources

## Apple app preview requirements

Checked on 2026-10-08 at <https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications> (App Store Connect Help, "App preview specifications"):

| Requirement | Apple's page | This export |
|---|---|---|
| Length | 15 to 30 seconds | 20.0 s |
| Format | H.264 or ProRes 422 HQ | H.264 (.mp4) |
| H.264 bit rate | target 10 to 12 Mbps | 11 Mbps constant |
| H.264 profile | progressive, up to High Profile Level 4.0 | High, Level 4.0, progressive |
| Frame rate | 30 fps max | 30 fps |
| Audio | stereo, 256 kbps AAC, 44.1 or 48 kHz, all tracks enabled | 1 track, 2-channel stereo AAC-LC, 48 kHz, encoded at a 256 kbps setting. The track is silent, so ffmpeg's encoder writes it at about 2 kbps; if App Store Connect objects, lay in any audio and re-encode |
| Maximum size | 500 MB | see `export/` |
| Resolution | iPhone 6.9", 6.5", 6.3", 6.1": 886 x 1920 portrait. iPhone 5.5" and 4": 1080 x 1920 portrait | `tb-05-appstore-preview_store886_886x1920.mp4`, `tb-05-appstore-preview_store1080_1080x1920.mp4` |
| Poster frame | defaults to 5 s; set in App Store Connect | one poster PNG per cut in `export/`, taken at 10.5 s (set the poster time to match when uploading) |

Status: VERIFIED against Apple's page on the night of the run.

## Product statements

The film has no on-screen words and no VO. Its pictures show:

| What is shown | Code reference | Capture |
|---|---|---|
| Removing, adding and naming tasks | `src/pages/RoutineSetup.jsx:35-61,220-247,282-290` | `video/setup-take.mp4` |
| Choosing a buddy | `src/pages/CharacterSelection.jsx:34-37` | `video/setup-take.mp4` |
| One task at a time, buddy fed when it is done | `src/pages/ActivePlayer.jsx:105-148,174-285` | `video/morning-run.mp4` |
| Routine finished, reward | `src/pages/RoutineComplete.jsx:113-232` | `22-routine-finished.png`, `24-reward.png` |

No pricing, no "free", no comparison, no other product.
