import AlertBanner from '@/components/AlertBanner';
import DashboardHeader from '@/components/DashboardHeader';
import FlowDiagram from '@/components/FlowDiagram';
import InfoStrip from '@/components/InfoStrip';
import StatGrid from '@/components/StatGrid';
import { C } from '@/constants/batteryTheme';
import { supabase } from '@/utils/supabase';
import React, { useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
const manager = new BleManager();

async function requestBlePermissions() {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);
  return Object.values(granted).every(
    (v) => v === PermissionsAndroid.RESULTS.GRANTED,
  );
}
export default function LiveMonitor() {
  useEffect(() => {
    requestBlePermissions().then((ok) => {
      if (!ok) {
        console.log('BLE permissions denied');
        return;
      }
      console.log('Starting BLE scan...');
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('BLE SCAN ERROR:', error.message, error.errorCode);
          return;
        }
        if (device?.name) {
          console.log('Named device:', device.name, device.id);
        }
      });
    });

    return () => {
      manager.stopDeviceScan();
    };
  }, []);
  useEffect(() => {
    supabase
      .from('any_table_name') // for now will give an error, but will confirm connection to supabase
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) console.log('SUPABASE ERROR:', error.message);
        else console.log('SUPABASE CONNECTED:', data);
      });
  }, []);
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
