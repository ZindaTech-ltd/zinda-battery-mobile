import ConnectDeviceButton from '@/components/ConnectDeviceButton';
import { C } from '@/constants/batteryTheme';
import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function NoDeviceState({ message }: { message?: string }) {
  return (
    <View style={s.wrap}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <Text style={s.title}>No Device Connected</Text>
      <Text style={s.subtitle}>
        {message || 'Connect your ZindaBattery monitor to see this data.'}
      </Text>
      <ConnectDeviceButton
        onPress={() => router.push('/(setup)/provision' as any)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '800', color: C.ink, textAlign: 'center' },
  subtitle: {
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});
