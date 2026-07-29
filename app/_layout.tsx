import { C } from '@/constants/batteryTheme';
import { useSession } from '@/hooks/use-session';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.bg,
        }}
      >
        <ActivityIndicator color={C.blue} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
      {!session && <Redirect href="/(auth)/sign-in" />}
    </Stack>
  );
}
