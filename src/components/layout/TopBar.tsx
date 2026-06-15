import { useServices, useStoreSelector } from '../../app/services'
import { useClock } from '../../lib/useClock'
import { OPERATION_MODES, type ConnectionStatus } from '../../types'

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: 'Bağlı',
  disconnected: 'Bağlantı yok',
  reconnecting: 'Yeniden bağlanıyor…',
}

export default function TopBar() {
  const { store } = useServices()
  const connection = useStoreSelector((s) => s.connection)
  const mode = useStoreSelector((s) => s.mode)
  const now = useClock()

  // Store referansı sadece lint için; doğrudan kullanılmıyor.
  void store

  const date = now.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const time = now.toLocaleTimeString('tr-TR')

  return (
    <header className="topbar">
      <div className="topbar-left">
        <img src="/rocket.svg" alt="" width="26" height="26" />
        <span className={`conn conn-${connection}`}>
          <span className="conn-dot" />
          {STATUS_LABEL[connection]}
        </span>
      </div>

      <nav className="modes" aria-label="Operasyon modu">
        <span className="modes-title">Roket Operasyon Modları</span>
        <div className="modes-list">
          {OPERATION_MODES.map((m) => (
            <span
              key={m}
              className={`mode mode-${m}${m === mode ? ' active' : ''}`}
            >
              {m}
            </span>
          ))}
        </div>
      </nav>

      <div className="topbar-right">
        <div className="clock">{time}</div>
        <div className="date">{date}</div>
      </div>
    </header>
  )
}
