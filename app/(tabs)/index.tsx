import AlertBanner from '@/components/AlertBanner';
import DashboardHeader from '@/components/DashboardHeader';
import FlowDiagram from '@/components/FlowDiagram';
import InfoStrip from '@/components/InfoStrip';
import NoDeviceState from '@/components/NoDeviceState';
import StatGrid from '@/components/StatGrid';
import { C } from '@/constants/batteryTheme';
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

export default function LiveMonitor() {
  const { session } = useSession();
  const hasDevice = useHasDevice(session);
  const battery = useBatteryData();
  if (hasDevice === false) {
    return (
      <NoDeviceState message="Connect your ZindaBattery monitor to start seeing live data." />
    );
  }

  if (battery.loading) {
    return (
      <View
        style={[
          s.root,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color={C.blue} />
      </View>
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
        <FlowDiagram reading={battery.latestReading} />
        <InfoStrip reading={battery.latestReading} />
        <StatGrid reading={battery.latestReading} />
        <AlertBanner reading={battery.latestReading} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  scroll: {
    paddingTop: 10,
  },
});
