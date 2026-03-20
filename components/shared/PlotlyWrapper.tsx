"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center"
      style={{
        height: 260,
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--muted)",
      }}
    >
      Loading chart...
    </div>
  ),
});

export default Plot;
