import { useStoreSelector } from '../../app/services'
import type { ConnectionStatus } from '../../types'

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: 'Bağlı',
  disconnected: 'Bağlantı yok',
  reconnecting: 'Yeniden bağlanıyor…',
}

/** Sağ alt köşede sabit bağlantı durumu göstergesi. */
export default function ConnectionBadge() {
  const connection = useStoreSelector((s) => s.connection)

  return (
    <div className={`conn-badge conn-${connection}`}>
      <span className="conn-dot" />
      {STATUS_LABEL[connection]}
    </div>
  )
}
