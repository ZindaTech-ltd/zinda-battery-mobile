import { C } from '@/constants/batteryTheme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ZindaLogo from '../../assets/images/logo.png';

export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={s.header}>
      <Image source={ZindaLogo} style={s.logo} resizeMode="contain" />
      <Text style={s.title}>{title}</Text>
      <Text style={s.subtitle}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 72, paddingBottom: 24, alignItems: 'center' },
  logo: { width: 140, height: 36, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: C.ink },
  subtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 6,
    fontWeight: '500',
  },
});
