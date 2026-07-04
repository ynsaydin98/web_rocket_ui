import type { ReactNode } from "react";
export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";
type Props = { children: ReactNode; tone?: StatusTone };
export function StatusBadge({ children, tone = "neutral" }: Props) {
  return (
    <span className={`status-badge status-badge--${tone}`}>{children}</span>
  );
}
