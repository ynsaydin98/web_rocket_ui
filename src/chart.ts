// uPlot sarmalayıcısı: irtifa vs zaman zaman serisi grafiği.
// uPlot zorunlu olarak [xValues, ...series] formatında veri ister.

import uPlot from 'uplot'
import type { TelemetryPacket } from './types'

export class AltitudeChart {
  private plot: uPlot
  private readonly container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
    const opts: uPlot.Options = {
      width: container.clientWidth || 600,
      height: 280,
      cursor: { y: false },
      scales: { x: { time: false } },
      axes: [
        {
          label: 'Zaman (s)',
          stroke: '#94a3b8',
          grid: { stroke: 'rgba(148,163,184,0.12)' },
          ticks: { stroke: 'rgba(148,163,184,0.2)' },
        },
        {
          label: 'İrtifa (m)',
          stroke: '#94a3b8',
          grid: { stroke: 'rgba(148,163,184,0.12)' },
          ticks: { stroke: 'rgba(148,163,184,0.2)' },
        },
      ],
      series: [
        {},
        {
          label: 'İrtifa',
          stroke: '#38bdf8',
          fill: 'rgba(56,189,248,0.12)',
          width: 2,
          points: { show: false },
        },
      ],
    }
    this.plot = new uPlot(opts, [[], []], container)

    window.addEventListener('resize', this.handleResize)
  }

  /** Tüm geçmişten grafiği yeniden çizer. */
  update(history: readonly TelemetryPacket[]): void {
    const xs = history.map((p) => p.t)
    const ys = history.map((p) => p.altitude)
    this.plot.setData([xs, ys])
  }

  private handleResize = (): void => {
    this.plot.setSize({
      width: this.container.clientWidth || 600,
      height: 280,
    })
  }

  destroy(): void {
    window.removeEventListener('resize', this.handleResize)
    this.plot.destroy()
  }
}
