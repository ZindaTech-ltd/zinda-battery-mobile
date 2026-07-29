import { C } from '@/constants/batteryTheme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
// AuthButton component with props for label, onPress handler, loading state, and disabled state
export default function AuthButton({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[s.button, disabled || loading ? s.buttonDisabled : null]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={s.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: C.blue,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
