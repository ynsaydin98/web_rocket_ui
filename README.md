# Roket Yer İstasyonu (web_rocket_ui)

Roket yer istasyonu için MVP seviyesinde bir web arayüzü.
**React + TypeScript + Vite** ile yazılmıştır. Ana sayfada **Falcon 9** 3D
modeli (Three.js), çevresinde GNSS / Barometre / IMU panelleri; üstte
operasyon modu bar'ı ve canlı saat; ayrı bir grafik sekmesi ve bir
komut/sekans/geri sayım sekmesi yer alır. Telemetri WebSocket üzerinden JSON
olarak alınır.

## Özellikler

- **Üst bar**
  - Ortada operasyon modları: `GUVENLI` · `HAZIRLIK` · `ATESLEME` · `SEYIR` (aktif olan vurgulanır)
  - Sağ üstte canlı saat ve tarih
  - Solda bağlantı durumu: `connected` / `disconnected` / `reconnecting`
- **Ana Sayfa**
  - Ortada **Falcon 9 3D modeli** (`.obj`, döndürülebilir/yakınlaştırılabilir)
  - **GNSS:** görülen uydu sayısı, enlem/boylam, yükseklik, hız, yönelim, UTC
  - **Barometre:** basınç, yükseklik, sıcaklık
  - **IMU:** ivme (x/y/z), gyro (x/y/z), roll/pitch/yaw
- **Grafikler** (ayrı sekme, **uPlot**): irtifa / hız / basınç / sıcaklık — zamana karşı
- **Komut & Sekans** (ayrı sekme)
  - `ARM` / `DISARM` / `ABORT` komutları, ACK bekleme + 3 sn timeout
  - **Geri sayım** (T-eksi) ve fırlatma **sekans** adımları
  - T-0'da otomatik `ignite` komutu
- **WebSocket:** otomatik yeniden bağlanma (exponential backoff)
- **Mimari:** pub/sub store, saf parse fonksiyonları, global değişken yok
- **Kalite:** `tsconfig` strict mode açık; son 500 telemetri örneği bellekte

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc (typecheck) + vite build
npm run typecheck  # yalnızca tip kontrolü
npm run gen:model  # falcon9.obj modelini yeniden üret
```

Backend yokken uygulama yerleşik **mock telemetri kaynağı** ile çalışır.
Mock başta `GUVENLI`'dir; **ARM** → `HAZIRLIK`, geri sayım sonunda
**ignite** → `ATESLEME` → birkaç saniye sonra `SEYIR` (roket tırmanır,
grafikler dolar). Gerçek bir sunucuya bağlanmak için:

```bash
VITE_WS_URL=ws://host:port npm run dev
```

## Proje yapısı

```
web_rocket_ui/
├─ index.html
├─ tsconfig.json
├─ vite.config.ts
├─ scripts/
│  └─ genFalcon9.mjs            # 3D modeli üreten script
└─ src/
   ├─ main.tsx                  # React giriş
   ├─ App.tsx                   # sekme yönlendirmesi
   ├─ app/
   │  └─ services.tsx           # composition root + store context + useStore
   ├─ types/                    # telemetry.ts, command.ts, index.ts
   ├─ lib/                      # framework-bağımsız çekirdek
   │  ├─ parser.ts              # JSON → tipli nesne (saf, test edilebilir)
   │  ├─ store.ts               # pub/sub state + ring buffer (MAX_SAMPLES=500)
   │  ├─ websocket.ts           # bağlantı yönetimi + reconnect/backoff
   │  ├─ commands.ts            # komut akışı + ACK + 3 sn timeout
   │  ├─ sequence.ts            # geri sayım + fırlatma sekansı
   │  ├─ mockServer.ts          # geliştirme için sahte WS kaynağı
   │  ├─ format.ts, useClock.ts # yardımcılar
   ├─ components/
   │  ├─ layout/                # TopBar, Tabs
   │  └─ common/                # Panel, Stat
   ├─ features/
   │  ├─ home/                  # RocketViewer + GNSS/Barometre/IMU panelleri
   │  ├─ charts/                # LineChart + ChartsPage
   │  └─ command/               # CommandPage (komut + sekans + geri sayım)
   ├─ assets/models/falcon9.obj # 3D model (stilize, değiştirilebilir)
   └─ styles/global.css
```

> **3D model notu:** `src/assets/models/falcon9.obj` `scripts/genFalcon9.mjs`
> ile üretilmiş **stilize bir yer tutucudur**. Gerçek bir Falcon 9 `.obj`
> dosyanız varsa aynı yola koyup üzerine yazmanız yeterli.

## Mesaj formatları (JSON)

**Telemetri (sunucu → istemci):**

```json
{
  "type": "telemetry",
  "t": 12.4,
  "mode": "SEYIR",
  "gnss": { "satellites": 12, "latitude": 41.015, "longitude": 28.979,
            "altitude": 730.5, "speed": 117.8, "heading": 92.0,
            "utc": "2026-06-15T15:00:00.000Z" },
  "barometer": { "pressure": 932.1, "altitude": 731.0, "temperature": 9.8 },
  "imu": { "accel": { "x": 0.1, "y": 22.0, "z": 9.8 },
           "gyro": { "x": 1.2, "y": -0.4, "z": 0.8 },
           "roll": 2.1, "pitch": 80.4, "yaw": 92.0 }
}
```

**Komut (istemci → sunucu):** `command` ∈ `arm` · `disarm` · `ignite` · `abort`

```json
{ "type": "command", "commandId": "cmd-...-3", "command": "arm" }
```

**ACK (sunucu → istemci):**

```json
{ "type": "ack", "commandId": "cmd-...-3", "command": "arm", "status": "ok" }
```

## Test edilebilirlik

`src/lib/parser.ts` içindeki tüm fonksiyonlar saftır (yan etkisiz),
böylece birim testleri için idealdir:

```ts
import { parseMessage } from './src/lib/parser'

parseMessage('not json')      // → { ok: false, error: 'Geçersiz JSON' }
parseMessage('{"type":"x"}')  // → { ok: false, error: 'Tanınmayan mesaj şeması' }
```
