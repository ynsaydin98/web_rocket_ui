# Roket Yer İstasyonu (web_rocket_ui)

Roket yer istasyonu için MVP seviyesinde, tek sayfalı bir web arayüzü.
Vanilla **TypeScript** + **Vite** ile yazılmıştır (framework yok). Telemetri
verisi WebSocket üzerinden JSON olarak alınır; `arm` / `disarm` komutları
gönderilir ve ACK'leri beklenir.

## Özellikler

- **Tek sayfa, iki sekme:** Telemetri ve Komut
- **WebSocket bağlantısı**
  - Otomatik yeniden bağlanma (exponential backoff)
  - Bağlantı durumu göstergesi: `connected` / `disconnected` / `reconnecting`
- **Telemetri sekmesi**
  - Anlık irtifa, hız, sıcaklık
  - İrtifa / zaman zaman serisi grafiği (**uPlot**)
  - Son 500 örnek bellekte tutulur (ring buffer)
- **Komut sekmesi**
  - `ARM` / `DISARM` butonları
  - ACK bekleme, sonucu UI'da gösterme
  - 3 sn zaman aşımı durumu
- **Mimari:** küçük pub/sub store, saf parse fonksiyonları, global değişken yok
- **Kalite:** `tsconfig` strict mode açık

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc (typecheck) + vite build
npm run typecheck  # yalnızca tip kontrolü
```

Backend yokken uygulama yerleşik **mock telemetri kaynağı** ile çalışır
(uçtan uca denenebilir). Gerçek bir sunucuya bağlanmak için:

```bash
VITE_WS_URL=ws://host:port npm run dev
```

## Proje yapısı

```
web_rocket_ui/
├─ index.html
├─ tsconfig.json          # strict mode
├─ vite.config.ts
├─ public/
│  └─ rocket.svg
└─ src/
   ├─ main.ts             # composition root — modülleri bağlar
   ├─ types.ts            # TelemetryPacket, CommandAck, ...
   ├─ parser.ts           # JSON → tipli nesne (saf, test edilebilir)
   ├─ store.ts            # pub/sub state + ring buffer (MAX_SAMPLES=500)
   ├─ websocket.ts        # bağlantı yönetimi + reconnect/backoff
   ├─ commands.ts         # komut akışı + ACK eşleştirme + timeout
   ├─ chart.ts            # uPlot sarmalayıcı (irtifa/zaman)
   ├─ ui.ts               # render katmanı (store'a abone)
   ├─ mockServer.ts       # geliştirme için sahte WS kaynağı
   └─ style.css
```

### Veri akışı

```
WebSocket ─► websocket.ts ─► parser.ts ─► main.ts (router)
                                              │
                       ┌──────────────────────┴───────────────┐
                       ▼                                       ▼
              telemetry → store ──► ui.ts (abone)     ack → commands.ts → store
```

## Mesaj formatları (JSON)

**Telemetri (sunucu → istemci):**

```json
{ "type": "telemetry", "t": 12.4, "altitude": 730.5, "velocity": 117.8, "temperature": 24.3 }
```

**Komut (istemci → sunucu):**

```json
{ "type": "command", "commandId": "cmd-1718...-3", "command": "arm" }
```

**ACK (sunucu → istemci):**

```json
{ "type": "ack", "commandId": "cmd-1718...-3", "command": "arm", "status": "ok" }
```

## Test edilebilirlik

`parser.ts` içindeki tüm fonksiyonlar saftır (yan etkisiz). Örnek:

```ts
import { parseMessage } from './src/parser'

parseMessage('{"type":"telemetry","t":1,"altitude":0,"velocity":0,"temperature":15}')
// → { ok: true, value: { type: 'telemetry', ... } }

parseMessage('not json')        // → { ok: false, error: 'Geçersiz JSON' }
parseMessage('{"type":"x"}')    // → { ok: false, error: 'Tanınmayan mesaj şeması' }
```
