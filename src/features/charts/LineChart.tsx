// uPlot tabanlı, yeniden kullanılabilir zaman serisi grafiği.

import { useEffect, useRef } from 'react'
import uPlot from 'uplot'

export interface SeriesSpec {
  label: string
  color: string
  /** Her örnekten Y değerini çıkaran fonksiyon. */
  accessor: (i: number) => number
}

interface Props {
  title: string
  unit: string
  xValues: number[]
  series: SeriesSpec[]
}

export default function LineChart({ title, unit, xValues, series }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<uPlot | null>(null)

  // Grafiği bir kez oluştur.
  useEffect(() => {
    const host = hostRef.current
    if (host === null) return

    const opts: uPlot.Options = {
      title,
      width: host.clientWidth || 600,
      height: 240,
      cursor: { y: false },
      scales: { x: { time: false } },
      legend: { show: series.length > 1 },
      axes: [
        { stroke: '#94a3b8', grid: { stroke: 'rgba(148,163,184,0.12)' } },
        {
          stroke: '#94a3b8',
          grid: { stroke: 'rgba(148,163,184,0.12)' },
          label: unit,
        },
      ],
      series: [
        { label: 'T (s)' },
        ...series.map((s) => ({
          label: s.label,
          stroke: s.color,
          width: 2,
          points: { show: false },
        })),
      ],
    }

    const empty = [[], ...series.map(() => [])] as unknown as uPlot.AlignedData
    const plot = new uPlot(opts, empty, host)
    plotRef.current = plot

    const onResize = () =>
      plot.setSize({ width: host.clientWidth || 600, height: 240 })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      plot.destroy()
      plotRef.current = null
    }
    // Grafik yapısı (başlık/seriler) sabit; veri ayrı effect'te güncellenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Veri değiştikçe güncelle.
  useEffect(() => {
    const plot = plotRef.current
    if (plot === null) return
    const ys = series.map((s) => xValues.map((_, i) => s.accessor(i)))
    plot.setData([xValues, ...ys] as unknown as uPlot.AlignedData)
  }, [xValues, series])

  return <div className="chart" ref={hostRef} />
}
