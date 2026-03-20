"use client";

import React from "react";
import Plot from "@/components/shared/PlotlyWrapper";
import { FinanceAnalysisResponse } from "@/lib/types/finance";
import { CRISIS_EVENTS } from "@/lib/constants/crisisEvents";
import { PLOTLY_LAYOUT_DEFAULTS, PLOTLY_CONFIG } from "@/lib/plotly-theme";

interface Props {
  result: FinanceAnalysisResponse;
  onWindowClick?: (idx: number) => void;
}

function MarketOverviewInner({ result, onWindowClick }: Props) {
  // Crisis event vertical lines
  const crisisShapes: Partial<Plotly.Shape>[] = CRISIS_EVENTS.map((e) => ({
    type: "line",
    xref: "x",
    yref: "paper",
    x0: e.date,
    x1: e.date,
    y0: 0,
    y1: 1,
    line: { color: "#ef444480", dash: "dot", width: 1 },
  }));

  // Anomaly flag bands
  const anomalyShapes: Partial<Plotly.Shape>[] = [];
  let inAnomaly = false;
  let anomalyStart = "";

  for (let i = 0; i < result.anomalies.length; i++) {
    if (result.anomalies[i] && !inAnomaly) {
      anomalyStart = result.dates[i];
      inAnomaly = true;
    } else if (!result.anomalies[i] && inAnomaly) {
      anomalyShapes.push({
        type: "rect",
        xref: "x",
        yref: "paper",
        x0: anomalyStart,
        x1: result.dates[i],
        y0: 0,
        y1: 1,
        fillcolor: "rgba(239,68,54,0.08)",
        line: { width: 0 },
      });
      inAnomaly = false;
    }
  }
  if (inAnomaly) {
    anomalyShapes.push({
      type: "rect",
      xref: "x",
      yref: "paper",
      x0: anomalyStart,
      x1: result.dates[result.dates.length - 1],
      y0: 0,
      y1: 1,
      fillcolor: "rgba(239,68,54,0.08)",
      line: { width: 0 },
    });
  }

  // Crisis event annotations
  const annotations: Partial<Plotly.Annotations>[] = CRISIS_EVENTS.filter(
    (e) => e.date >= result.sp500_dates[0] && e.date <= result.sp500_dates[result.sp500_dates.length - 1],
  ).map((e) => ({
    x: e.date,
    y: 1,
    xref: "x",
    yref: "paper",
    text: e.name.split(" ").slice(0, 2).join(" "),
    showarrow: false,
    font: { size: 8, color: "#ef4444" },
    yanchor: "bottom",
    textangle: "-45",
  }));

  return (
    <div>
      <div className="sec-label mb-1">S&P 500 with TDA Anomaly Flags</div>
      <Plot
        data={[
          {
            x: result.sp500_dates,
            y: result.sp500_values,
            type: "scatter",
            mode: "lines",
            line: { width: 1, color: "#58a6ff" },
            name: "S&P 500",
            hovertemplate: "%{x}<br>%{y:,.0f}<extra></extra>",
          },
        ]}
        layout={{
          ...PLOTLY_LAYOUT_DEFAULTS,
          height: 280,
          margin: { l: 60, r: 12, t: 8, b: 32 },
          xaxis: { ...PLOTLY_LAYOUT_DEFAULTS.xaxis, type: "date" },
          yaxis: { ...PLOTLY_LAYOUT_DEFAULTS.yaxis, title: { text: "S&P 500", font: { size: 10, color: "#e2e8f0" } } },
          shapes: [...crisisShapes, ...anomalyShapes],
          annotations,
          showlegend: false,
        }}
        config={PLOTLY_CONFIG}
        useResizeHandler
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default React.memo(MarketOverviewInner);
