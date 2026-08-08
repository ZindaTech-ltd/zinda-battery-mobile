import { C, socColor } from '@/constants/batteryTheme';
import { BatteryReading } from '@/types/battery';
import { Battery, Cog, Lightbulb } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  reading: BatteryReading | null;
}

function FlowDot({ active, color }: { active: boolean; color: string }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || trackWidth === 0) return;
    anim.setValue(0);
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [active, trackWidth]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(trackWidth - 6, 0)],
  });

  const onLayout = (e: LayoutChangeEvent) =>
    setTrackWidth(e.nativeEvent.layout.width);

  return (
    <View style={flow.connector} onLayout={onLayout}>
      <View style={flow.dashRow}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View
            key={i}
            style={[
              flow.dash,
              {
                backgroundColor: active ? color + '66' : C.faint,
              },
            ]}
          />
        ))}
      </View>
      {active && trackWidth > 0 && (
        <Animated.View
          style={[
            flow.movingDot,
            {
              backgroundColor: color,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
}

function FlowNode({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={flow.node}>
      <View
        style={[
          flow.iconRing,
          {
            borderColor: color,
          },
        ]}
      >
        {icon}
      </View>
      <Text style={flow.value}>{value}</Text>
      <Text style={flow.label}>{label}</Text>
    </View>
  );
}

export default function FlowDiagram({ reading }: Props) {
  if (!reading) return null;
  const running = reading.engine_on;
  return (
    <View style={flow.card}>
      <View style={flow.row}>
        <FlowNode
          icon={<Cog size={18} color={running ? C.blue : C.muted} />}
          label="ENGINE"
          value={running ? 'Running' : 'Off'}
          color={running ? C.blue : C.faint}
        />
        <FlowDot active={running} color={C.blue} />
        <FlowNode
          icon={<Battery size={18} color={socColor(reading.soc)} />}
          label="BATTERY"
          value={`${reading.soc}%`}
          color={socColor(reading.soc)}
        />
        <FlowDot active={true} color={C.amber} />
        <FlowNode
          icon={<Lightbulb size={18} color={C.amber} />}
          label="LOAD"
          value={`${reading.power.toFixed(0)} W`}
          color={C.amber}
        />
      </View>
      <Text style={flow.caption}>
        {running
          ? 'Alternator charging the battery while onboard electronics draw power'
          : 'Engine off — battery powers connected loads'}
      </Text>
    </View>
  );
}

const flow = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    backgroundColor: C.surface,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 14,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  node: { flex: 1, alignItems: 'center' },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: C.muted,
    fontWeight: '700',
    marginTop: 3,
  },
  connector: {
    flex: 0.7,
    height: 44,
    justifyContent: 'center',
    marginTop: 14,
  },
  dashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dash: {
    width: 4,
    height: 2,
    borderRadius: 1,
  },
  movingDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: -2,
  },
  caption: {
    fontSize: 11,
    color: C.muted,
    textAlign: 'center',
    marginTop: 18,
  },
});
