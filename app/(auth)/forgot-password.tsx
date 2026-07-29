import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import { C } from '@/constants/batteryTheme';
import { supabase } from '@/utils/supabase';
import { isValidEmail } from '@/utils/validators';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSend() {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push({ pathname: '/(auth)/reset-password', params: { email } });
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <AuthHeader
        title="Forgot password?"
        subtitle="We'll email you a reset code"
      />

      <AuthInput
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={error}
      />

      <AuthButton
        label="Send Reset Code"
        onPress={handleSend}
        loading={loading}
      />

      <Text style={s.back} onPress={() => router.back()}>
        Back to Sign In
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  back: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: C.blue,
    fontWeight: '700',
  },
});
