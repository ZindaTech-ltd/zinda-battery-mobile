import { C } from '@/constants/batteryTheme';
import { BatteryReading, Device } from '@/types/battery';
import { formatPakistanDateTime, timeAgo } from '@/utils/date';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ZindaLogo from '../assets/images/logo.png';

interface Props {
  device: Device | null;
  latestReading: BatteryReading | null;
}

const OFFLINE_THRESHOLD_SECONDS = 90 * 60; // 1.5 hours
export default function DashboardHeader({ device, latestReading }: Props) {
  const isLive =
    latestReading &&
    Date.now() - new Date(latestReading.recorded_at).getTime() <
      OFFLINE_THRESHOLD_SECONDS * 1000;
  return (
    <View style={s.header}>
      <View style={s.headerTop}>
        <Image source={ZindaLogo} style={s.logo} resizeMode="contain" />
        <View
          style={[
            s.statusBadge,
            {
              backgroundColor: isLive ? '#E8F5E9' : '#FFF3E0',
              borderColor: isLive ? '#2E7D32' : '#EF6C00',
            },
          ]}
        >
          <View
            style={[
              s.statusDot,
              {
                backgroundColor: isLive ? '#2E7D32' : '#EF6C00',
              },
            ]}
          />
          <Text
            style={[
              s.statusText,
              {
                color: isLive ? '#2E7D32' : '#EF6C00',
              },
            ]}
          >
            {isLive ? 'LIVE' : 'OFFLINE'}
          </Text>
        </View>
      </View>
      <Text style={s.headerSub}>Battery Monitoring</Text>
      <Text style={s.updated}>
        Last Updated • {timeAgo(latestReading?.recorded_at)}
      </Text>
      <Text style={s.timestamp}>
        {formatPakistanDateTime(latestReading?.recorded_at)}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    width: 128,
    height: 32,
  },

  headerSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 12,
    fontWeight: '500',
  },

  updated: {
    marginTop: 14,
    fontSize: 13,
    color: C.blue,
    fontWeight: '700',
  },

  timestamp: {
    marginTop: 4,
    fontSize: 11,
    color: C.muted,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
