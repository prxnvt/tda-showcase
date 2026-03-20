"use client";

import { useState, useCallback } from "react";
import Plot from "@/components/shared/PlotlyWrapper";
import PersistenceDiagram from "@/components/shared/PersistenceDiagram";
import { PersistenceResponse } from "@/lib/types/tda";
import { PLOTLY_LAYOUT_DEFAULTS, PLOTLY_CONFIG } from "@/lib/plotly-theme";

type Demo = "circle" | "figure8" | "random";

function generatePoints(demo: Demo, seed: number): number[][] {
  // Simple seeded RNG (mulberry32)
  let s = seed | 0;
  const rng = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const randn = () => {
    const u1 = rng();
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
  };

  const points: number[][] = [];
  const n = 40;
  const noise = 0.15;

  if (demo === "circle") {
    for (let i = 0; i < n; i++) {
      const theta = (2 * Math.PI * i) / n;
      points.push([Math.cos(theta) + randn() * noise, Math.sin(theta) + randn() * noise]);
    }
  } else if (demo === "figure8") {
    for (let i = 0; i < n; i++) {
      const theta = (2 * Math.PI * i) / n;
      if (i < n / 2) {
        points.push([Math.cos(theta) + randn() * noise, Math.sin(theta) + randn() * noise]);
      } else {
        points.push([Math.cos(theta) + 2 + randn() * noise, Math.sin(theta) + randn() * noise]);
      }
    }
  } else {
    for (let i = 0; i < n; i++) {
      points.push([rng() * 4 - 2, rng() * 4 - 2]);
    }
  }
  return points;
}

const DEMOS: { key: Demo; label: string; expected: string }[] = [
  { key: "circle", label: "Noisy Circle", expected: "1 persistent H\u2081 loop" },
  { key: "figure8", label: "Figure-8", expected: "2 persistent H\u2081 loops" },
  { key: "random", label: "Random Cloud", expected: "No persistent H\u2081" },
];

export default function InteractiveDemo() {
  const [activeDemo, setActiveDemo] = useState<Demo>("circle");
  const [seed, setSeed] = useState(42);
  const [persistence, setPersistence] = useState<PersistenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const points = generatePoints(activeDemo, seed);

  const runTDA = useCallback(
    async (pts: number[][]) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tda?path=compute-persistence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            points: pts,
            max_dimension: 2,
            max_edge_length: 3.0,
          }),
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        setPersistence(data);
      } catch (err) {
        setError("TDA service unavailable — start it locally or wait for deployment");
        setPersistence(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleDemoChange = (demo: Demo) => {
    setActiveDemo(demo);
    const pts = generatePoints(demo, seed);
    runTDA(pts);
  };

  const handleReseed = () => {
    const newSeed = seed + 1;
    setSeed(newSeed);
    const pts = generatePoints(activeDemo, newSeed);
    runTDA(pts);
  };

  return (
    <section className="mb-8">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ fontFamily: "var(--mono)" }}
      >
        Interactive Demo
      </h2>

      {/* Demo selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {DEMOS.map((d) => (
          <button
            key={d.key}
            onClick={() => handleDemoChange(d.key)}
            className="rounded-md px-3 py-1.5 text-xs transition-colors"
            style={{
              fontFamily: "var(--mono)",
              background:
                activeDemo === d.key ? "var(--accent)" : "var(--panel-bg)",
              color:
                activeDemo === d.key ? "#000" : "var(--muted)",
              border: `1px solid ${activeDemo === d.key ? "var(--accent)" : "var(--panel-border)"}`,
              cursor: "pointer",
            }}
          >
            {d.label}
          </button>
        ))}
        <button
          onClick={handleReseed}
          className="rounded-md px-3 py-1.5 text-xs"
          style={{
            fontFamily: "var(--mono)",
            background: "var(--panel-bg)",
            color: "var(--muted)",
            border: "1px solid var(--panel-border)",
            cursor: "pointer",
          }}
        >
          Reseed
        </button>
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>
        Expected: {DEMOS.find((d) => d.key === activeDemo)?.expected}
      </p>

      {error && (
        <div
          className="rounded-md px-4 py-2 mb-4 text-xs"
          style={{
            background: "rgba(234,179,8,0.1)",
            border: "1px solid rgba(234,179,8,0.3)",
            color: "#eab308",
            fontFamily: "var(--mono)",
          }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Point cloud */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "var(--panel-bg)",
            border: "1px solid var(--panel-border)",
          }}
        >
          <div className="sec-label px-3 pt-2">Point Cloud</div>
          <Plot
            data={[
              {
                x: points.map((p) => p[0]),
                y: points.map((p) => p[1]),
                type: "scatter",
                mode: "markers",
                marker: { size: 5, color: "var(--accent)", opacity: 0.8 },
                hoverinfo: "skip",
              },
            ]}
            layout={{
              ...PLOTLY_LAYOUT_DEFAULTS,
              height: 280,
              margin: { l: 36, r: 12, t: 8, b: 32 },
              xaxis: {
                ...PLOTLY_LAYOUT_DEFAULTS.xaxis,
                scaleanchor: "y",
                scaleratio: 1,
              },
              yaxis: { ...PLOTLY_LAYOUT_DEFAULTS.yaxis },
            }}
            config={PLOTLY_CONFIG}
            useResizeHandler
            style={{ width: "100%" }}
          />
        </div>

        {/* Persistence diagram */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "var(--panel-bg)",
            border: "1px solid var(--panel-border)",
          }}
        >
          <div className="sec-label px-3 pt-2">Persistence Diagram</div>
          <PersistenceDiagram
            persistence={persistence}
            isLoading={isLoading}
            height={280}
          />
        </div>
      </div>
    </section>
  );
}
