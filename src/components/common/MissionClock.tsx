import { useCommand } from '../../app/telemetry'
import { fmtMissionClock } from '../../lib/format'
import { COUNTDOWN_START } from '../../lib/sequence'

/**
 * Üst bar mission sayacı.
 * - Beklemede: nötr, T-00:00:10
 * - Geri sayım (T-): kırmızı
 * - Fırlatış sonrası (T+): yeşil
 */
export default function MissionClock() {
  const countdown = useCommand().countdown

  const value = countdown ?? COUNTDOWN_START
  const phase = countdown === null ? 'idle' : value > 0 ? 'down' : 'up'

  return (
    <div className={`mission-clock phase-${phase}`}>
      <span className="mission-clock-value">{fmtMissionClock(value)}</span>
    </div>
  )
}
