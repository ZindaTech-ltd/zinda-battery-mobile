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

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { signUp, loading, errorMsg } = useAuth();
  // Clear the error message after 2 seconds
  useEffect(() => {
    if (!localError) return;
    const timer = setTimeout(() => setLocalError(''), 2000);
    return () => clearTimeout(timer);
  }, [localError]);
  // sign up handler
  async function handleSignUp() {
    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError('');
    const ok = await signUp(email, password);
    if (ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <View style={s.root}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <AuthHeader
          title="Check your email"
          subtitle="Verify your account to continue"
        />
        <Text style={s.confirmText}>
          We sent a verification link to {'\n'}
          <Text style={s.confirmEmail}>{email}</Text>
          {'\n\n'}Verify your email, then sign in below.
        </Text>
        <AuthButton
          label="Go to Sign In"
          onPress={() => router.replace('/(auth)/sign-in')}
        />
      </View>
    );
  }
  // jsx
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
  confirmText: {
    marginHorizontal: 20,
    marginTop: 8,
    fontSize: 13,
    color: C.muted,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmEmail: { color: C.ink, fontWeight: '700' },
});
