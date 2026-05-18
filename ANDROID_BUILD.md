# Totonou → Google Play Store (Capacitor Android Build)

This guide takes the Lovable web app and produces a **signed AAB** ready to upload
to Google Play Console. Everything from step 2 onward must run on **your local
machine** (Lovable's sandbox can't run the Android SDK).

> Bundle ID: `com.transentinel.totonou` — change in `capacitor.config.ts` if you
> already own a different one. It must be unique on Play Console.

---

## 1. Prerequisites (one time)

| Tool | Why | Install |
|------|-----|---------|
| Node.js 20+ & Bun | Build the web app | https://bun.sh |
| Android Studio (latest) | SDK + Gradle + emulator | https://developer.android.com/studio |
| Java JDK 17 | Required by AGP 8+ | Bundled with Android Studio |
| Google Play Console account | Submit the app | $25 one-time, https://play.google.com/console |

After installing Android Studio, open **SDK Manager** and install:
- Android SDK Platform 34 (or latest)
- Android SDK Build-Tools
- Android SDK Command-line Tools

Set env vars (`~/.zshrc` or `~/.bashrc`):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"   # macOS default
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"
```

---

## 2. Pull the project locally

Use Lovable's **GitHub → Export** or clone your connected repo, then:

```bash
bun install
bun add -d @capacitor/cli
bun add @capacitor/core @capacitor/android
```

---

## 3. Build the web bundle

```bash
bun run build
```

This produces `.output/public` — the static assets Capacitor will package.

> If you later add Lovable Cloud / server functions, those run on a server, not
> on-device. For a fully offline Capacitor app keep logic client-side, or point
> the app at your deployed Lovable URL.

---

## 4. Add the Android platform (one time)

```bash
bunx cap add android
bunx cap sync android
```

This creates the `android/` Gradle project.

After any web change, re-run:

```bash
bun run build && bunx cap sync android
```

---

## 5. App icon & splash (recommended)

Place a 1024×1024 PNG at `resources/icon.png` and a 2732×2732 PNG at
`resources/splash.png`, then:

```bash
bun add -d @capacitor/assets
bunx capacitor-assets generate --android
```

---

## 6. Generate an upload keystore (one time)

**Keep this file and password forever** — losing it means you can never update
the app on Play.

```bash
keytool -genkey -v \
  -keystore ~/keystores/totonou-upload.jks \
  -alias totonou \
  -keyalg RSA -keysize 2048 -validity 10000
```

Create `android/keystore.properties` (git-ignored):

```properties
storeFile=/Users/you/keystores/totonou-upload.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=totonou
keyPassword=YOUR_KEY_PASSWORD
```

Edit `android/app/build.gradle` and add **before** the `android {` block:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside `android { ... }` add:

```gradle
signingConfigs {
    release {
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

Also bump version in `android/app/build.gradle` for every Play upload:

```gradle
defaultConfig {
    applicationId "com.transentinel.totonou"
    versionCode 1        // integer, must increase each upload
    versionName "1.0.0"  // human-readable
    minSdkVersion 23
    targetSdkVersion 34
}
```

---

## 7. Build the signed AAB

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Verify it's signed:

```bash
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab
```

---

## 8. Test on a real device first

```bash
cd ..
bunx cap run android      # picks emulator or connected device
```

Smoke-test login → alerts queue → case email → send.

---

## 9. Upload to Google Play Console

1. https://play.google.com/console → **Create app**
2. Fill in app details, content rating, data safety, target audience.
3. **Production → Create new release** → upload `app-release.aab`.
4. Provide screenshots (min 2, 16:9 or 9:16), feature graphic (1024×500), short
   + full description, privacy policy URL.
5. Submit for review — first review typically takes 1–7 days.

### Required assets checklist
- [ ] App icon 512×512 PNG
- [ ] Feature graphic 1024×500 PNG/JPG
- [ ] 2+ phone screenshots (min 320px, max 3840px)
- [ ] Short description (≤80 chars)
- [ ] Full description (≤4000 chars)
- [ ] Privacy policy URL (mandatory for finance/compliance apps)
- [ ] Data safety form completed

---

## Updating the app later

```bash
# 1. Make changes in Lovable, pull to local
# 2. Bump versionCode + versionName in android/app/build.gradle
bun run build
bunx cap sync android
cd android && ./gradlew bundleRelease
# 3. Upload new AAB to Play Console → Production → Create new release
```

---

## Common pitfalls

- **Blank screen on device** → `webDir` in `capacitor.config.ts` doesn't match
  your actual build output. Run `ls .output/public` and confirm `index.html` exists.
- **"App not installed"** when sideloading → `versionCode` didn't increase, or
  the keystore changed.
- **Play rejects AAB** → likely `targetSdkVersion` too low. Keep it on the
  current Play requirement (34+ in 2026).
- **Compliance app review** → Google scrutinizes finance/KYC apps. Provide a
  clear privacy policy, declare data collection accurately, and be ready to
  prove HKMA registration if you claim it.
