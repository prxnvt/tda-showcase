"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTabStatus, TabState } from "@/hooks/useTabStatus";

const TABS = [
  { href: "/", label: "Overview", key: "overview" },
  { href: "/finance", label: "Finance", key: "finance" },
  { href: "/ecg", label: "ECG", key: "ecg" },
  { href: "/seismic", label: "Seismic", key: "seismic" },
  { href: "/synthetic", label: "Synthetic", key: "synthetic" },
];

function StatusIcon({ status }: { status: TabState }) {
  if (status === "loading") {
    return (
      <span
        className="inline-block w-2 h-2 border border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#eab308", borderTopColor: "transparent" }}
      />
    );
  }
  if (status === "ready") {
    return (
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
    );
  }
  // idle — dim dot
  return (
    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#4a5568" }} />
  );
}

export default function TabNav() {
  const pathname = usePathname();
  const { statuses } = useTabStatus();

  return (
    <nav
      className="sticky top-0 z-30 flex items-center gap-1 border-b px-6 overflow-x-auto"
      style={{
        background: "var(--sidebar-bg)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      <span
        className="font-semibold text-sm mr-4 shrink-0"
        style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}
      >
        TDA Showcase
      </span>
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);
        const status = statuses[tab.key] ?? "idle";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-link shrink-0 flex items-center gap-1.5 ${isActive ? "active" : ""}`}
          >
            <StatusIcon status={status} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
