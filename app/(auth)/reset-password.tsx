import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import { C } from '@/constants/batteryTheme';
import { supabase } from '@/utils/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ResetPassword() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleReset() {
    if (!code || !newPassword) {
      setError('Enter the code and a new password');
      return;
    }
    setError('');
    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery',
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace('/(auth)/sign-in');
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <AuthHeader title="Enter reset code" subtitle={`Sent to ${email}`} />

      <AuthInput
        label="Reset Code"
        placeholder="8-digit code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />
      <AuthInput
        label="New Password"
        placeholder="••••••••"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <PasswordStrengthMeter password={newPassword} />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <AuthButton
        label="Reset Password"
        onPress={handleReset}
        loading={loading}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  error: {
    marginHorizontal: 20,
    marginTop: 12,
    fontSize: 12,
    color: C.red,
    fontWeight: '600',
    textAlign: 'center',
  },
});
