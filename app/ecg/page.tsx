"use client";

import { useEffect } from "react";
import { useServiceHealth } from "@/hooks/useServiceHealth";
import { useECGPipeline } from "@/hooks/useECGPipeline";
import { useTabStatus } from "@/hooks/useTabStatus";
import ColdStartBanner from "@/components/layout/ColdStartBanner";
import ServiceStatus from "@/components/layout/ServiceStatus";
import InlineProgress from "@/components/shared/InlineProgress";
import ECGSidebar from "@/components/ecg/ECGSidebar";
import EvaluationMetrics from "@/components/ecg/EvaluationMetrics";
import PersistenceDiagram from "@/components/shared/PersistenceDiagram";
import EmbeddingPlot3D from "@/components/shared/EmbeddingPlot3D";
import FeatureTimeSeries from "@/components/shared/FeatureTimeSeries";
import Plot from "@/components/shared/PlotlyWrapper";
import { PLOTLY_LAYOUT_DEFAULTS, PLOTLY_CONFIG } from "@/lib/plotly-theme";

const ECG_FEATURES = [
  { key: "max_persistence_h1", label: "Max H\u2081 Persistence", color: "#f97316" },
  { key: "total_persistence_h1", label: "Total H\u2081 Persistence", color: "#22c55e" },
  { key: "num_h1", label: "H\u2081 Count", color: "#3b82f6" },
];

export default function ECGPage() {
  const health = useServiceHealth("/api/ecg?path=health");
  const state = useECGPipeline();
  const { setStatus } = useTabStatus();
  const isHealthy = health.status === "healthy";

  // Sync tab status
  useEffect(() => {
    if (state.isRunning) setStatus("ecg", "loading");
    else if (state.result) setStatus("ecg", "ready");
    else setStatus("ecg", "idle");
  }, [state.isRunning, state.result, setStatus]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--mono)" }}>
            ECG Arrhythmia Detection
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Approach A: Takens delay embedding — MIT-BIH Arrhythmia Database
          </p>
        </div>
        <ServiceStatus health={health} label="ECG Service" />
      </div>

      <ColdStartBanner health={health} serviceName="ECG Service" />

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
          <ECGSidebar state={state} />
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
                  ? 'Select a record and click "Analyze" to detect arrhythmias'
                  : "Waiting for ECG Service..."}
              </p>
            </div>
          )}

          {state.result && (
            <>
              {/* Row 1: ECG Signal */}
              <div>
                <div className="sec-label mb-1">Filtered ECG Signal</div>
                <Plot
                  data={[
                    {
                      y: state.result.filtered_signal,
                      type: "scattergl",
                      mode: "lines",
                      line: { width: 0.5, color: "#58a6ff" },
                      hoverinfo: "skip",
                    },
                  ]}
                  layout={{
                    ...PLOTLY_LAYOUT_DEFAULTS,
                    height: 200,
                    margin: { l: 40, r: 12, t: 8, b: 32 },
                    xaxis: {
                      ...PLOTLY_LAYOUT_DEFAULTS.xaxis,
                      title: { text: "Sample", font: { size: 10, color: "#e2e8f0" } },
                    },
                    yaxis: {
                      ...PLOTLY_LAYOUT_DEFAULTS.yaxis,
                      title: { text: "Amplitude", font: { size: 10, color: "#e2e8f0" } },
                    },
                    shapes: state.result.arrhythmia_regions.map((r) => ({
                      type: "rect" as const,
                      xref: "x" as const,
                      yref: "paper" as const,
                      x0: r.start,
                      x1: r.end,
                      y0: 0,
                      y1: 1,
                      fillcolor: "rgba(239,68,54,0.08)",
                      line: { width: 0 },
                    })),
                    showlegend: false,
                  }}
                  config={PLOTLY_CONFIG}
                  useResizeHandler
                  style={{ width: "100%" }}
                />
              </div>

              {/* Row 2: Feature time series */}
              <div>
                <div className="flex items-baseline gap-4 mb-1">
                  <div className="sec-label">Topological Features</div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
                    {state.result.window_centers.length} windows,{" "}
                    <span style={{ color: state.result.anomalies.filter(Boolean).length > 0 ? "#ef4444" : "#22c55e" }}>
                      {state.result.anomalies.filter(Boolean).length}
                    </span>{" "}
                    anomalies, {state.result.computation_time_ms.toFixed(0)}ms
                  </span>
                </div>
                <FeatureTimeSeries
                  pipelineResult={{
                    window_centers: state.result.window_centers,
                    features: state.result.features,
                    anomalies: state.result.anomalies,
                    num_windows: state.result.window_centers.length,
                    computation_time_ms: state.result.computation_time_ms,
                  }}
                  featureConfigs={ECG_FEATURES}
                />
              </div>

              {/* Row 3: Window inspector */}
              <div>
                <div className="sec-label mb-2">Window Inspector</div>
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={state.result.window_centers.length - 1}
                    value={state.selectedWindow}
                    onChange={(e) => state.selectWindow(+e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>
                    <span>Window {state.selectedWindow}</span>
                    <span>Center: sample {state.result.window_centers[state.selectedWindow]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
                    <div className="sec-label px-3 pt-2">3D Takens Embedding</div>
                    <EmbeddingPlot3D
                      embedding={
                        state.windowDetail
                          ? { points: state.windowDetail.embedding_points, num_points: state.windowDetail.embedding_points.length }
                          : null
                      }
                      isLoading={state.isLoadingWindow}
                      height={280}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
                    <div className="sec-label px-3 pt-2">Persistence Diagram</div>
                    <PersistenceDiagram
                      persistence={
                        state.windowDetail
                          ? { pairs: state.windowDetail.pairs, betti_summary: {}, computation_time_ms: 0 }
                          : null
                      }
                      isLoading={state.isLoadingWindow}
                      height={280}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Evaluation */}
              <EvaluationMetrics evaluation={state.result.evaluation} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
