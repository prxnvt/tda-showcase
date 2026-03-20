"use client";

import React from "react";
import Plot from "@/components/shared/PlotlyWrapper";
import { FinanceWindowResponse } from "@/lib/types/finance";
import { PLOTLY_LAYOUT_DEFAULTS, PLOTLY_CONFIG } from "@/lib/plotly-theme";

interface Props {
  windowDetail: FinanceWindowResponse | null;
  isLoading: boolean;
}

function CorrelationHeatmapInner({ windowDetail, isLoading }: Props) {
  if (!windowDetail && !isLoading) {
    return (
      <div
        className="h-[260px] flex items-center justify-center"
        style={{ fontFamily: "var(--mono)", color: "var(--muted)", fontSize: 11 }}
      >
        Select a window to view
      </div>
    );
  }

  const matrix = windowDetail?.correlation_matrix ?? [];
  const tickers = windowDetail?.tickers ?? [];

  return (
    <div className="relative">
      <Plot
        data={[
          {
            z: matrix,
            x: tickers,
            y: tickers,
            type: "heatmap",
            colorscale: "RdBu",
            zmin: -1,
            zmax: 1,
            reversescale: true,
            hovertemplate: "%{x} vs %{y}<br>corr=%{z:.3f}<extra></extra>",
          },
        ]}
        layout={{
          ...PLOTLY_LAYOUT_DEFAULTS,
          height: 300,
          margin: { l: 48, r: 12, t: 8, b: 48 },
          xaxis: { tickfont: { size: 8 }, tickangle: -45 },
          yaxis: { tickfont: { size: 8 }, autorange: "reversed" },
        }}
        config={PLOTLY_CONFIG}
        useResizeHandler
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default React.memo(CorrelationHeatmapInner);
