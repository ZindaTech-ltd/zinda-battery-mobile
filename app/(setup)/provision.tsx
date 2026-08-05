import BleScanList from '@/components/ble/BleScanList';
import ProvisioningStatus from '@/components/ble/ProvisioningStatus';
import WifiCredentialsForm from '@/components/ble/WifiCredentialsForm';
import { C } from '@/constants/batteryTheme';
import { useBleProvisioning } from '@/hooks/use-ble-provisioning';
import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ProvisionScreen() {
  const {
    //current step in the provisioning process: 'scanning', 'found', 'wifi-form', 'connecting', 'provisioning', 'done', or 'error'
    step,
    devices,
    connectToDevice,
    submitWifiCredentials,
    errorMsg,
  } = useBleProvisioning();

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <Text style={s.title}>Connect Your Device</Text>
      <Text style={s.subtitle}>
        Set up your ZindaBattery monitor over Bluetooth
      </Text>

      {step === 'scanning' || step === 'found' ? (
        <BleScanList devices={devices} onSelect={connectToDevice} />
      ) : null}

      {step === 'wifi-form' ? (
        <WifiCredentialsForm onSubmit={submitWifiCredentials} />
      ) : null}

      {step === 'connecting' ||
      step === 'provisioning' ||
      step === 'done' ||
      step === 'error' ? (
        <ProvisioningStatus
          step={step}
          errorMsg={errorMsg}
          onFinish={() => router.replace('/(tabs)')}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: 72 },
  title: { fontSize: 20, fontWeight: '800', color: C.ink, textAlign: 'center' },
  subtitle: {
    fontSize: 12,
    color: C.muted,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
});
