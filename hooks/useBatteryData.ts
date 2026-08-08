import {
    BatteryDashboardData,
    BatteryReading,
    Device,
    VoltageHistoryItem,
    VoltageTrendPoint,
} from "@/types/battery";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useState } from "react";

const POLL_INTERVAL = 5 * 60 * 1000; // our test esp32 sends data every 2 minutes, so we can poll every 5 minutes

export function useBatteryData(): BatteryDashboardData {
    const [device, setDevice] = useState<Device | null>(null);
    const [latestReading, setLatestReading] = useState<BatteryReading | null>(
        null,
    );

    const [voltageTrend, setVoltageTrend] = useState<VoltageTrendPoint[]>([]);
    const [voltageHistory, setVoltageHistory] = useState<
        VoltageHistoryItem[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const refresh = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("No active session.");
            }

            const { data: deviceRow, error: deviceError } = await supabase
                .from("devices")
                .select("*")
                .eq("owner_id", session.user.id)
                .single();

            if (deviceError) throw deviceError;

            setDevice(deviceRow);

            const deviceId = deviceRow.id;

            const [latestResult, trendResult, historyResult] = await Promise
                .all([
                    supabase
                        .from("battery_readings")
                        .select("*")
                        .eq("device_id", deviceId)
                        .order("recorded_at", { ascending: false })
                        .limit(1)
                        .single(),

                    supabase
                        .from("battery_readings")
                        .select("voltage, recorded_at")
                        .eq("device_id", deviceId)
                        .gte(
                            "recorded_at",
                            new Date(Date.now() - 24 * 60 * 60 * 1000)
                                .toISOString(),
                        )
                        .order("recorded_at"),

                    supabase
                        .from("battery_readings")
                        .select("voltage, recorded_at")
                        .eq("device_id", deviceId)
                        .order("recorded_at", { ascending: false }),
                ]);

            if (latestResult.error) throw latestResult.error;

            setLatestReading(latestResult.data);

            setVoltageTrend(
                (trendResult.data ?? []) as VoltageTrendPoint[],
            );

            const grouped = new Map<
                string,
                { min: number; max: number }
            >();

            (historyResult.data ?? []).forEach((row: any) => {
                const date = row.recorded_at.substring(0, 10);

                if (!grouped.has(date)) {
                    grouped.set(date, {
                        min: row.voltage,
                        max: row.voltage,
                    });
                } else {
                    const d = grouped.get(date)!;

                    d.min = Math.min(d.min, row.voltage);
                    d.max = Math.max(d.max, row.voltage);
                }
            });
            // now we have a map of date -> { min, max } for each day, we can convert it to an array of VoltageHistoryItem
            const history: VoltageHistoryItem[] = [...grouped.entries()]
                .slice(0, 6) // only keep the last 6 days
                .map(([date, value]) => ({
                    date,
                    min: value.min,
                    max: value.max,

                    flag: value.min < 11.8, // flag if the min voltage is below 11.8V
                }));

            setVoltageHistory(history);
        } catch (err: any) {
            console.error(err);

            setError(err.message ?? "Unknown error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        refresh();

        const interval = setInterval(refresh, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [refresh]);

    return {
        device,

        latestReading,
        voltageTrend,
        voltageHistory,
        loading,
        refreshing,
        error,
        refresh,
    };
}
