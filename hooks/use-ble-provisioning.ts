import {
  API_KEY_CHAR_UUID,
  DEVICE_ID_CHAR_UUID,
  WIFI_CREDS_CHAR_UUID,
  ZINDA_SERVICE_UUID,
} from "@/constants/bleProfile";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import base64 from "react-native-base64";
import { BleManager, Device } from "react-native-ble-plx";

export type ProvisionStep =
  | "scanning"
  | "found"
  | "connecting"
  | "wifi-form"
  | "provisioning"
  | "done"
  | "error";

async function requestBlePermissions() {
  if (Platform.OS !== "android") return true;
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);
  return Object.values(granted).every(
    (v) => v === PermissionsAndroid.RESULTS.GRANTED,
  );
}

export function useBleProvisioning() {
  const managerRef = useRef<BleManager | null>(null);
  if (!managerRef.current) managerRef.current = new BleManager();
  const manager = managerRef.current;

  const [step, setStep] = useState<ProvisionStep>("scanning");
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [esp32DeviceId, setEsp32DeviceId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    requestBlePermissions().then((ok) => {
      if (!ok || cancelled) {
        setErrorMsg("Bluetooth permission denied");
        setStep("error");
        return;
      }
      manager.startDeviceScan([ZINDA_SERVICE_UUID], null, (error, device) => {
        if (error) {
          if (!cancelled) {
            setErrorMsg(error.message);
            setStep("error");
          }
          return;
        }
        if (device && !cancelled) {
          setDevices((prev) =>
            prev.some((d) => d.id === device.id) ? prev : [...prev, device]
          );
          setStep("found");
        }
      });
    });

    return () => {
      cancelled = true;
      manager.stopDeviceScan();
    };
  }, []);

  const connectToDevice = useCallback(async (device: Device) => {
    try {
      setStep("connecting");
      manager.stopDeviceScan();

      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();

      const idChar = await connected.readCharacteristicForService(
        ZINDA_SERVICE_UUID,
        DEVICE_ID_CHAR_UUID,
      );
      const decodedId = base64.decode(idChar.value ?? "");

      setConnectedDevice(connected);
      setEsp32DeviceId(decodedId);
      setStep("wifi-form");
    } catch (err: any) {
      // clean up any half-open connection before showing the error
      try {
        await manager.cancelDeviceConnection(device.id);
      } catch {}
      setErrorMsg(err.message ?? "Failed to connect");
      setStep("error");
    }
  }, []);

  const submitWifiCredentials = useCallback(
    async (ssid: string, password: string) => {
      if (!connectedDevice || !esp32DeviceId) return;

      try {
        setStep("provisioning");

        // 1. Write WiFi credentials to ESP32
        const payload = JSON.stringify({ ssid, password });
        await connectedDevice.writeCharacteristicWithResponseForService(
          ZINDA_SERVICE_UUID,
          WIFI_CREDS_CHAR_UUID,
          base64.encode(payload),
        );

        // 2. Register device with backend, get API key back
        const { data: sessionData } = await supabase.auth.getSession();
        const { data, error } = await supabase.functions.invoke(
          "register-device",
          {
            body: { device_code: esp32DeviceId },
            headers: {
              Authorization: `Bearer ${sessionData.session?.access_token}`,
            },
          },
        );

        if (error) throw new Error(error.message);

        const deviceApiKey = data.device_api_key as string;

        // 3. Write API key back to ESP32 so it can authenticate future readings
        await connectedDevice.writeCharacteristicWithResponseForService(
          ZINDA_SERVICE_UUID,
          API_KEY_CHAR_UUID,
          base64.encode(deviceApiKey),
        );

        setStep("done");
      } catch (err: any) {
        setErrorMsg(err.message ?? "Provisioning failed");
        setStep("error");
      }
    },
    [connectedDevice, esp32DeviceId],
  );

  return { step, devices, connectToDevice, submitWifiCredentials, errorMsg };
}
