import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useHasDevice(session: Session | null) {
  const [hasDevice, setHasDevice] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) {
      setHasDevice(null);
      return;
    }
    let cancelled = false;

    supabase
      .from("devices")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", session.user.id)
      .then(({ count }) => {
        if (!cancelled) setHasDevice((count ?? 0) > 0);
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return hasDevice;
}
