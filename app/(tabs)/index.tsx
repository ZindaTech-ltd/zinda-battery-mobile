import AlertBanner from '@/components/AlertBanner';
import DashboardHeader from '@/components/DashboardHeader';
import FlowDiagram from '@/components/FlowDiagram';
import InfoStrip from '@/components/InfoStrip';
import NoDeviceState from '@/components/NoDeviceState';
import StatGrid from '@/components/StatGrid';
import { C } from '@/constants/batteryTheme';
import { useHasDevice } from '@/hooks/use-devices';
import { useSession } from '@/hooks/use-session';
import { supabase } from '@/utils/supabase';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

export default function LiveMonitor() {
  const { session } = useSession();
  const hasDevice = useHasDevice(session);

  if (hasDevice === false) {
    return (
      <NoDeviceState message="Connect your ZindaBattery monitor to start seeing live data." />
    );
  }
  supabase.auth
    .getSession()
    .then(({ data }) => console.log('TOKEN:', data.session?.access_token));
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <DashboardHeader />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <FlowDiagram />
        <InfoStrip />
        <StatGrid />
        <AlertBanner />
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingTop: 10 },
});
