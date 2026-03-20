"use client";

import React, { useRef, useState, useCallback } from "react";
import Plot from "./PlotlyWrapper";
import { EmbeddingResponse } from "@/lib/types/tda";
import { PLOTLY_LAYOUT_DEFAULTS, PLOTLY_CONFIG } from "@/lib/plotly-theme";
import LoadingOverlay from "./LoadingOverlay";
import { useIsExpanded } from "./ExpandablePanel";

const EMBEDDING_CONFIG: Partial<Plotly.Config> = {
  ...PLOTLY_CONFIG,
  scrollZoom: false,
};

const DEFAULT_EYE = { x: 1.5, y: 1.5, z: 1.0 };

interface Props {
  embedding: EmbeddingResponse | null;
  isLoading: boolean;
  height?: number;
}

function EmbeddingPlot3DInner({ embedding, isLoading, height }: Props) {
  const isExpanded = useIsExpanded();
  const chartHeight = height ?? (isExpanded ? Math.round(typeof window !== "undefined" ? window.innerHeight * 0.75 - 80 : 500) : 260);
  const points = embedding?.points || [];
  const dim = points[0]?.length || 3;

  const eyeRef = useRef(DEFAULT_EYE);
  const [forcedEye, setForcedEye] = useState<typeof DEFAULT_EYE | null>(null);

  const handleRelayout = useCallback((event: Record<string, unknown>) => {
    const cam = event["scene.camera"] as { eye?: typeof DEFAULT_EYE } | undefined;
    if (cam?.eye) eyeRef.current = cam.eye;
  }, []);

  const zoom = useCallback((scale: number) => {
    const e = eyeRef.current;
    const next = { x: e.x * scale, y: e.y * scale, z: e.z * scale };
    eyeRef.current = next;
    setForcedEye({ ...next });
  }, []);

  if (!embedding && !isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: 260, fontFamily: "var(--mono)", color: "var(--muted)", fontSize: 11 }}
      >
        Waiting for data
      </div>
    );
  }

  const zoomControls = (
    <div className="absolute bottom-8 right-1.5 z-[3] flex flex-col gap-0.5">
      {[
        { scale: 0.8, label: "+", title: "Zoom in" },
        { scale: 1.25, label: "\u2013", title: "Zoom out" },
      ].map((btn) => (
        <button
          key={btn.label}
          onClick={() => zoom(btn.scale)}
          title={btn.title}
          className="p-1 rounded text-xs"
          style={{
            background: "rgba(22,27,34,0.85)",
            border: "1px solid var(--panel-border)",
            color: "var(--muted)",
            cursor: "pointer",
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      {isLoading && <LoadingOverlay message="Embedding..." />}
      {dim >= 3 ? (
        <>
          <Plot
            data={[
              {
                x: points.map((p) => p[0]),
                y: points.map((p) => p[1]),
                z: points.map((p) => p[2]),
                type: "scatter3d",
                mode: "markers",
                marker: {
                  size: 2,
                  color: points.map((_, i) => i),
                  colorscale: "Viridis",
                  opacity: 0.8,
                },
                hovertemplate: "x=%{x:.3f}<br>y=%{y:.3f}<br>z=%{z:.3f}<extra></extra>",
              },
            ]}
            layout={{
              ...PLOTLY_LAYOUT_DEFAULTS,
              height: chartHeight,
              margin: { l: 0, r: 0, t: 0, b: 0 },
              scene: {
                xaxis: { title: { text: "x(t)", font: { size: 9, color: "#e2e8f0" } }, gridcolor: "#4a5568" },
                yaxis: { title: { text: "x(t+\u03c4)", font: { size: 9, color: "#e2e8f0" } }, gridcolor: "#4a5568" },
                zaxis: { title: { text: "x(t+2\u03c4)", font: { size: 9, color: "#e2e8f0" } }, gridcolor: "#4a5568" },
                camera: { eye: forcedEye ?? DEFAULT_EYE },
              },
            }}
            config={EMBEDDING_CONFIG}
            onRelayout={handleRelayout}
            useResizeHandler
            style={{ width: "100%" }}
          />
          {zoomControls}
        </>
      ) : (
        <Plot
          data={[
            {
              x: points.map((p) => p[0]),
              y: points.map((p) => p[1] ?? 0),
              type: "scatter",
              mode: "markers",
              marker: { size: 3, color: points.map((_, i) => i), colorscale: "Viridis", opacity: 0.8 },
            },
          ]}
          layout={{
            ...PLOTLY_LAYOUT_DEFAULTS,
            height: chartHeight,
            margin: { l: 40, r: 12, t: 0, b: 32 },
            xaxis: { ...PLOTLY_LAYOUT_DEFAULTS.xaxis, title: { text: "x(t)", font: { size: 9, color: "#e2e8f0" } } },
            yaxis: { ...PLOTLY_LAYOUT_DEFAULTS.yaxis, title: { text: "x(t+\u03c4)", font: { size: 9, color: "#e2e8f0" } } },
          }}
          config={EMBEDDING_CONFIG}
          useResizeHandler
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}

export default React.memo(EmbeddingPlot3DInner);
