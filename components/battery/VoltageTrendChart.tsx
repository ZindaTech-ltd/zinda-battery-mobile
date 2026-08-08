import { C } from '@/constants/batteryTheme';
import { VoltageTrendPoint } from '@/types/battery';
import { TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

export default function VoltageTrendChart({
  data,
}: {
  data: VoltageTrendPoint[];
}) {
  if (data.length < 2) {
    return (
      <Text style={trend.empty}>
        Not enough readings yet to show a trend — check back soon.
      </Text>
    );
  }

  const voltages = data.map((d) => d.voltage);
  const width = 335;
  const height = 180;
  const padX = 16;
  const padY = 16;
  const min = Math.min(...voltages);
  const max = Math.max(...voltages);
  const span = max - min || 1;

  const points = voltages.map((v, i) => {
    const x = padX + (i / (voltages.length - 1)) * (width - padX * 2);
    const y = height - padY - ((v - min) / span) * (height - padY * 2);
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - padY} L ${points[0].x.toFixed(1)} ${height - padY} Z`;

  return (
    <View>
      <View style={trend.chartCard}>
        <View style={trend.chartHeader}>
          <TrendingUp size={16} color={C.blue} />
          <Text style={trend.chartTitle}>Voltage — Last 24h</Text>
        </View>
        <Svg width={width} height={height}>
          {[0.25, 0.5, 0.75].map((f, i) => (
            <Line
              key={i}
              x1={padX}
              x2={width - padX}
              y1={padY + f * (height - padY * 2)}
              y2={padY + f * (height - padY * 2)}
              stroke={C.faint}
              strokeWidth={1}
            />
          ))}
          <Path d={areaD} fill={C.blueDim} opacity={0.6} />
          <Path d={pathD} stroke={C.blue} strokeWidth={2.5} fill="none" />
          <Circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={4}
            fill={C.blue}
          />
          <SvgText
            x={points[points.length - 1].x - 34}
            y={points[points.length - 1].y - 10}
            fontSize={11}
            fontWeight="700"
            fill={C.ink}
          >
            {voltages[voltages.length - 1].toFixed(2)}V
          </SvgText>
        </Svg>
        <View style={trend.rangeRow}>
          <Text style={trend.rangeLabel}>Min {min.toFixed(2)}V</Text>
          <Text style={trend.rangeLabel}>Max {max.toFixed(2)}V</Text>
        </View>
      </View>
      <Text style={trend.note}>{data.length} readings in the last 24h</Text>
    </View>
  );
}

const trend = StyleSheet.create({
  chartCard: {
    marginHorizontal: 20,
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },
  chartTitle: { fontSize: 12, fontWeight: '700', color: C.ink },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  rangeLabel: { fontSize: 11, color: C.muted, fontWeight: '600' },
  note: {
    fontSize: 11,
    color: C.muted,
    marginHorizontal: 20,
    marginTop: 14,
    lineHeight: 16,
  },
  empty: {
    marginHorizontal: 20,
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    paddingVertical: 40,
  },
});
