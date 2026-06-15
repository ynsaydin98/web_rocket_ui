// İSTEĞE BAĞLI test sunucusu — gerçek yer istasyonu donanımınız yokken
// arayüzü denemek içindir. Uygulamanın parçası DEĞİLDİR; UI'a dummy veri
// koymaz. Gerçek bir WebSocket sunucusu gibi, arayüzün beklediği JSON
// paketlerini yayınlar ve komut paketlerine ACK döner.
//
// Çalıştırma:  npm run mock:server   (varsayılan: ws://127.0.0.1:8080)
// Sonra:       VITE_WS_URL=ws://127.0.0.1:8080 npm run dev
//
// Üretimde bu dosyaya gerek yoktur; kendi sunucunuzun adresini
// VITE_WS_URL ile verirsiniz.

import { WebSocketServer } from 'ws'

const PORT = Number(process.env.PORT ?? 8080)
const HOST = process.env.HOST ?? '127.0.0.1'

const wss = new WebSocketServer({ host: HOST, port: PORT })
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

console.log(`[mock-ws] dinleniyor: ws://${HOST}:${PORT}`)

wss.on('connection', (socket) => {
  console.log('[mock-ws] istemci bağlandı')
  let t = 0
  let mode = 'GUVENLI'
  let flightStart = 0

  const interval = setInterval(() => {
    t += 0.2
    const flightT = flightStart > 0 ? t - flightStart : 0
    if (mode === 'ATESLEME' && flightT > 4) mode = 'SEYIR'

    const flying = mode === 'ATESLEME' || mode === 'SEYIR'
    const altitude = flying ? 0.5 * 22 * flightT * flightT : 0
    const speed = flying ? 22 * flightT : 0
    const heading = (90 + flightT * 1.5) % 360

    const packet = {
      type: 'telemetry',
      t: round(t, 2),
      mode,
      gnss: {
        satellites: flying ? 12 : 8,
        latitude: round(41.015 + altitude * 1e-6, 6),
        longitude: round(28.979 + altitude * 5e-7, 6),
        altitude: round(altitude, 1),
        speed: round(speed, 1),
        heading: round(heading, 1),
        utc: new Date().toISOString(),
      },
      barometer: {
        pressure: round(1013.25 * Math.exp(-altitude / 8400), 2),
        altitude: round(altitude, 1),
        temperature: round(15 - altitude * 0.0065, 1),
      },
      imu: {
        accel: { x: round(Math.sin(t) * 0.3, 2), y: round((flying ? 22 : 0), 2), z: 9.81 },
        gyro: { x: round(Math.sin(t) * 4, 2), y: round(Math.cos(t) * 4, 2), z: round(Math.sin(t * 1.4) * 2, 2) },
        roll: round(Math.sin(t * 0.5) * 6, 1),
        pitch: round(flying ? 80 : 0, 1),
        yaw: round(heading, 1),
      },
    }
    socket.send(JSON.stringify(packet))
  }, 200)

  socket.on('message', (raw) => {
    let cmd
    try {
      cmd = JSON.parse(raw.toString())
    } catch {
      return
    }
    if (cmd?.type !== 'command') return
    console.log('[mock-ws] komut:', cmd.command)

    if (cmd.command === 'arm') mode = 'HAZIRLIK'
    else if (cmd.command === 'ignite') { mode = 'ATESLEME'; flightStart = t }
    else if (cmd.command === 'disarm' || cmd.command === 'abort') { mode = 'GUVENLI'; flightStart = 0 }

    const ack = {
      type: 'ack',
      commandId: cmd.commandId,
      command: cmd.command,
      status: 'ok',
    }
    setTimeout(() => socket.send(JSON.stringify(ack)), 300)
  })

  socket.on('close', () => {
    clearInterval(interval)
    console.log('[mock-ws] istemci ayrıldı')
  })
})
