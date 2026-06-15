import { useEffect, useRef } from 'react'
import { useStoreSelector } from '../../app/services'
import { computeTrajectory } from '../../lib/trajectory'

/**
 * Ascent Profile: IMU (ivme/gyro) ve barometre verilerinden türetilen
 * menzil–irtifa yörüngesini canvas üzerine çizer.
 */
export default function TrajectoryPlot() {
  const history = useStoreSelector((s) => s.history)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (canvas === null || wrap === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    const dpr = window.devicePixelRatio || 1
    const w = wrap.clientWidth
    const h = wrap.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const pad = { l: 48, r: 16, t: 16, b: 30 }
    const plotW = w - pad.l - pad.r
    const plotH = h - pad.t - pad.b

    const points = computeTrajectory(history)
    const maxRange = Math.max(10, ...points.map((p) => p.range))
    const maxAlt = Math.max(10, ...points.map((p) => p.altitude))

    const X = (range: number) => pad.l + (range / maxRange) * plotW
    const Y = (alt: number) => pad.t + plotH - (alt / maxAlt) * plotH

    // ızgara + eksenler
    ctx.strokeStyle = 'rgba(148,163,184,0.15)'
    ctx.fillStyle = '#8da2bd'
    ctx.font = '11px system-ui, sans-serif'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const gy = pad.t + (plotH / 4) * i
      ctx.beginPath()
      ctx.moveTo(pad.l, gy)
      ctx.lineTo(w - pad.r, gy)
      ctx.stroke()
      const altLabel = Math.round(maxAlt * (1 - i / 4))
      ctx.fillText(String(altLabel), 6, gy + 4)
    }
    ctx.fillText('İrtifa (m)', 6, pad.t - 4)
    ctx.fillText(`Menzil → ${Math.round(maxRange)} m`, pad.l, h - 8)

    // yörünge
    if (points.length > 1) {
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      points.forEach((p, i) => {
        const x = X(p.range)
        const y = Y(p.altitude)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // güncel konum işareti
      const last = points[points.length - 1]
      if (last) {
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        ctx.arc(X(last.range), Y(last.altitude), 4, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      ctx.fillStyle = '#5b6b85'
      ctx.fillText('Veri bekleniyor…', pad.l + 8, pad.t + plotH / 2)
    }
  }, [history])

  return (
    <section className="panel trajectory-panel">
      <h2 className="panel-title">Ascent Profile · Yörünge (Menzil / İrtifa)</h2>
      <div className="panel-body trajectory-body" ref={wrapRef}>
        <canvas ref={canvasRef} />
      </div>
    </section>
  )
}
