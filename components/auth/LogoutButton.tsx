import { C } from '@/constants/batteryTheme';
import { supabase } from '@/utils/supabase';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function LogoutButton() {
  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  }

  return (
    <TouchableOpacity style={s.button} onPress={handleLogout}>
      <Text style={s.text}>Log Out</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.red,
  },
  text: { color: C.red, fontSize: 14, fontWeight: '700' },
});
