// BLE Service UUID — the "address" the app scans for to discover a ZindaBattery
// device nearby. Identical on every unit ever shipped; not device-specific data,
// just a protocol label so the app doesn't connect to unrelated BLE devices.
export const ZINDA_SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";

// ESP32 → app (read).
// This is how the app learns the device's identity. The ESP32 exposes its unique
// hardware MAC address here. The app reads this FIRST during setup and uses the
// value as `device_code` when calling the register-device edge function — this is
// what identifies/recognizes the physical unit in the `devices` table.
export const DEVICE_ID_CHAR_UUID = "12345678-1234-1234-1234-123456789ab1";

// app → ESP32 (write).
// App writes { ssid, password } here so the ESP32 can join WiFi. Not related to
// device identity/registration — purely network provisioning.
export const WIFI_CREDS_CHAR_UUID = "12345678-1234-1234-1234-123456789ab2";

// app → ESP32 (write).
// After the app calls register-device (sending the MAC read from
// DEVICE_ID_CHAR_UUID) and gets back { device_id, device_api_key } from Supabase,
// it writes device_api_key here. The ESP32 stores this in flash and includes it
// on every future reading POST — this is what the ingest-reading edge function
// checks against the `devices` table to authenticate the device. Without a valid
// key here, the ESP32 can connect to WiFi but every reading it sends gets
// rejected with 401 Unauthorized.
export const API_KEY_CHAR_UUID = "12345678-1234-1234-1234-123456789ab3";

// ESP32 → app (notify).
// One-way status push so the app doesn't have to poll: "wifi_connected",
// "wifi_error", "provisioned", etc. No identity or auth data — just UI feedback
// during the setup flow.
export const STATUS_CHAR_UUID = "12345678-1234-1234-1234-123456789ab4";
