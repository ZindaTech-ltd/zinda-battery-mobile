import AuthButton from '@/components/auth/AuthButton';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import { C } from '@/constants/batteryTheme';
import { useAuth } from '@/hooks/use-auth';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { signIn, loading, errorMsg } = useAuth();
  // Clear the error message after 2 seconds
  useEffect(() => {
    if (!localError) return;
    const timer = setTimeout(() => setLocalError(''), 2000);
    return () => clearTimeout(timer);
  }, [localError]);

  async function handleSignIn() {
    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }
    const ok = await signIn(email, password);
    if (ok) router.replace('/(tabs)');
  }
  // jsx
  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <AuthHeader title="Welcome back" subtitle="Sign in to ZindaBattery" />

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
        <Text
          style={s.forgotPassword}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          Forgot Password?
        </Text>

        {localError || errorMsg ? (
          <Text style={s.error}>{localError || errorMsg}</Text>
        ) : null}

        <AuthButton label="Sign In" onPress={handleSignIn} loading={loading} />

        <AuthFooterLink
          prompt="Don't have an account?"
          actionLabel="Sign Up"
          onPress={() => router.push('/(auth)/sign-up')}
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 8,
    marginBottom: 16,
    color: 'blue',
    fontWeight: '600',
  },
});
