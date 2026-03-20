"use client";

import React from "react";
import { ECGEvaluation } from "@/lib/types/ecg";

interface Props {
  evaluation: ECGEvaluation;
}

function EvaluationMetricsInner({ evaluation }: Props) {
  const metrics = [
    { label: "Sensitivity (Recall)", value: evaluation.sensitivity, color: "#22c55e" },
    { label: "Precision", value: evaluation.precision, color: "#3b82f6" },
    { label: "F1 Score", value: evaluation.f1, color: "#f97316" },
  ];

  return (
    <div>
      <div className="sec-label mb-3">Evaluation Metrics</div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg p-3 text-center"
            style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--mono)", color: m.color }}
            >
              {(m.value * 100).toFixed(1)}%
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div
        className="text-xs rounded-md p-3"
        style={{
          background: "var(--panel-bg)",
          border: "1px solid var(--panel-border)",
          fontFamily: "var(--mono)",
          color: "var(--muted)",
        }}
      >
        TP={evaluation.true_positives} FP={evaluation.false_positives} FN={evaluation.false_negatives}
        <span className="ml-3">
          (Tolerance: {"\u00b1"}500 samples from arrhythmia region boundaries)
        </span>
      </div>

      <p className="text-xs mt-2" style={{ color: "var(--muted)", fontStyle: "italic" }}>
        Not a clinical-grade detector. Demonstrates that topological features carry diagnostic information.
      </p>
    </div>
  );
}

export default React.memo(EvaluationMetricsInner);
