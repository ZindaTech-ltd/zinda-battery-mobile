import { C } from '@/constants/batteryTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LogoutButton from '../auth/LogoutButton';

export default function SendToControllerButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <>
      <TouchableOpacity style={s.button} onPress={onPress}>
        <Text style={s.text}>Set</Text>
      </TouchableOpacity>
      <LogoutButton />
    </>
  );
}

const s = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: C.blue,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
