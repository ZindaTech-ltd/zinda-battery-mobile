import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCallback() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/sign-in');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Email Verified</Text>

      <Text style={styles.message}>
        Your email has been verified successfully. You can now sign in to
        ZindaBattery.
      </Text>

      <ActivityIndicator
        size="small"
        color="#2563EB"
        style={{ marginTop: 28 }}
      />

      <Text style={styles.redirect}>Redirecting to Sign In...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  check: {
    fontSize: 38,
    color: '#16A34A',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  redirect: {
    marginTop: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
});
