import { C } from '@/constants/batteryTheme';
import { getPasswordStrength } from '@/utils/validators';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const STRENGTH_CONFIG = {
  weak: { color: C.red, label: 'Weak', bars: 1 },
  medium: { color: C.amber, label: 'Medium', bars: 2 },
  strong: { color: C.green, label: 'Strong', bars: 3 },
};

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const { color, label, bars } = STRENGTH_CONFIG[strength];

  return (
    <View style={s.wrap}>
      <View style={s.barsRow}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[s.bar, { backgroundColor: i < bars ? color : C.faint }]}
          />
        ))}
      </View>
      <Text style={[s.label, { color }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barsRow: { flexDirection: 'row', flex: 1, gap: 4, marginRight: 8 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 11, fontWeight: '700' },
});
