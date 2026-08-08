import { C } from '@/constants/batteryTheme';
import { BatteryReading } from '@/types/battery';
import { formatPakistanDateTime, timeAgo } from '@/utils/date';
import { Gauge } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  reading: BatteryReading | null;
}

export default function InfoStrip({ reading }: Props) {
  if (!reading) return null;
  return (
    <View style={info.card}>
      <View style={info.iconWrap}>
        <Gauge size={20} color={C.blue} />
      </View>
      <View style={info.content}>
        <Text style={info.value}>
          {reading.voltage.toFixed(2)}
          <Text style={info.unit}> V</Text>
        </Text>
        <Text style={info.title}>Live Battery Voltage</Text>

        <Text style={info.updated}>Updated {timeAgo(reading.recorded_at)}</Text>
      </View>
      <View style={info.right}>
        <View
          style={[
            info.statusBadge,
            {
              backgroundColor: reading.engine_on ? '#E8F5E9' : '#FFF3E0',
            },
          ]}
        >
          <Text
            style={[
              info.statusText,
              {
                color: reading.engine_on ? '#2E7D32' : '#EF6C00',
              },
            ]}
          >
            {reading.engine_on ? 'Charging' : 'Engine Off'}
          </Text>
        </View>
        <Text style={info.timestamp}>
          {formatPakistanDateTime(reading.recorded_at)}
        </Text>
      </View>
    </View>
  );
}

const info = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.blueDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  value: {
    fontSize: 24,
    fontWeight: '800',
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },

  unit: {
    fontSize: 14,
    color: C.muted,
    fontWeight: '700',
  },

  title: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
  },

  updated: {
    marginTop: 6,
    fontSize: 11,
    color: C.blue,
    fontWeight: '600',
  },

  right: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  timestamp: {
    fontSize: 10,
    color: C.muted,
    textAlign: 'right',
    maxWidth: 90,
  },
});
