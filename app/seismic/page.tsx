import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seismic — TDA Showcase",
};

export default function SeismicPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--mono)" }}>
        Seismic Event Detection
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Earthquake regime detection via topological changes in seismograph data
      </p>

      <div
        className="rounded-lg p-8 flex flex-col items-center justify-center gap-4"
        style={{
          background: "var(--panel-bg)",
          border: "1px solid var(--panel-border)",
          minHeight: 300,
        }}
      >
        <span style={{ fontSize: 32 }}>~</span>
        <p style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 13 }}>
          Coming Soon
        </p>
        <p
          className="max-w-md text-center"
          style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.6 }}
        >
          The same regime-change detection pipeline applied to publicly available
          seismograph data from IRIS. Quiet background noise punctuated by
          earthquake events — the topology shifts dramatically at onset.
        </p>
      </div>
    </div>
  );
}
