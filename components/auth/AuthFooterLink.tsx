import { C } from '@/constants/batteryTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// AuthFooterLink component with props for prompt, action label, and onPress handler
export default function AuthFooterLink({
  prompt,
  actionLabel,
  onPress,
}: {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <View style={s.row}>
      <Text style={s.prompt}>{prompt} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={s.action}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  prompt: { fontSize: 13, color: C.muted, fontWeight: '500' },
  action: { fontSize: 13, color: C.blue, fontWeight: '700' },
});
