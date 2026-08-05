import { C } from '@/constants/batteryTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ConnectDeviceButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.button} onPress={onPress}>
      <Text style={s.text}>Connect Device</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    backgroundColor: C.blue,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
