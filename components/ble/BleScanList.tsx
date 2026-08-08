import { C } from '@/constants/batteryTheme';
import { Bluetooth } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Device } from 'react-native-ble-plx';

export default function BleScanList({
  devices,
  onSelect,
}: {
  devices: Device[];
  onSelect: (device: Device) => void;
}) {
  return (
    <View style={s.wrap}>
      {devices.length === 0 ? (
        <View style={s.empty}>
          <ActivityIndicator color={C.blue} />
          <Text style={s.emptyText}>
            Searching for your ZindaBattery device...
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.row} onPress={() => onSelect(item)}>
              <View style={s.iconWrap}>
                <Bluetooth size={18} color={C.blue} />
              </View>
              <View style={s.info}>
                <Text style={s.name}>{item.name || 'ZindaBattery Device'}</Text>
                <Text style={s.id}>{item.id}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: 20, marginTop: 24 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: {
    marginTop: 12,
    fontSize: 13,
    color: C.muted,
    fontWeight: '500',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.blueDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: C.ink },
  id: { fontSize: 11, color: C.muted, marginTop: 2, fontWeight: '500' },
});
