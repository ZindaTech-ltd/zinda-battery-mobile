import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// OCV lookup table from hardware team, used to reanchor SOC when the
// battery is at rest (current ≈ 0), correcting coulomb-counting drift.
const OCV_TABLE: [number, number][] = [
  [12.6, 100],
  [12.4, 75],
  [12.2, 50],
  [12.0, 25],
  [11.8, 0],
];

function socFromOcv(voltage: number): number {
  if (voltage >= OCV_TABLE[0][0]) return 100;
  if (voltage <= OCV_TABLE[OCV_TABLE.length - 1][0]) return 0;
  for (let i = 0; i < OCV_TABLE.length - 1; i++) {
    const [vHigh, socHigh] = OCV_TABLE[i];
    const [vLow, socLow] = OCV_TABLE[i + 1];
    if (voltage <= vHigh && voltage >= vLow) {
      const frac = (voltage - vLow) / (vHigh - vLow);
      return Math.round((socLow + frac * (socHigh - socLow)) * 10) / 10;
    }
  }
  return 50;
}

const REST_CURRENT_THRESHOLD_A = 0.5;
const LOAD_EVENT_DELTA_A = 5;

function calculateEngineOn(voltage: number): boolean {
  return voltage >= 13.3;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      Deno.env.get("SERVICE_ROLE_KEY")!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { device_code, api_key, voltage, current } = await req.json();

    if (
      !device_code || !api_key || voltage === undefined || current === undefined
    ) {
      return new Response(
        JSON.stringify({
          error: "device_code, api_key, voltage, and current are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: device, error: deviceError } = await adminClient
      .from("devices")
      .select(
        "id, capacity_ah, r_new_ohms, last_soc, last_voltage, last_current, last_reading_at",
      )
      .eq("device_code", device_code)
      .eq("device_api_key", api_key)
      .maybeSingle();

    if (deviceError) {
      return new Response(JSON.stringify({ error: deviceError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!device) {
      return new Response(JSON.stringify({ error: "Unauthorized device" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (device.capacity_ah === null) {
      return new Response(
        JSON.stringify({
          error:
            "Device missing capacity_ah — set this before readings can be processed",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const power = Math.abs(voltage * current);
    const engineOn = calculateEngineOn(voltage);
    const now = new Date();
    const isResting = Math.abs(current) < REST_CURRENT_THRESHOLD_A;

    // --- SOC ---
    let soc: number;
    if (device.last_soc === null || device.last_reading_at === null) {
      soc = isResting ? socFromOcv(voltage) : 50;
    } else if (isResting) {
      soc = socFromOcv(voltage);
    } else {
      const dtSeconds =
        (now.getTime() - new Date(device.last_reading_at).getTime()) / 1000;
      const iAvg = (current + (device.last_current ?? current)) / 2;
      const socDelta = ((iAvg * dtSeconds) / 3600 / device.capacity_ah) * 100;
      soc = Math.round(
        Math.min(100, Math.max(0, device.last_soc + socDelta)) * 10,
      ) / 10;
    }

    // --- SOH ---
    let soh = 100;
    if (
      device.r_new_ohms !== null &&
      device.last_voltage !== null &&
      device.last_current !== null
    ) {
      const deltaI = Math.abs(current - device.last_current);
      if (deltaI >= LOAD_EVENT_DELTA_A) {
        const deltaV = Math.abs(device.last_voltage - voltage);
        const rMeasured = deltaV / deltaI;
        if (rMeasured > 0) {
          soh = Math.round(
            Math.min(100, (device.r_new_ohms / rMeasured) * 100) * 10,
          ) / 10;
        }
      }
    }

    const { data: reading, error: insertError } = await adminClient
      .from("battery_readings")
      .insert({
        device_id: device.id,
        voltage,
        current,
        power,
        soc,
        soh,
        engine_on: engineOn,
      })
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await adminClient
      .from("devices")
      .update({
        last_soc: soc,
        last_voltage: voltage,
        last_current: current,
        last_reading_at: now.toISOString(),
      })
      .eq("id", device.id);

    return new Response(JSON.stringify({ success: true, reading }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
