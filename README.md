# ZindaBattery Mobile App

React Native (Expo) mobile app for the ZindaBattery IoT lead-acid battery monitoring system. This app connects to an ESP32-based battery monitor via Bluetooth Low Energy (BLE) for WiFi provisioning, and displays live battery telemetry, history, and trends. Backend/data layer is powered by Supabase.

---

## Tech Stack

- **React Native** — cross-platform mobile framework (JS/React)
- **Expo** — toolchain on top of React Native (managed build system, native modules, EAS Build)
- **Expo Router** — file-based navigation
- **Supabase** — backend (Postgres database, Realtime, auth)
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

**This project uses Expo Go for now.** Supabase (`@supabase/supabase-js`) is pure JS/HTTPS and does not require a native module, so it works fine in Expo Go.

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
```text
app/
├── _layout.tsx              # Root layout (wraps the whole app)
├── modal.tsx                # Modal screen
└── (tabs)/
    ├── _layout.tsx          # Tab bar configuration (icons, labels, order)
    ├── index.tsx            # Live Monitor tab (default route)
    ├── history.tsx          # History tab
    ├── trends.tsx           # Trends tab
    └── settings.tsx         # Settings tab
```
Key conventions:
- A folder in parentheses, e.g. `(tabs)`, is a **route group** — it organizes routes without adding a segment to the URL/path.
- `_layout.tsx` files define shared UI/navigation structure for everything inside that folder (e.g. the tab bar in `(tabs)/_layout.tsx`).
- `index.tsx` is the default screen for its folder.
- Adding a new screen = adding a new file under `app/`. No manual route registration needed.

---

## Backend (Supabase)

The app uses **Supabase** as its backend (Postgres, Authentication, and Realtime).

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_KEY=your-anon-public-key
```

Replace the placeholders with your project's **URL** and **Anon Public Key** from the **Supabase Dashboard → Connect**.


   > Any env var read in app code **must** be prefixed with `EXPO_PUBLIC_`, or Expo will not expose it to the JS bundle.

3. After adding or changing `.env`, restart the dev server with cache cleared — a normal reload does **not** re-read `.env`:
```bash
   npx expo start -c
```

### Client

The Supabase client is set up once in `utils/supabase.ts` and imported wherever data access is needed:
```ts
import { supabase } from '@/utils/supabase';
```

### Where backend logic lives

Supabase doesn't have traditional backend route files. Logic is placed depending on what it does:

| Type of logic | Where it lives |
|---|---|
| Simple derived values (e.g. SOC from voltage) | Postgres function / generated column |
| Reacting to new sensor data (e.g. alerts) | Database trigger |
| Pre-aggregated data for charts (e.g. daily min/max) | Postgres view |
| Multi-step logic, external calls | Supabase Edge Function (Deno/TypeScript) |

The React Native app itself should not perform real calculations — it reads already-computed data from Supabase and renders it.

### Verifying the connection

A quick way to confirm the app is actually talking to Supabase (not just that the client initialized):
```ts
supabase.from('any_table_name').select('*').limit(1).then(({ data, error }) => {
  console.log(error ? error.message : data);
});
```
An error like `relation "any_table_name" does not exist` means the connection **is working** — the request reached Supabase and Postgres responded. `Invalid API key` or `Network request failed` mean something is actually broken (bad key or bad URL respectively).

---

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) to run it on a real device, or press `a` / `i` in the terminal for an emulator/simulator.

---
