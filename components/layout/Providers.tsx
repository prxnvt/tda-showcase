"use client";

import { ReactNode } from "react";
import { TabStatusProvider } from "@/hooks/useTabStatus";

export default function Providers({ children }: { children: ReactNode }) {
  return <TabStatusProvider>{children}</TabStatusProvider>;
}
