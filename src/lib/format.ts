// Görüntüleme yardımcıları (saf).

export function fmt(value: number | undefined, digits = 1): string {
  return value === undefined ? '—' : value.toFixed(digits)
}

/** Saniyeyi T-eksi/T-artı biçiminde gösterir. */
export function fmtCountdown(seconds: number): string {
  const sign = seconds > 0 ? '-' : '+'
  const abs = Math.abs(seconds)
  const m = Math.floor(abs / 60)
  const s = (abs % 60).toFixed(1).padStart(4, '0')
  return `T${sign}${String(m).padStart(2, '0')}:${s}`
}

/** Mission saati: T±HH:MM:SS (üst bar sayacı). */
export function fmtMissionClock(seconds: number): string {
  const sign = seconds > 0 ? '-' : '+'
  const abs = Math.floor(Math.abs(seconds))
  const hh = String(Math.floor(abs / 3600)).padStart(2, '0')
  const mm = String(Math.floor((abs % 3600) / 60)).padStart(2, '0')
  const ss = String(abs % 60).padStart(2, '0')
  return `T${sign}${hh}:${mm}:${ss}`
}

/** ISO UTC string'inden HH:MM:SS üretir. */
export function fmtUtc(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toISOString().slice(11, 19) + ' UTC'
}
