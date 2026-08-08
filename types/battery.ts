export interface Device {
    id: number;
    owner_id: string;
    device_code: string;
    created_at: string;
}

export interface BatteryReading {
    id: string;
    device_id: string;
    voltage: number;
    current: number;
    power: number;
    soc: number;
    soh: number;
    engine_on: boolean;
    recorded_at: string;
}

export interface VoltageTrendPoint {
    voltage: number;
    recorded_at: string;
}

export interface VoltageHistoryItem {
    date: string;
    min: number;
    max: number;
    flag: boolean;
}

export interface BatteryDashboardData {
    device: Device | null;
    latestReading: BatteryReading | null;
    voltageTrend: VoltageTrendPoint[];
    voltageHistory: VoltageHistoryItem[];
    loading: boolean;
    refreshing: boolean;
    error: string | null;

    refresh(): Promise<void>;
}
