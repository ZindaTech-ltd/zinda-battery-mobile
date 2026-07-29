import { C } from '@/constants/batteryTheme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export default function AuthInput({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, error ? s.inputError : null]}
        placeholderTextColor={C.muted}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: 20, marginTop: 14 },
  label: { fontSize: 12, color: C.ink, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: C.ink,
    borderWidth: 1,
    borderColor: C.faint,
  },
  inputError: { borderColor: C.red },
  error: { fontSize: 11, color: C.red, marginTop: 6, fontWeight: '600' },
});
