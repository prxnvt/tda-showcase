"use client";

import { ServiceHealth } from "@/lib/types/tda";

const STATUS_COLORS: Record<ServiceHealth["status"], string> = {
  unknown: "#6b7280",
  warming: "#eab308",
  healthy: "#22c55e",
  error: "#ef4444",
};

export default function ServiceStatus({
  health,
  label,
}: {
  health: ServiceHealth;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2" style={{ fontFamily: "var(--mono)", fontSize: 11 }}>
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: STATUS_COLORS[health.status],
          boxShadow: health.status === "warming" ? "0 0 6px #eab308" : undefined,
          animation: health.status === "warming" ? "pulse 1.5s infinite" : undefined,
        }}
      />
      <span style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  );
}
