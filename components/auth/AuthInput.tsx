import { C } from '@/constants/batteryTheme';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
// AuthInput component with props for label, error message, and secure text entry
export default function AuthInput({
  label,
  error,
  secureTextEntry,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputRow}>
        <TextInput
          style={[
            s.input,
            error ? s.inputError : null,
            secureTextEntry ? s.inputWithIcon : null,
          ]}
          placeholderTextColor={C.muted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={hidden}
          {...props}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={s.iconButton}
            onPress={() => setHidden((prev) => !prev)}
          >
            {hidden ? (
              <EyeOff size={18} color={C.muted} />
            ) : (
              <Eye size={18} color={C.muted} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: 20, marginTop: 14 },
  label: { fontSize: 12, color: C.ink, fontWeight: '600', marginBottom: 6 },
  inputRow: { position: 'relative', justifyContent: 'center' },
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
  inputWithIcon: { paddingRight: 44 },
  inputError: { borderColor: C.red },
  iconButton: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  error: { fontSize: 11, color: C.red, marginTop: 6, fontWeight: '600' },
});
