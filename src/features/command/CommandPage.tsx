import { useServices, useStoreSelector } from '../../app/services'
import Panel from '../../components/common/Panel'
import { fmtCountdown } from '../../lib/format'
import { activeStepCount, SEQUENCE } from '../../lib/sequence'
import type { AppState } from '../../lib/store'

function describe(c: AppState['command']): { text: string; kind: string } {
  if (c.pending) return { text: `'${c.pending.command}' gönderildi, ACK bekleniyor…`, kind: 'pending' }
  if (c.timedOut) return { text: 'Zaman aşımı: 3 sn içinde ACK alınamadı.', kind: 'error' }
  if (c.lastAck) {
    const a = c.lastAck
    if (a.status === 'ok') return { text: `ACK: '${a.command}' onaylandı.`, kind: 'ok' }
    return { text: `Hata: ${a.message ?? `'${a.command}' reddedildi`}`, kind: 'error' }
  }
  return { text: 'Komut bekleniyor.', kind: 'idle' }
}

export default function CommandPage() {
  const { commands, sequence } = useServices()
  const command = useStoreSelector((s) => s.command)

  const countingDown = command.countdown !== null
  const done = countingDown ? activeStepCount(command.countdown ?? 0) : 0
  const result = describe(command)

  return (
    <div className="command-page">
      <Panel title="Geri Sayım" className="countdown-panel">
        <div className={`countdown${countingDown ? ' live' : ''}`}>
          {countingDown ? fmtCountdown(command.countdown ?? 0) : 'T-00:10.0'}
        </div>
        <div className="armed-line">
          Durum:{' '}
          <strong className={command.armed ? 'on' : 'off'}>
            {command.armed ? 'ARMED' : 'DISARMED'}
          </strong>
        </div>
        <div className="cmd-buttons">
          <button
            className="btn btn-arm"
            disabled={command.armed || command.pending !== null}
            onClick={() => commands.issue('arm')}
          >
            ARM
          </button>
          <button
            className="btn btn-disarm"
            disabled={!command.armed || command.pending !== null}
            onClick={() => commands.issue('disarm')}
          >
            DISARM
          </button>
          <button
            className="btn btn-start"
            disabled={!command.armed || countingDown}
            onClick={() => sequence.start()}
          >
            Geri Sayımı Başlat
          </button>
          <button
            className="btn btn-abort"
            onClick={() => {
              sequence.stop()
              commands.issue('abort')
            }}
          >
            ABORT
          </button>
        </div>
        <div className="cmd-result" data-kind={result.kind}>
          {result.text}
        </div>
      </Panel>

      <Panel title="Fırlatma Sekansı">
        <ol className="sequence">
          {SEQUENCE.map((step, i) => {
            const state =
              !countingDown ? 'idle' : i < done ? 'done' : i === done ? 'active' : 'pending'
            return (
              <li key={step.label} className={`seq-step seq-${state}`}>
                <span className="seq-t">T-{String(step.tMinus).padStart(2, '0')}</span>
                <span className="seq-label">{step.label}</span>
                <span className="seq-mark">
                  {state === 'done' ? '✓' : state === 'active' ? '▶' : ''}
                </span>
              </li>
            )
          })}
        </ol>
      </Panel>
    </div>
  )
}
