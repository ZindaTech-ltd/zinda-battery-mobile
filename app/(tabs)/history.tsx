import DashboardHeader from '@/components/DashboardHeader';
import NoDeviceState from '@/components/NoDeviceState';
import { useHasDevice } from '@/hooks/use-devices';
import { useSession } from '@/hooks/use-session';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import VoltageHistoryList from '../../components/battery/VoltageHistoryList';
import { C } from '../../constants/batteryTheme';

export default function HistoryScreen() {
  const { session } = useSession();
  const hasDevice = useHasDevice(session);
  if (hasDevice === false) {
    return (
      <NoDeviceState message="Connect your device to view battery history." />
    );
  }
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <DashboardHeader />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <VoltageHistoryList />
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingTop: 10 },
});
