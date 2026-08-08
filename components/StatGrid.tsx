import { C, socColor, sohColor } from '@/constants/batteryTheme';
import { BatteryReading } from '@/types/battery';
import { Battery, Gauge, HeartPulse, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  reading: BatteryReading | null;
}

export default function StatGrid({ reading }: Props) {
  if (!reading) return null;
  const items = [
    {
      icon: <Battery size={22} color={socColor(reading.soc)} />,
      value: `${reading.soc.toFixed(0)}%`,
      label: 'State of Charge',
    },
    {
      icon: <HeartPulse size={22} color={sohColor(reading.soh)} />,
      value: `${reading.soh.toFixed(0)}%`,
      label: 'State of Health',
    },
    {
      icon: <Zap size={22} color={C.amber} />,
      value: `${reading.current.toFixed(2)} A`,
      label: 'Current',
    },
    {
      icon: <Gauge size={22} color={C.blue} />,
      value: `${reading.voltage.toFixed(2)} V`,
      label: 'Voltage',
    },
  ];
  return (
    <View style={grid.wrap}>
      {items.map((item, index) => (
        <View key={index} style={grid.cell}>
          {item.icon}
          <Text style={grid.value}>{item.value}</Text>
          <Text style={grid.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const grid = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },

  cell: {
    width: '47%',
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  value: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    color: C.muted,
    textAlign: 'center',
  },
});
