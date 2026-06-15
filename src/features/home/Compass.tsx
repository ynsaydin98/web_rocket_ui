import { useStoreSelector } from '../../app/services'
import { fmt } from '../../lib/format'

const CARDINALS = [
  { label: 'K', angle: 0 },
  { label: 'D', angle: 90 },
  { label: 'G', angle: 180 },
  { label: 'B', angle: 270 },
]

/** Yönelim (heading) gösteren kare pusula. */
export default function Compass() {
  const heading = useStoreSelector((s) => s.latest?.gnss.heading) ?? 0
  const r = 86
  const cx = 100
  const cy = 100

  return (
    <section className="panel compass-panel">
      <h2 className="panel-title">Pusula</h2>
      <div className="panel-body compass-body">
        <svg viewBox="0 0 200 200" className="compass" role="img" aria-label="Pusula">
          <circle cx={cx} cy={cy} r={r} className="compass-ring" />
          {/* derece çizgileri */}
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i * 10 * Math.PI) / 180
            const major = i % 9 === 0
            const r1 = major ? r - 14 : r - 7
            return (
              <line
                key={i}
                x1={cx + Math.sin(a) * r}
                y1={cy - Math.cos(a) * r}
                x2={cx + Math.sin(a) * r1}
                y2={cy - Math.cos(a) * r1}
                className={major ? 'compass-tick major' : 'compass-tick'}
              />
            )
          })}
          {CARDINALS.map((c) => {
            const a = (c.angle * Math.PI) / 180
            return (
              <text
                key={c.label}
                x={cx + Math.sin(a) * (r - 26)}
                y={cy - Math.cos(a) * (r - 26) + 5}
                className={`compass-label${c.label === 'K' ? ' north' : ''}`}
                textAnchor="middle"
              >
                {c.label}
              </text>
            )
          })}
          {/* yönelim oku */}
          <g transform={`rotate(${heading} ${cx} ${cy})`}>
            <polygon points={`${cx},28 ${cx - 9},108 ${cx + 9},108`} className="compass-needle-n" />
            <polygon points={`${cx},172 ${cx - 9},108 ${cx + 9},108`} className="compass-needle-s" />
          </g>
          <circle cx={cx} cy={cy} r={6} className="compass-hub" />
        </svg>
        <div className="compass-readout">{fmt(heading, 0)}°</div>
      </div>
    </section>
  )
}
