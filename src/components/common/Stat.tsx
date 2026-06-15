interface Props {
  label: string
  value: string
  unit?: string
}

/** Etiket + değer + birim satırı. */
export default function Stat({ label, value, unit }: Props) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value}
        {unit ? <span className="stat-unit"> {unit}</span> : null}
      </span>
    </div>
  )
}
