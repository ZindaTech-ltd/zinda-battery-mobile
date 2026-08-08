import { C } from '@/constants/batteryTheme';
import { VoltageHistoryItem } from '@/types/battery';
import { formatHistoryLabel } from '@/utils/format-date';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VoltageHistoryList({
  history,
}: {
  history: VoltageHistoryItem[];
}) {
  // if there are no readings yet, show a message of no readings
  if (history.length === 0) {
    return (
      <Text style={hist.empty}>
        No readings yet — check back after your device sends data.
      </Text>
    );
  }
  // find the global min and max voltage across all days to scale the bar charts
  const globalMin = Math.min(...history.map((h) => h.min));
  const globalMax = Math.max(...history.map((h) => h.max));
  const span = globalMax - globalMin || 1;

  return (
    <View>
      <Text style={hist.sectionTitle}>
        Voltage Range · Last {history.length} Day{history.length > 1 ? 's' : ''}
      </Text>
      <View style={hist.list}>
        {history.map((h, i) => {
          const lowPct = ((h.min - globalMin) / span) * 100;
          const highPct = ((h.max - globalMin) / span) * 100;
          return (
            <View key={i} style={hist.row}>
              <Text style={hist.day}>{formatHistoryLabel(h.date)}</Text>
              <View style={hist.track}>
                <View
                  style={[
                    hist.bar,
                    {
                      left: `${lowPct}%`,
                      width: `${Math.max(highPct - lowPct, 4)}%`,
                      backgroundColor: h.flag ? C.red : C.blue,
                    },
                  ]}
                />
              </View>
              <View style={hist.rangeLabels}>
                <Text style={[hist.rangeText, h.flag && { color: C.red }]}>
                  {h.min.toFixed(2)}V – {h.max.toFixed(2)}V
                </Text>
                {h.flag && <Text style={hist.flagText}>⚠ Low dip</Text>}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const hist = StyleSheet.create({
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.muted,
    marginHorizontal: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  list: { marginHorizontal: 20, gap: 14 },
  row: { backgroundColor: C.surface, borderRadius: 14, padding: 14 },
  day: { fontSize: 12, fontWeight: '700', color: C.ink, marginBottom: 8 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.faint,
    overflow: 'hidden',
  },
  bar: { position: 'absolute', top: 0, bottom: 0, borderRadius: 4 },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeText: { fontSize: 11, color: C.muted, fontWeight: '600' },
  flagText: { fontSize: 11, color: C.red, fontWeight: '700' },
  empty: {
    marginHorizontal: 20,
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    paddingVertical: 40,
  },
});
