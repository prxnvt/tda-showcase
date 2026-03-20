"use client";

import { useServiceHealth } from "@/hooks/useServiceHealth";
import ColdStartBanner from "@/components/layout/ColdStartBanner";
import ServiceStatus from "@/components/layout/ServiceStatus";

export default function SyntheticPage() {
  const health = useServiceHealth(null); // Will wire up when synthetic backend URL is configured

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--mono)" }}>
            Synthetic Signals
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Controllable regime changes with known ground truth — the proof of correctness
          </p>
        </div>
        <ServiceStatus health={health} label="Synthetic Service" />
      </div>

      <ColdStartBanner health={health} serviceName="Synthetic Service" />

      <div
        className="rounded-lg p-8 flex items-center justify-center"
        style={{
          background: "var(--panel-bg)",
          border: "1px solid var(--panel-border)",
          minHeight: 400,
        }}
      >
        <p style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 13 }}>
          Synthetic signal interface — will connect to existing deployed backend
        </p>
      </div>
    </div>
  );
}
