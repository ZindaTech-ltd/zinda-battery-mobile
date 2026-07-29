# ZindaBattery Mobile App

React Native (Expo) mobile app for the ZindaBattery IoT lead-acid battery monitoring system. This app connects to an ESP32-based battery monitor via Bluetooth Low Energy (BLE) for WiFi provisioning, and displays live battery telemetry, history, and trends.

> **Note:** This README currently covers the React Native / Expo setup only. Backend (Supabase) documentation will be added once that integration is built.

---

## Tech Stack

- **React Native** — cross-platform mobile framework (JS/React)
- **Expo** — toolchain on top of React Native (managed build system, native modules, EAS Build)
- **Expo Router** — file-based navigation
- **TypeScript**

---

## Why Expo (and not bare React Native)

Expo gives us:
- A managed build system (`app.json`, EAS Build) so we don't touch native Android/iOS code directly for most features
- Pre-built modules for common native features (notifications, camera, etc.)
- EAS Build — a cloud build service, so we can produce installable app builds without a local Mac (needed for iOS)

---

## Expo Go vs. Expo Dev Build

Expo has two ways to run the app during development:

| | Expo Go | Expo Dev Build |
|---|---|---|
| What it is | Pre-built app from the app store | Custom-built version of this specific app |
| Native modules | Only Expo Go's fixed built-in set | Any native module we add |
| Setup | Instant, no build needed | Needs a build (once per new native module) |
| Hot reload | Yes | Yes |

**This project uses Expo Go for now.** The current app (dashboard UI, Supabase integration once added) does not require any native module outside Expo Go's built-in set.

**This will change when Bluetooth is added.** BLE requires a native module (e.g. `react-native-ble-plx`), which Expo Go does not support. At that point, the project must move to an **Expo Dev Build**. This is expected, not a mistake if it happens — it's a planned step once BLE/WiFi provisioning work begins.

### Migrating to Dev Build (when needed)

```bash
npx expo install expo-dev-client
# for cloud builds:
eas build --profile development --platform android
# or, for local builds:
npx expo run:android
```

After this, run `npx expo start` as usual — it will open in the custom dev build app instead of Expo Go. No changes to existing screens/components are required for this migration; it only affects how the app is launched during development.

- **Android:** Dev builds install directly over USB or the same WiFi network, no extra registration.
- **iOS:** Requires a Mac + Xcode, or EAS Build's cloud service (since no local Mac is available). Also requires a paid Apple Developer account, and every test iPhone must be registered by device ID before its first build — do this early, not close to a deadline.

---

## New Architecture

`newArchEnabled: true` is already set in `app.json`. This enables React Native's New Architecture (JSI), which removes the old async JS-native bridge. This matters directly for BLE: not all BLE libraries support the New Architecture yet, so **check compatibility before adding any BLE library**.

---

## Project Structure & Navigation (Expo Router)

This project uses **Expo Router** — file-based routing, similar to Next.js. Routes are defined by the file structure inside `app/`, not by a manually configured navigator.
