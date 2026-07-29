import AuthButton from '@/components/auth/AuthButton';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import { C } from '@/constants/batteryTheme';
import { useAuth } from '@/hooks/use-auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { signUp, loading, errorMsg } = useAuth();

  async function handleSignUp() {
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError('');
    const ok = await signUp(email, password);
    if (ok) router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <AuthHeader
          title="Create account"
          subtitle="Set up your ZindaBattery account"
        />

        <AuthInput
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <AuthInput
          label="Confirm Password"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {localError || errorMsg ? (
          <Text style={s.error}>{localError || errorMsg}</Text>
        ) : null}

        <AuthButton label="Sign Up" onPress={handleSignUp} loading={loading} />

        <AuthFooterLink
          prompt="Already have an account?"
          actionLabel="Sign In"
          onPress={() => router.push('/(auth)/sign-in')}
        />
        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
