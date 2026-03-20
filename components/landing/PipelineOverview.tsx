"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import MathDropdown from "./MathDropdown";

const STEPS = [
  {
    label: "Point Cloud",
    desc: "N points in R^d",
    color: "#3b82f6",
  },
  {
    label: "Distance Matrix",
    desc: "Pairwise d(x_i, x_j)",
    color: "#8b5cf6",
  },
  {
    label: "Filtration",
    desc: "Vietoris-Rips complex",
    color: "#ec4899",
  },
  {
    label: "Boundary Matrix",
    desc: "Sparse over Z/2Z",
    color: "#f97316",
  },
  {
    label: "Column Reduction",
    desc: "Gaussian elimination mod 2",
    color: "#eab308",
  },
  {
    label: "Persistence Diagram",
    desc: "Birth-death pairs",
    color: "#22c55e",
  },
];

export default function PipelineOverview() {
  return (
    <section className="mb-12">
      <h2
        className="text-lg font-semibold mb-6"
        style={{ fontFamily: "var(--mono)" }}
      >
        The Pipeline
      </h2>

      {/* Step cards */}
      <div className="flex flex-wrap gap-2 mb-8">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className="rounded-md px-3 py-2"
              style={{
                background: `${step.color}15`,
                border: `1px solid ${step.color}40`,
              }}
            >
              <div
                className="text-xs font-semibold"
                style={{ color: step.color, fontFamily: "var(--mono)" }}
              >
                {step.label}
              </div>
              <div
                className="text-[10px] mt-0.5"
                style={{ color: "var(--muted)" }}
              >
                {step.desc}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <span style={{ color: "var(--muted)", fontSize: 14 }}>{"\u2192"}</span>
            )}
          </div>
        ))}
      </div>

      {/* Core formula */}
      <div
        className="rounded-lg p-5 mb-8"
        style={{
          background: "var(--panel-bg)",
          border: "1px solid var(--panel-border)",
        }}
      >
        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
          Persistent homology tracks how topological features (connected
          components, loops, voids) appear and disappear as we grow a simplicial
          complex at increasing distance thresholds:
        </p>
        <BlockMath math="H_k = \ker(\partial_k) \,/\, \text{im}(\partial_{k+1})" />
        <div
          className="flex flex-wrap gap-6 mt-3 text-sm"
          style={{ fontFamily: "var(--mono)" }}
        >
          <span>
            <InlineMath math="\beta_0" /> = components
          </span>
          <span>
            <InlineMath math="\beta_1" /> = loops
          </span>
          <span>
            <InlineMath math="\beta_2" /> = voids
          </span>
        </div>
      </div>

      {/* Expandable math sections */}
      <MathDropdown title="The Z/2Z Field — Why Everything is XOR">
        <p className="mb-3">
          All computation in this pipeline operates over{" "}
          <InlineMath math="\mathbb{Z}/2\mathbb{Z} = \{0, 1\}" />, the
          two-element field where addition is XOR:
        </p>
        <BlockMath math="0 + 0 = 0, \quad 0 + 1 = 1, \quad 1 + 0 = 1, \quad 1 + 1 = 0" />
        <p className="mb-3">
          This is a valid field (every nonzero element has a multiplicative
          inverse: <InlineMath math="1^{-1} = 1" />
          ). Working over <InlineMath math="\mathbb{Z}/2\mathbb{Z}" /> means:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: "var(--muted)" }}>
          <li>No signs to track — subtraction equals addition</li>
          <li>Matrix entries are single bits</li>
          <li>Column operations are symmetric differences (XOR of sorted index sets)</li>
          <li>No numerical instability — everything is exact</li>
        </ul>
      </MathDropdown>

      <MathDropdown title="Boundary Operators — The Algebraic Core">
        <p className="mb-3">
          The boundary operator{" "}
          <InlineMath math="\partial_k" /> maps each{" "}
          <InlineMath math="k" />
          -simplex to the sum of its{" "}
          <InlineMath math="(k{-}1)" />
          -faces:
        </p>
        <BlockMath math="\partial_k([v_0, v_1, \ldots, v_k]) = \sum_{i=0}^{k} [v_0, \ldots, \hat{v}_i, \ldots, v_k]" />
        <p className="mb-3">
          where <InlineMath math="\hat{v}_i" /> means &ldquo;remove vertex{" "}
          <InlineMath math="v_i" />.&rdquo; For example, the boundary of the
          triangle <InlineMath math="[0,1,2]" /> is the sum of edges{" "}
          <InlineMath math="[1,2] + [0,2] + [0,1]" />.
        </p>
        <p className="mb-3">
          The fundamental property: <InlineMath math="\partial \circ \partial = 0" />.
          Each <InlineMath math="(k{-}2)" />
          -face appears exactly twice in{" "}
          <InlineMath math="\partial_{k-1}(\partial_k(\sigma))" />, and cancels
          mod 2.
        </p>
      </MathDropdown>

      <MathDropdown title="Homology Groups — Quotient Structure">
        <p className="mb-3">
          The <InlineMath math="k" />
          -th homology group is the quotient:
        </p>
        <BlockMath math="H_k = \ker(\partial_k) \,/\, \text{im}(\partial_{k+1})" />
        <p className="mb-3">
          <strong>Kernel</strong> (<InlineMath math="\ker \partial_k" />
          ): <InlineMath math="k" />
          -chains whose boundary is zero —{" "}
          <em>cycles</em>. These are &ldquo;closed&rdquo; structures.
        </p>
        <p className="mb-3">
          <strong>Image</strong> (<InlineMath math="\text{im}\,\partial_{k+1}" />
          ): <InlineMath math="k" />
          -chains that are boundaries of{" "}
          <InlineMath math="(k{+}1)" />
          -chains — &ldquo;filled-in&rdquo; structures.
        </p>
        <p className="mb-3">
          The quotient identifies cycles that differ only by a boundary. Two
          loops are &ldquo;homologous&rdquo; if one can be deformed into the
          other by adding a filled surface. The Betti number{" "}
          <InlineMath math="\beta_k = \dim H_k" /> counts the independent{" "}
          <InlineMath math="k" />
          -dimensional holes.
        </p>
      </MathDropdown>

      <MathDropdown title="Column Reduction — From Matrix to Persistence">
        <p className="mb-3">
          The boundary matrix <InlineMath math="D" /> has columns indexed by
          simplices in filtration order. Column reduction performs left-to-right
          Gaussian elimination using XOR:
        </p>
        <div
          className="rounded-md p-4 text-sm mb-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--panel-border)",
            fontFamily: "var(--mono)",
            color: "var(--muted)",
            lineHeight: 1.8,
          }}
        >
          for j = 0 to m-1:<br />
          &nbsp;&nbsp;while low(j) is defined and pivot_lookup[low(j)] exists:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;j &larr; j XOR pivot_lookup[low(j)]<br />
          &nbsp;&nbsp;if low(j) is defined:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;pivot_lookup[low(j)] = j &nbsp;// pivot pair (low(j), j)
        </div>
        <p className="mb-3">
          A <strong>pivot pair</strong>{" "}
          <InlineMath math="(i, j)" /> means: the feature born when simplex{" "}
          <InlineMath math="i" /> enters the filtration is killed when simplex{" "}
          <InlineMath math="j" /> enters. The persistence is{" "}
          <InlineMath math="\epsilon_j - \epsilon_i" />. A zero column with no
          incoming pivot means an <em>essential</em> feature that never dies.
        </p>
      </MathDropdown>
    </section>
  );
}
