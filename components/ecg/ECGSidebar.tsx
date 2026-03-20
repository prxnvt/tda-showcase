"use client";

import { ECGPipelineState } from "@/hooks/useECGPipeline";
import { ECG_RECORDS } from "@/lib/types/ecg";

interface Props {
  state: ECGPipelineState;
}

export default function ECGSidebar({ state }: Props) {
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
          Record
        </span>
        <select
          value={params.record_id}
          onChange={(e) => setParams({ record_id: e.target.value })}
          className="w-full mt-1 rounded-md px-2 py-1.5 text-xs"
          style={{
            background: "var(--sidebar-bg)",
            border: "1px solid var(--panel-border)",
            color: "var(--foreground)",
            fontFamily: "var(--mono)",
          }}
        >
          {ECG_RECORDS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.id} — {r.description}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Window Size (samples): {params.window_size}
        </span>
        <input
          type="range"
          min={600}
          max={2000}
          step={100}
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
          min={50}
          max={300}
          step={50}
          value={params.step_size}
          onChange={(e) => setParams({ step_size: +e.target.value })}
          className="w-full mt-1"
        />
      </label>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Embedding Delay ({"\u03c4"}): {params.embedding_delay}
        </span>
        <input
          type="range"
          min={1}
          max={10}
          value={params.embedding_delay}
          onChange={(e) => setParams({ embedding_delay: +e.target.value })}
          className="w-full mt-1"
        />
      </label>

      <label className="block">
        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
          Subsample Size: {params.subsample_size}
        </span>
        <input
          type="range"
          min={50}
          max={150}
          value={params.subsample_size}
          onChange={(e) => setParams({ subsample_size: +e.target.value })}
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
