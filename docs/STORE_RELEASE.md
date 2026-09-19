# Task Buddies native release guide

Task Buddies uses Capacitor 8 and bundles the Vite application into each native binary.
The web/PWA build remains available separately.

## Permanent identifiers

- Public name: **Task Buddies**
- Apple bundle identifier: `app.taskbuddies`
- Android application ID: `app.taskbuddies`
- Initial marketing version: `1.0.0`
- Minimum iOS version: 15.0
- Android minimum SDK: 24
- Android target and compile SDK: 36

Do not change the bundle identifier or application ID after publishing.

## Local commands

Use Node 22 or newer and Java 21 for Android builds.

```bash
nvm use
npm ci
npm run check
npm run cap:sync
npm run android:lint
npm run android:debug
npm run android:bundle
```

Open the generated projects with `npm run cap:open:android` or
`npm run cap:open:ios`. A macOS host with Xcode is required to validate or archive iOS.

## Codemagic setup

`codemagic.yaml` defines three manual-trigger workflows:

| Workflow | Output | Publishes to |
| --- | --- | --- |
| `native-verification` | Unsigned debug APK + unsigned iOS build | Nothing (smoke test) |
| `android-internal` | Signed AAB | Google Play **Internal testing** (as draft) |
| `ios-testflight` | Signed IPA | **TestFlight** |

### One-time configuration

Signing and publishing use **app-level environment variable groups** with the same names and
variable keys as the Lovou app, so most values can be copied across. Codemagic app-level
groups are not shared between apps; re-create them under Task Buddies → Environment variables.

1. Add this repository to Codemagic and select `codemagic.yaml`.
2. Run **native-verification** first. It needs no secrets and proves the toolchain.
3. **Apple app record** — register the explicit App ID `app.taskbuddies` in Apple Developer,
   then create a **New App** in App Store Connect using it. Note the numeric **Apple ID**
   under App Information → General Information.
4. Create these variable groups (mark anything sensitive as **Secure**):

   | Group | Variable | Source |
   | --- | --- | --- |
   | `appstore_credentials` | `APP_STORE_CONNECT_ISSUER_ID` | Copy from Lovou |
   | | `APP_STORE_CONNECT_KEY_IDENTIFIER` | Copy from Lovou |
   | | `APP_STORE_CONNECT_PRIVATE_KEY` | Copy from Lovou |
   | | `FCI_CERTIFICATE_PRIVATE_KEY` | Copy from Lovou (same Distribution cert can sign both apps) |
   | | `APP_STORE_APPLE_ID` | **New** — numeric Apple ID from step 3 |
   | `google_play_credentials` | `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` | Copy from Lovou |
   | `android_keystore` | `FCI_ANDROID_KEYSTORE_BASE64` | **New** — base64 of a fresh upload keystore (see below) |
   | | `KEYSTORE_PASSWORD` | New |
   | | `KEYSTORE_ALIAS` | New |
   | | `KEYSTORE_KEY_PASSWORD` | New |

5. **Grant the Play service account access** — Play Console → Users and permissions → the
   service account → Add app → Task Buddies → **Release manager**. Without this, uploads fail
   with a 403 even though the JSON is valid.
6. The App Store Connect API key must have the **App Manager** role (it already does if it
   uploads Lovou builds).

### Creating the upload keystore

Do not reuse Lovou's keystore — one upload key per app limits blast radius if a key leaks.

```bash
keytool -genkeypair -v \
  -keystore task-buddies-upload.jks \
  -alias taskbuddies \
  -keyalg RSA -keysize 2048 -validity 10000

# Value for FCI_ANDROID_KEYSTORE_BASE64:
base64 -w0 task-buddies-upload.jks      # macOS: base64 -i task-buddies-upload.jks
```

Store the `.jks` and its passwords in a password manager. Never commit them.

### Google Play first-upload gotcha

The Play Developer API refuses to create the *first* release of a brand-new app. Before the
`android-internal` workflow can publish, run it once, download the AAB artifact, and upload
it by hand to Internal testing in Play Console. Every build after that publishes
automatically. `submit_as_draft: true` is required until the app has had one production
release; flip it to `false` afterwards.

### Version numbers

- iOS build number: the workflow asks App Store Connect for the latest TestFlight build and
  uses `latest + 1`, falling back to Codemagic's `BUILD_NUMBER`.
- Android `versionCode`: Codemagic's `BUILD_NUMBER` (see `android/app/build.gradle`).
- Marketing version (`1.0.0`): bump together in `android/app/build.gradle`
  (`versionName`), Xcode (`MARKETING_VERSION`), and the root `package.json` for each public
  release.

## Google Play setup

1. Create the app as **Task Buddies** with default language English.
2. Enrol in Play App Signing and upload the Codemagic-generated AAB to Internal testing.
3. Complete the Data safety form using the declarations below.
4. Declare the child target audience accurately and complete Families policy questions.
5. Complete the content rating questionnaire and provide the privacy and support URLs.
6. Promote through Closed testing before production. Complete any account-specific tester
   duration requirement shown by Play Console.

## Apple setup

1. Create the App Store Connect app record for `app.taskbuddies`.
2. Configure the Kids Category or age rating according to the final intended audience.
3. Use `https://www.taskbuddies.app/privacy` as the privacy URL.
4. Use `https://www.taskbuddies.app/support` as the support URL.
5. Answer App Privacy using the declarations below.
6. Upload the IPA to TestFlight, test on physical devices, and then submit for review.

## Privacy and child-safety declarations

The current binary:

- has no account system, backend, analytics, advertising, tracking, or in-app purchases;
- stores routines, rewards, buddy choices, and timer state on the device;
- may use optional local notifications for timer completion;
- opens privacy, support, and the Lovou waitlist link only from a randomized parental gate,
  in the system browser (not the in-app WebView);
- bundles fonts and application content locally.

Apple App Privacy and Google Data safety should therefore declare no data collected or
shared, provided no SDK or product behavior is added that changes these facts. Device
platform backups may contain local app preferences under the user's Apple or Google
account settings; this is also disclosed in the privacy policy.

Re-audit the binary and update the policy and store declarations before every submission.

## Release QA

Test a clean install and an upgrade on physical iOS and Android devices:

- complete the buddy, routine setup, timer, feeding, and reward flow;
- pause, resume, skip, finish early, and cancel a timer;
- background and foreground during a timer, then force quit and reopen;
- allow and deny notification permission;
- verify offline launch and completion in airplane mode;
- verify Parent Area gating and all privacy/support links;
- verify persistence after process death and device restart;
- test small and large phones, tablets, font scaling, reduced motion, VoiceOver, and TalkBack;
- confirm no unexpected network requests or third-party SDK data transmission.

Keep screenshots and store copy synchronized with the submitted binary.
