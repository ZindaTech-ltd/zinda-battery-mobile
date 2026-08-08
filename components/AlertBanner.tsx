import { C } from '@/constants/batteryTheme';
import { BatteryReading } from '@/types/battery';
import { formatPakistanTime } from '@/utils/date';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  reading: BatteryReading | null;
}

export default function AlertBanner({ reading }: Props) {
  if (!reading) return null;
  let message: string | null = null;
  if (reading.voltage < 11.8) {
    message = `Low battery voltage (${reading.voltage.toFixed(
      2,
    )} V) detected at ${formatPakistanTime(reading.recorded_at)}`;
  } else if (reading.soc < 20) {
    message = `Battery charge is critically low (${reading.soc.toFixed(0)}%)`;
  } else if (reading.soh < 60) {
    message = `Battery health has degraded (${reading.soh.toFixed(
      0,
    )}% SOH). Consider servicing or replacement.`;
  }
  if (!message) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: C.amberBg,
    borderRadius: 12,
    padding: 14,
  },

  text: {
    color: C.amber,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});
