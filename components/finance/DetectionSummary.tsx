"use client";

import React from "react";
import { CrisisEvent } from "@/lib/types/finance";

interface Props {
  crisisEvents: CrisisEvent[];
  detectionRate: string;
}

function DetectionSummaryInner({ crisisEvents, detectionRate }: Props) {
  return (
    <div>
      <div className="flex items-baseline gap-4 mb-3">
        <div className="sec-label">Crisis Detection Summary</div>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--accent)",
          }}
        >
          {detectionRate} detected
        </span>
      </div>

      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: "1px solid var(--panel-border)",
        }}
      >
        <table
          className="w-full text-xs"
          style={{ fontFamily: "var(--mono)" }}
        >
          <thead>
            <tr style={{ background: "var(--panel-bg)" }}>
              <th className="text-left px-3 py-2" style={{ color: "var(--muted)" }}>Event</th>
              <th className="text-left px-3 py-2" style={{ color: "var(--muted)" }}>Date</th>
              <th className="text-center px-3 py-2" style={{ color: "var(--muted)" }}>Detected</th>
              <th className="text-right px-3 py-2" style={{ color: "var(--muted)" }}>Lead/Lag</th>
            </tr>
          </thead>
          <tbody>
            {crisisEvents.map((event) => (
              <tr
                key={event.name}
                style={{ borderTop: "1px solid var(--panel-border)" }}
              >
                <td className="px-3 py-1.5" style={{ color: "var(--foreground)" }}>
                  {event.name}
                </td>
                <td className="px-3 py-1.5" style={{ color: "var(--muted)" }}>
                  {event.date}
                </td>
                <td className="text-center px-3 py-1.5">
                  <span
                    style={{
                      color: event.detected ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {event.detected ? "yes" : "no"}
                  </span>
                </td>
                <td
                  className="text-right px-3 py-1.5"
                  style={{ color: "var(--muted)" }}
                >
                  {event.lead_lag_days != null
                    ? `${event.lead_lag_days > 0 ? "+" : ""}${event.lead_lag_days}d`
                    : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(DetectionSummaryInner);
