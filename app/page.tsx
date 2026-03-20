import type { Metadata } from "next";
import PipelineOverview from "@/components/landing/PipelineOverview";
import InteractiveDemo from "@/components/landing/InteractiveDemo";

export const metadata: Metadata = {
  title: "TDA Showcase — Topological Data Analysis",
};

export default function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: "var(--mono)" }}
      >
        Topological Data Analysis
      </h1>
      <p className="text-lg mb-2" style={{ color: "var(--muted)" }}>
        From-scratch persistent homology applied to real-world signals.
      </p>
      <p className="text-sm mb-10" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
        This showcase demonstrates a complete TDA pipeline — built from scratch
        over <span style={{ fontFamily: "var(--mono)" }}>Z/2Z</span> without
        external libraries — applied to stock market regime detection, cardiac
        arrhythmia analysis, and synthetic signal processing. Each tab connects
        to an independently deployed microservice.
      </p>

      <PipelineOverview />
      <InteractiveDemo />
    </div>
  );
}
