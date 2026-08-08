import AuthButton from '@/components/auth/AuthButton';
import { C } from '@/constants/batteryTheme';
import { ProvisionStep } from '@/hooks/use-ble-provisioning';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProvisioningStatus({
  step,
  errorMsg,
  onFinish,
}: {
  step: ProvisionStep;
  errorMsg: string;
  onFinish: () => void;
}) {
  if (step === 'done') {
    return (
      <View style={s.wrap}>
        <CheckCircle2 size={48} color={C.green} />
        <Text style={s.title}>Device Connected</Text>
        <Text style={s.subtitle}>
          Your ZindaBattery device is set up and ready.
        </Text>
        <AuthButton label="Go to Dashboard" onPress={onFinish} />
      </View>
    );
  }

  if (step === 'error') {
    return (
      <View style={s.wrap}>
        <XCircle size={48} color={C.red} />
        <Text style={s.title}>Setup Failed</Text>
        <Text style={s.subtitle}>
          {errorMsg || 'Something went wrong. Please try again.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <Loader2 size={48} color={C.blue} />
      <Text style={s.title}>
        {step === 'connecting'
          ? 'Connecting to device...'
          : 'Setting up your device...'}
      </Text>
      <Text style={s.subtitle}>This may take a few seconds.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 16, fontWeight: '800', color: C.ink, marginTop: 16 },
  subtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
});
