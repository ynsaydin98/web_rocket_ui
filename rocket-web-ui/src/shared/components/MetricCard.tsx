import type { ReactNode } from "react";
import type { StatusTone } from "./StatusBadge";
type Props = {
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: string;
  tone?: StatusTone;
};
export function MetricCard({
  label,
  value,
  unit,
  detail,
  tone = "info",
}: Props) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">
        {value} {unit && <small>{unit}</small>}
      </strong>
      {detail && <span className="metric-card__detail">{detail}</span>}
    </article>
  );
}
