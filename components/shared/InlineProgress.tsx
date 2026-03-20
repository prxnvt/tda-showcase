"use client";

interface Props {
  message: string;
  pct: number;
}

export default function InlineProgress({ message, pct }: Props) {
  return (
    <div
      className="rounded-lg px-5 py-4 mb-4"
      style={{
        background: "var(--panel-bg)",
        border: "1px solid var(--panel-border)",
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin shrink-0"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--foreground)" }}>
          {message}
        </span>
        <span
          className="ml-auto"
          style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}
        >
          {pct}%
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: "var(--panel-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
