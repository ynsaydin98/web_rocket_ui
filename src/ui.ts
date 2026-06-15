// Render katmanı. Store'a abone olur ve DOM'u günceller.
// Global state tutmaz; tüm bağımlılıklar initUI üzerinden enjekte edilir.

import { AltitudeChart } from './chart'
import type { CommandController } from './commands'
import type { AppState, Store, Tab } from './store'
import type { ConnectionStatus } from './types'

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: 'Bağlı',
  disconnected: 'Bağlantı yok',
  reconnecting: 'Yeniden bağlanıyor…',
}

/** Statik iskeleti kurar, store'a abone olur ve güncellemeleri bağlar. */
export function initUI(
  root: HTMLElement,
  store: Store<AppState>,
  controller: CommandController,
): void {
  root.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <img src="/rocket.svg" alt="" width="28" height="28" />
        <h1>Roket Yer İstasyonu</h1>
      </div>
      <div class="status" data-status>
        <span class="status-dot"></span>
        <span data-status-text>—</span>
      </div>
    </header>

    <nav class="tabs" role="tablist">
      <button class="tab" data-tab="telemetry" role="tab">Telemetri</button>
      <button class="tab" data-tab="command" role="tab">Komut</button>
    </nav>

    <main>
      <section class="panel" data-panel="telemetry">
        <div class="stats">
          <div class="card">
            <span class="card-label">İrtifa</span>
            <span class="card-value" data-altitude>—</span>
            <span class="card-unit">m</span>
          </div>
          <div class="card">
            <span class="card-label">Hız</span>
            <span class="card-value" data-velocity>—</span>
            <span class="card-unit">m/s</span>
          </div>
          <div class="card">
            <span class="card-label">Sıcaklık</span>
            <span class="card-value" data-temperature>—</span>
            <span class="card-unit">°C</span>
          </div>
        </div>
        <div class="chart-wrap">
          <h2>İrtifa / Zaman</h2>
          <div data-chart></div>
        </div>
      </section>

      <section class="panel" data-panel="command" hidden>
        <div class="command-box">
          <div class="armed-state">
            Durum: <strong data-armed>—</strong>
          </div>
          <div class="command-buttons">
            <button class="btn btn-arm" data-cmd="arm">ARM</button>
            <button class="btn btn-disarm" data-cmd="disarm">DISARM</button>
          </div>
          <div class="command-result" data-result>Komut bekleniyor.</div>
        </div>
      </section>
    </main>
  `

  // --- Element referansları ---
  const $ = <T extends Element>(sel: string): T => {
    const el = root.querySelector<T>(sel)
    if (el === null) throw new Error(`Element bulunamadı: ${sel}`)
    return el
  }

  const statusEl = $<HTMLDivElement>('[data-status]')
  const statusText = $<HTMLSpanElement>('[data-status-text]')
  const altitudeEl = $<HTMLSpanElement>('[data-altitude]')
  const velocityEl = $<HTMLSpanElement>('[data-velocity]')
  const temperatureEl = $<HTMLSpanElement>('[data-temperature]')
  const armedEl = $<HTMLElement>('[data-armed]')
  const resultEl = $<HTMLDivElement>('[data-result]')
  const chartEl = $<HTMLDivElement>('[data-chart]')
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('.tab'))
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'))

  const chart = new AltitudeChart(chartEl)

  // --- Olay bağlama ---
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      const name = tab.dataset.tab as Tab
      store.setState({ activeTab: name })
    })
  }

  root.querySelector<HTMLButtonElement>('[data-cmd="arm"]')
    ?.addEventListener('click', () => controller.arm())
  root.querySelector<HTMLButtonElement>('[data-cmd="disarm"]')
    ?.addEventListener('click', () => controller.disarm())

  // --- Render ---
  const render = (state: AppState): void => {
    // Bağlantı durumu
    statusEl.dataset.value = state.connection
    statusText.textContent = STATUS_LABEL[state.connection]

    // Sekmeler
    for (const tab of tabs) {
      tab.classList.toggle('active', tab.dataset.tab === state.activeTab)
    }
    for (const panel of panels) {
      panel.hidden = panel.dataset.panel !== state.activeTab
    }

    // Telemetri değerleri
    const t = state.latest
    altitudeEl.textContent = t ? t.altitude.toFixed(1) : '—'
    velocityEl.textContent = t ? t.velocity.toFixed(1) : '—'
    temperatureEl.textContent = t ? t.temperature.toFixed(1) : '—'

    // Grafik (yalnızca telemetri sekmesi görünürken boyutlandırma anlamlı)
    if (state.activeTab === 'telemetry') chart.update(state.history)

    // Komut paneli
    const c = state.command
    armedEl.textContent = c.armed ? 'ARMED' : 'DISARMED'
    armedEl.className = c.armed ? 'on' : 'off'
    resultEl.textContent = describeCommand(state)
    resultEl.dataset.kind = commandKind(state)
  }

  store.subscribe(render)
  render(store.getState())
}

function commandKind(state: AppState): string {
  const c = state.command
  if (c.pending) return 'pending'
  if (c.timedOut) return 'error'
  if (c.lastAck) return c.lastAck.status === 'ok' ? 'ok' : 'error'
  return 'idle'
}

function describeCommand(state: AppState): string {
  const c = state.command
  if (c.pending) return `'${c.pending.command}' gönderildi, ACK bekleniyor…`
  if (c.timedOut) return 'Zaman aşımı: 3 sn içinde ACK alınamadı.'
  if (c.lastAck) {
    const a = c.lastAck
    if (a.status === 'ok') return `ACK: '${a.command}' onaylandı.`
    return `Hata: ${a.message ?? `'${a.command}' reddedildi`}`
  }
  return 'Komut bekleniyor.'
}
