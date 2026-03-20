"use client";

import { ServiceHealth } from "@/lib/types/tda";

export default function ColdStartBanner({
  health,
  serviceName,
}: {
  health: ServiceHealth;
  serviceName: string;
}) {
  if (health.status === "healthy" || health.status === "unknown") return null;

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3 mb-4"
      style={{
        background: health.status === "error" ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
        border: `1px solid ${health.status === "error" ? "rgba(239,68,68,0.3)" : "rgba(234,179,8,0.3)"}`,
        fontFamily: "var(--mono)",
        fontSize: 12,
      }}
    >
      {health.status === "warming" && (
        <>
          <div
            className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin shrink-0"
            style={{ borderColor: "#eab308", borderTopColor: "transparent" }}
          />
          <span style={{ color: "#eab308" }}>
            Warming up {serviceName}... This may take 30-60s on first visit.
          </span>
        </>
      )}
      {health.status === "error" && (
        <span style={{ color: "#ef4444" }}>
          {serviceName} is unavailable. Retrying...
        </span>
      )}
    </div>
  );
}
