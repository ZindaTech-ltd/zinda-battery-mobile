import DashboardHeader from '@/components/DashboardHeader';
import NoDeviceState from '@/components/NoDeviceState';
import { useHasDevice } from '@/hooks/use-devices';
import { useSession } from '@/hooks/use-session';
import { useBatteryData } from '@/hooks/useBatteryData';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import VoltageTrendChart from '../../components/battery/VoltageTrendChart';
import { C } from '../../constants/batteryTheme';

export default function TrendsScreen() {
  const { session } = useSession();
  const hasDevice = useHasDevice(session);
  const battery = useBatteryData();

  if (hasDevice === false) {
    return (
      <NoDeviceState message="Connect your device to view battery trends." />
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <DashboardHeader
        device={battery.device}
        latestReading={battery.latestReading}
      />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {battery.loading ? (
          <ActivityIndicator color={C.blue} style={{ marginTop: 40 }} />
        ) : (
          <VoltageTrendChart data={battery.voltageTrend} />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingTop: 10 },
});
