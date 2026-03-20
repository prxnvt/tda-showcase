"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function MathDropdown({ title, children }: Props) {
  return (
    <details className="math-dropdown">
      <summary>{title}</summary>
      <div className="content">{children}</div>
    </details>
  );
}
