"use client";

import { useEffect } from "react";
import { useServiceHealth } from "@/hooks/useServiceHealth";
import { useFinancePipeline } from "@/hooks/useFinancePipeline";
import { useTabStatus } from "@/hooks/useTabStatus";
import ColdStartBanner from "@/components/layout/ColdStartBanner";
import ServiceStatus from "@/components/layout/ServiceStatus";
import InlineProgress from "@/components/shared/InlineProgress";
import FinanceSidebar from "@/components/finance/FinanceSidebar";
import MarketOverview from "@/components/finance/MarketOverview";
import CorrelationHeatmap from "@/components/finance/CorrelationHeatmap";
import DetectionSummary from "@/components/finance/DetectionSummary";
import PersistenceDiagram from "@/components/shared/PersistenceDiagram";
import FeatureTimeSeries from "@/components/shared/FeatureTimeSeries";

const FINANCE_FEATURES = [
  { key: "max_persistence_h1", label: "Max H\u2081 Persistence", color: "#f97316" },
  { key: "total_persistence_h1", label: "Total H\u2081 Persistence", color: "#22c55e" },
  { key: "num_h0", label: "H\u2080 Count", color: "#3b82f6" },
];

export default function FinancePage() {
  const health = useServiceHealth("/api/finance?path=health");
  const state = useFinancePipeline();
  const { setStatus } = useTabStatus();
  const isHealthy = health.status === "healthy";

  // Sync tab status
  useEffect(() => {
    if (state.isRunning) setStatus("finance", "loading");
    else if (state.result) setStatus("finance", "ready");
    else setStatus("finance", "idle");
  }, [state.isRunning, state.result, setStatus]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--mono)" }}>
            Stock Market Regime Detection
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Approach B: Correlation network topology — 25 stocks, 2006-2024
          </p>
        </div>
        <ServiceStatus health={health} label="Finance Service" />
      </div>

      <ColdStartBanner health={health} serviceName="Finance Service" />

      {/* Error */}
      {state.error && (
        <div
          className="rounded-md px-4 py-2 mb-4 text-xs"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
            fontFamily: "var(--mono)",
          }}
        >
          {state.error}
        </div>
      )}

      <div className="flex gap-6 max-lg:flex-col">
        {/* Sidebar */}
        <div className="w-64 shrink-0 max-lg:w-full">
          <FinanceSidebar state={state} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Inline progress */}
          {state.isRunning && (
            <InlineProgress message={state.progressMessage} pct={state.progressPct} />
          )}

          {!state.result && !state.isRunning && (
            <div
              className="rounded-lg p-8 flex items-center justify-center"
              style={{
                background: "var(--panel-bg)",
                border: "1px solid var(--panel-border)",
                minHeight: 400,
              }}
            >
              <p style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 13 }}>
                {isHealthy
                  ? 'Click "Analyze" to run the TDA pipeline on 18 years of stock market data'
                  : "Waiting for Finance Service..."}
              </p>
            </div>
          )}

          {state.result && (
            <>
              <MarketOverview result={state.result} />

              <div>
                <div className="flex items-baseline gap-4 mb-1">
                  <div className="sec-label">Topological Features</div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
                    {state.result.num_windows} windows,{" "}
                    <span style={{ color: state.result.anomalies.filter(Boolean).length > 0 ? "#ef4444" : "#22c55e" }}>
                      {state.result.anomalies.filter(Boolean).length}
                    </span>{" "}
                    anomalies, {state.result.computation_time_ms.toFixed(0)}ms
                  </span>
                </div>
                <FeatureTimeSeries
                  pipelineResult={{
                    window_centers: state.result.dates as unknown as number[],
                    features: state.result.features,
                    anomalies: state.result.anomalies,
                    num_windows: state.result.num_windows,
                    computation_time_ms: state.result.computation_time_ms,
                  }}
                  featureConfigs={FINANCE_FEATURES}
                />
              </div>

              <div>
                <div className="sec-label mb-2">Window Inspector</div>
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={state.result.num_windows - 1}
                    value={state.selectedWindow}
                    onChange={(e) => state.selectWindow(+e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>
                    <span>Window {state.selectedWindow}</span>
                    <span>{state.result.dates[state.selectedWindow]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
                    <div className="sec-label px-3 pt-2">Persistence Diagram</div>
                    <PersistenceDiagram
                      persistence={state.windowDetail ? { pairs: state.windowDetail.pairs, betti_summary: {}, computation_time_ms: 0 } : null}
                      isLoading={state.isLoadingWindow}
                      height={280}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
                    <div className="sec-label px-3 pt-2">
                      Correlation Matrix
                      {state.windowDetail?.date_range && (
                        <span style={{ fontWeight: 400, marginLeft: 8 }}>
                          {state.windowDetail.date_range[0]} — {state.windowDetail.date_range[1]}
                        </span>
                      )}
                    </div>
                    <CorrelationHeatmap windowDetail={state.windowDetail} isLoading={state.isLoadingWindow} />
                  </div>
                </div>
              </div>

              <DetectionSummary crisisEvents={state.result.crisis_events} detectionRate={state.result.detection_rate} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
