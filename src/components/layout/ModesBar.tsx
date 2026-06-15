import { useStoreSelector } from '../../app/services'
import { OPERATION_MODES } from '../../types'

/** Operasyon modu şeridi (üst barın altında, ortalı). */
export default function ModesBar() {
  const mode = useStoreSelector((s) => s.mode)

  return (
    <div className="modesbar">
      <span className="modesbar-title">Roket Operasyon Modları</span>
      <div className="modesbar-list">
        {OPERATION_MODES.map((m) => (
          <span key={m} className={`mode mode-${m}${m === mode ? ' active' : ''}`}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
