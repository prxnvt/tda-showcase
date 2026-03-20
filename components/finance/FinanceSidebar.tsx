"use client";

import { FinancePipelineState } from "@/hooks/useFinancePipeline";

interface Props {
  state: FinancePipelineState;
}

export default function FinanceSidebar({ state }: Props) {
  const { params, setParams, runAnalysis, isRunning } = state;

  return (
    <div
      className="rounded-lg p-4 space-y-4"
      style={{
        background: "var(--panel-bg)",
        border: "1px solid var(--panel-border)",
      }}
    >
      <div className="sec-label">Parameters</div>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Window Size (days): {params.window_size}
        </span>
        <input
          type="range"
          min={15}
          max={60}
          value={params.window_size}
          onChange={(e) => setParams({ window_size: +e.target.value })}
          className="w-full mt-1"
        />
      </label>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Step Size: {params.step_size}
        </span>
        <input
          type="range"
          min={1}
          max={15}
          value={params.step_size}
          onChange={(e) => setParams({ step_size: +e.target.value })}
          className="w-full mt-1"
        />
      </label>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Anomaly Threshold ({params.anomaly_threshold_sigma.toFixed(1)}{"\u03c3"})
        </span>
        <input
          type="range"
          min={10}
          max={30}
          value={params.anomaly_threshold_sigma * 10}
          onChange={(e) => setParams({ anomaly_threshold_sigma: +e.target.value / 10 })}
          className="w-full mt-1"
        />
      </label>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Edge Length Percentile: {params.max_edge_length_percentile}
        </span>
        <input
          type="range"
          min={50}
          max={100}
          value={params.max_edge_length_percentile}
          onChange={(e) => setParams({ max_edge_length_percentile: +e.target.value })}
          className="w-full mt-1"
        />
      </label>

      <button
        onClick={runAnalysis}
        disabled={isRunning}
        className="w-full rounded-md py-2 text-xs font-semibold transition-colors"
        style={{
          fontFamily: "var(--mono)",
          background: isRunning ? "var(--panel-border)" : "var(--accent)",
          color: isRunning ? "var(--muted)" : "#000",
          cursor: isRunning ? "not-allowed" : "pointer",
          border: "none",
        }}
      >
        {isRunning ? "Running..." : "Analyze"}
      </button>
    </div>
  );
}
