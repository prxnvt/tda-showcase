"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ServiceHealth } from "@/lib/types/tda";

const POLL_INTERVAL = 5_000;
const HEALTH_TIMEOUT = 10_000;

export function useServiceHealth(healthUrl: string | null) {
  const [health, setHealth] = useState<ServiceHealth>({
    status: "unknown",
    lastChecked: null,
  });
  const activeRef = useRef(true);

  const check = useCallback(async () => {
    if (!healthUrl || !activeRef.current) return;

    setHealth((prev) =>
      prev.status === "unknown" || prev.status === "error"
        ? { status: "warming", lastChecked: Date.now() }
        : prev,
    );

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timer);

      if (res.ok && activeRef.current) {
        setHealth({ status: "healthy", lastChecked: Date.now() });
      } else if (activeRef.current) {
        setHealth({ status: "error", lastChecked: Date.now() });
      }
    } catch {
      if (activeRef.current) {
        setHealth((prev) => ({
          status: prev.status === "warming" ? "warming" : "error",
          lastChecked: Date.now(),
        }));
      }
    }
  }, [healthUrl]);

  useEffect(() => {
    activeRef.current = true;
    if (!healthUrl) return;

    check();
    const interval = setInterval(() => {
      // Keep polling only if not healthy yet
      setHealth((prev) => {
        if (prev.status !== "healthy") check();
        return prev;
      });
    }, POLL_INTERVAL);

    return () => {
      activeRef.current = false;
      clearInterval(interval);
    };
  }, [healthUrl, check]);

  return health;
}
