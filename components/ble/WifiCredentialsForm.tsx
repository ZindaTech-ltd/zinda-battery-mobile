import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import { C } from '@/constants/batteryTheme';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WifiCredentialsForm({
  onSubmit,
}: {
  onSubmit: (ssid: string, password: string) => void;
}) {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!ssid || !password) {
      setError('Enter both WiFi name and password');
      return;
    }
    setError('');
    onSubmit(ssid, password);
  }

  return (
    <View style={s.wrap}>
      <Text style={s.heading}>Connect to WiFi</Text>
      <AuthInput
        label="WiFi Network Name"
        placeholder="Home WiFi"
        value={ssid}
        onChangeText={setSsid}
      />
      <AuthInput
        label="WiFi Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
      <AuthButton label="Send to Device" onPress={handleSubmit} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: 24 },
  heading: {
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 4,
  },
  error: {
    marginHorizontal: 20,
    marginTop: 12,
    fontSize: 12,
    color: C.red,
    fontWeight: '600',
    textAlign: 'center',
  },
});
