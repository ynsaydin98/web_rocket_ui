# Rocket Web UI

Rocket Web UI, roket yer istasyonu sistemi için geliştirilen React + TypeScript tabanlı web arayüzüdür.

Bu arayüz WebSocket üzerinden gerçek zamanlı JSON mesajları alır, mesajları `messageType` değerine göre ilgili handler'a yönlendirir, payload verisini uygun mesaj modeline ayırır, UI modeline dönüştürür ve dashboard/debug/komut ekranlarında gösterir.

Arayüz ayrıca WebSocket üzerinden servise komut mesajları gönderebilir.

## Amaç

Bu projenin amacı:

- Roketten gelen telemetri verilerini gerçek zamanlı göstermek
- WebSocket üzerinden gelen JSON mesajlarını işlemek
- Mesaj tipine göre payload deserialize etmek
- Büyük mesaj modellerini sade UI modellerine dönüştürmek
- Komutları WebSocket üzerinden servise göndermek
- Komutlarda UI üzerinden girilen değerleri payload olarak göndermek
- Geliştirme sırasında ham JSON mesajlarını debug ekranında göstermek
- Modüler, geliştirilebilir ve bakımı kolay bir web arayüzü oluşturmak

## Teknolojiler

- React
- TypeScript
- Vite
- WebSocket
- Zustand
- React Router

İlerleyen aşamalarda ihtiyaç oldukça grafik ve tablo kütüphaneleri eklenebilir.

Örnek:

- Recharts
- TanStack Table

## Mimari Kurallar

- Servisler gerçek mesaj modelini yayınlar.
- Web UI kendi UI modelini üretir.
- UI modeller servis tarafına taşınmaz.
- React component içinde WebSocket parse işlemi yapılmaz.
- React component içinde doğrudan mesaj mapping yapılmaz.
- Gelen mesajlar önce `RealtimeMessageEnvelope` olarak parse edilir.
- Mesajlar `messageType` değerine göre dispatcher/handler yapısı ile işlenir.
- Komutlar `CommandEnvelope` ile gönderilir.
- Komutlarda `messageType`, komutun ait olduğu paket/model tipini belirtir.
- Komutlarda `commandType`, ilgili paket/model içindeki komutu belirtir.
- Payload isteyen komutlarda değerler UI inputlarından alınır ve payload içerisine yazılır.
- Anlamlı her mimari/özellik değişikliğinde `README.md` güncellenir.

## Gelen Mesaj Formatı

Servisten WebSocket üzerinden gelen mesaj formatı:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "payload": {}
}
```

TypeScript karşılığı:

```ts
export type RealtimeMessageEnvelope<TPayload = unknown> = {
  id: string;
  messageType: string;
  payload: TPayload;
};
```

Bu yapıda:

- `id`: mesajın geldiği işlemci/route/servis kimliğidir.
- `messageType`: payload modelinin adıdır.
- `payload`: ilgili mesaj modelinin JSON karşılığıdır.

Örnek:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "payload": {
    "irtifa": 1200,
    "hiz": 340,
    "batarya": 24.6,
    "durumKodu": 2
  }
}
```

## Giden Komut Formatı

Web UI tarafından servise gönderilecek komut formatı:

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftReset",
  "payload": {}
}
```

TypeScript karşılığı:

```ts
export type CommandEnvelope<TPayload = unknown> = {
  id: string;
  messageType: string;
  commandType: string;
  payload: TPayload;
};
```

Bu yapıda:

- `id`: komutun hedef/route/işlemci bilgisidir.
- `messageType`: komutun ait olduğu paket/model tipidir.
- `commandType`: ilgili paket/model içindeki komut adıdır.
- `payload`: komuta özel parametrelerdir.

Örneğin arayüzde buton adı `Reset` olabilir, fakat servise gönderilen protokol komutu `commandType: "SoftReset"` olabilir.

## Payload İçermeyen Komut Örneği

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftReset",
  "payload": {}
}
```

Bu örnekte:

- UI üzerindeki buton adı `Reset` olabilir.
- Servise giden gerçek komut adı `SoftReset` olur.
- Payload boş gönderilir.

## Payload İçeren Komut Örneği

```json
{
  "id": "processor-1",
  "messageType": "RoketTelemetriPaket",
  "commandType": "SoftResetWithPayload",
  "payload": {
    "reason": "UserRequest",
    "delayMs": 1000
  }
}
```

Bu örnekte:

- UI üzerinde `reason` ve `delayMs` için input alanları bulunur.
- Butona basıldığında input değerleri okunur.
- Okunan değerler payload içerisine yazılır.
- Komut WebSocket üzerinden servise gönderilir.

## Önerilen Gelen Veri Akışı

```text
WebSocket JSON
  ↓
RealtimeMessageEnvelope
  ↓
RealtimeDispatcher
  ↓
Message Handler
  ↓
Message Model
  ↓
Mapper
  ↓
UI Model
  ↓
Zustand Store
  ↓
React Component
```

## Önerilen Komut Akışı

```text
React Command Component
  ↓
Input değerleri okunur
  ↓
Command Factory
  ↓
CommandEnvelope
  ↓
Command Sender
  ↓
WebSocket Send
  ↓
Packet Service
  ↓
messageType + commandType ile komut anlamlandırma
  ↓
UDP / Roket Komut Katmanı
```

## Mevcut İlk Altyapı

Şu anda projede bulunan temel parçalar:

- WebSocket bağlantı servisi
- Bağlantı durum store'u
- Debug ekranında ham JSON gösterimi
- Realtime dispatcher iskeleti
- İlk örnek telemetri handler'ı
- Dashboard telemetri özet kartları
- Komut gönderme altyapısı
- `RoketTelemetriPaket / SoftReset` boş payload örnek komutu
- `RoketTelemetriPaket / SoftResetWithPayload` payload içeren örnek komutu
- Payload içeren komutlarda UI input değerlerini okuyup payload oluşturma
- Dashboard, komut ve debug alanlarının page componentlerine ayrılması

## Proje Yapısı

```text
src/
 ├── app/
 │   ├── App.tsx
 │   └── appConfig.ts
 │
 ├── shared/
 │   ├── components/
 │   ├── utils/
 │   └── types/
 │
 ├── contracts/
 │   ├── realtimeMessageEnvelope.ts
 │   ├── commandEnvelope.ts
 │   └── messageTypes.ts
 │
 ├── realtime/
 │   ├── websocketClient.ts
 │   ├── connectionStore.ts
 │   ├── realtimeDispatcher.ts
 │   ├── registerRealtimeHandlers.ts
 │   └── handlers/
 │       └── roketTelemetriHandler.ts
 │
 ├── features/
 │   ├── dashboard/
 │   │   ├── components/
 │   │   │   ├── AtmosphereMotionPanel.tsx
 │   │   │   ├── PositionNavigationPanel.tsx
 │   │   │   ├── TelemetryDataTable.tsx
 │   │   │   ├── TelemetrySummaryCards.tsx
 │   │   │   └── VehicleOverviewPanel.tsx
 │   │   ├── models/
 │   │   ├── mappers/
 │   │   └── store/
 │   │
 │   ├── telemetry/
 │   │   ├── components/
 │   │   ├── commands/
 │   │   │   ├── roketTelemetriCommands.ts
 │   │   │   └── roketTelemetriCommandFactory.ts
 │   │   ├── messages/
 │   │   │   └── roketTelemetriPaket.ts
 │   │   ├── models/
 │   │   │   └── roketOzetUiModel.ts
 │   │   ├── mappers/
 │   │   │   └── roketTelemetriMapper.ts
 │   │   └── store/
 │   │       └── telemetryStore.ts
 │   │
 │   ├── commands/
 │   │   ├── components/
 │   │   │   └── CommandPanel.tsx
 │   │   ├── services/
 │   │   │   └── commandSender.ts
 │   │   └── store/
 │   │       └── commandStore.ts
 │   │
 │   └── debug/
 │       ├── components/
 │       │   ├── ConnectionStatus.tsx
 │       │   └── RawMessageViewer.tsx
 │       └── store/
 │           └── debugStore.ts
 │
 └── pages/
    ├── DashboardPage.tsx
    ├── TelemetryPage.tsx
    ├── TablesPage.tsx
    ├── CommandsPage.tsx
    └── DebugPage.tsx
```

## Klasör Sorumlulukları

### `src/app`

Uygulama giriş noktası ve genel uygulama ayarları.

Örnek:

- `App.tsx`
- `appConfig.ts`

### `src/contracts`

WebSocket üzerinden gelen/giden JSON formatlarının TypeScript karşılıkları.

Burada bulunabilir:

- `RealtimeMessageEnvelope`
- `CommandEnvelope`
- `MessageTypes`

Burada bulunmamalı:

- React component
- UI model
- Zustand store
- Sayfa bileşeni
- Paket/feature özel command type listeleri

### `src/realtime`

WebSocket bağlantısı, mesaj yönlendirme ve realtime handler yapısı.

Burada bulunabilir:

- `websocketClient`
- `connectionStore`
- `realtimeDispatcher`
- handler kayıtları

Burada bulunmamalı:

- React render logic
- UI component
- Sayfaya özel state
- UI model

### `src/features`

Modül bazlı özellikler burada yer alır.

Örnek feature modülleri:

- `dashboard`
- `telemetry`
- `commands`
- `debug`

Her feature kendi içinde şu yapıları barındırabilir:

- `components`
- `models`
- `messages`
- `mappers`
- `store`
- `services`
- `commands`

Paket/model özel komutlar ilgili feature altında tutulur.

Örnek:

```text
features/telemetry/commands/roketTelemetriCommands.ts
features/telemetry/commands/roketTelemetriCommandFactory.ts
```

### `src/features/commands`

Genel komut gönderme altyapısını içerir.

Burada bulunabilir:

- Genel command panel
- Command sender
- Command store

Burada bulunmamalı:

- Paket/model özel command sabitleri
- Paket/model özel command factory'leri

### `src/shared`

Birden fazla feature tarafından kullanılabilecek ortak parçalar.

Örnek:

- Ortak componentler
- Yardımcı fonksiyonlar
- Ortak tipler

### `src/pages`

Sayfa seviyesindeki componentler burada yer alır. Page componentleri feature componentlerini bir araya getirir.

## Ortam Değişkenleri

`.env` dosyası:

```env
VITE_WS_URL=ws://localhost:5000/ws
VITE_TEST_LATITUDE=41.0082
VITE_TEST_LONGITUDE=28.9784
VITE_TEST_ROLL=12.5
VITE_TEST_PITCH=-4.2
VITE_TEST_YAW=145
```

`.env.example` dosyası:

```env
VITE_WS_URL=ws://localhost:5000/ws
VITE_TEST_LATITUDE=
VITE_TEST_LONGITUDE=
VITE_TEST_ROLL=0
VITE_TEST_PITCH=0
VITE_TEST_YAW=0
```

`VITE_TEST_LATITUDE`, `VITE_TEST_LONGITUDE`, `VITE_TEST_ROLL`, `VITE_TEST_PITCH` ve `VITE_TEST_YAW` geliştirme ortamında harita ve yönelim göstergelerini test etmek için kullanılabilir. Canlı telemetri mesajındaki değerler test değerlerinin önüne geçer. Ortam değişkeni değiştirildikten sonra Vite geliştirme sunucusu yeniden başlatılmalıdır.

## Uygulama Ayarları

`src/app/appConfig.ts` içinde uygulama genel ayarları bulunur.

Örnek:

```ts
export const appConfig = {
  appName: "Rocket Web UI",
  websocketUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:5000/ws",
  defaultCommandTargetId: "processor-1",
} as const;
```

Burada:

- `websocketUrl`: WebSocket bağlantı adresidir.
- `defaultCommandTargetId`: komut gönderiminde varsayılan hedef/route/işlemci bilgisidir.

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
npm run dev
```

## Build

```bash
npm run build
```

## İlk Geliştirme Hedefleri

Tamamlananlar:

- WebSocket bağlantı servisi
- Bağlantı durum store'u
- Debug ekranında ham JSON gösterimi
- Realtime dispatcher iskeleti
- İlk örnek telemetri handler'ı
- Dashboard telemetri özet kartları
- Komut gönderme altyapısı
- Paket/model bazlı komut yapısı
- Payloadsız komut örneği
- Payload içeren komut örneği
- UI input değerlerinden payload oluşturma
- Komut panelini daha modüler hale getirmek
- Genel komut paneli ile paket/model özel komut paneli ayrımı
- Sayfa yapısının `pages` altında ayrıştırılması

Sıradaki işler:

- Paket/model özel komut panellerini ayırmak
- Form doğrulama yapısını iyileştirmek
- Gerçek roket mesaj modellerinin eklenmesi
- Telemetri alanlarının detaylandırılması
- Dashboard tasarımının iyileştirilmesi
- Debug/test mesaj üretimi
- Grafik ve tablo bileşenlerinin eklenmesi

## UI Tasarım Yönü

Arayüz koyu temalı roket görev kontrol paneli tarzında geliştirilecektir.

Temel hedefler:

- Koyu lacivert/siyah arka plan
- İnce mavi border'lı paneller
- Kompakt telemetri yazıları
- Üstte görev bilgisi ve durum göstergeleri
- Sayfa bazlı navigation yapısı
- Dashboard, Grafikler, Komut & Sekans ve Debug sayfaları
- Kart/panel tabanlı düzen
- Bağlantı, operasyon modu, alarm ve komut durumları için net görsel göstergeler

Sayfa yapısı:

```text
/
  Dashboard

/telemetry
  Grafikler ve telemetri detayları

/tables
  Model tabloları

/commands
  Komut & Sekans

/debug
  WebSocket/debug mesajları
```

## README Güncelleme Kuralı

Aşağıdaki değişikliklerde `README.md` güncellenmelidir:

- Yeni modül eklenirse
- Proje klasör yapısı değişirse
- WebSocket mesaj formatı değişirse
- `CommandEnvelope` formatı değişirse
- Komut anlamlandırma kuralı değişirse
- Yeni ortam değişkeni eklenirse
- Kurulum/çalıştırma adımları değişirse
- Yeni ana özellik eklenirse
- Mimari karar değişirse

Sadece küçük görsel/CSS değişikliklerinde README güncellemek zorunlu değildir.

## Route Tabanlı UI Altyapısı

Uygulama `react-router-dom` ve `BrowserRouter` ile çalışan kalıcı bir görev kontrol kabuğu kullanır. `AppShell`; görev üst barını, route sekmelerini, aktif sayfa alanını ve sistem alt bilgisini bir araya getirir.

Mevcut route'lar:

```text
/           Ana Sayfa
/telemetry  Grafikler ve telemetri
/tables/unit-1  Ünite 1 model tabloları
/tables/unit-2  Ünite 2 model tabloları
/commands   Komut & Sekans
/debug      Debug konsolu
```

Ortak görsel bileşenler `src/shared/components` altında bulunur: `AppShell`, `TopBar`, `PageTabs`, `Panel`, `MetricCard`, `StatusBadge` ve `JsonViewer`.

Sayfa componentleri yalnızca feature ve shared componentleri birleştirir. Komut üretimi feature command factory'lerinde, realtime mesaj işleme dispatcher/handler katmanında, UI state ise mevcut Zustand store'larında kalır.

Ana sayfa geniş ekran görev kontrol görünümü kullanır. Sol panel GNSS, harita ve yönelim alanlarını; merkez panel roket görselleştirmesi ve yapay ufku; sağ panel atmosfer, IMU, güç ve olay kayıtlarını gösterir. Genel telemetri tablosu bu panellerin altında yer alır. Mevcut telemetri modelinde bulunmayan diğer sensör değerleri `--` placeholder değeriyle gösterilir.

Merkez araç görselleştirmesi Three.js ile prosedürel olarak oluşturulan gerçek bir WebGL sahnesidir. Roket fare veya dokunma ile döndürülebilir, tekerlek veya pinch hareketiyle yakınlaştırılabilir ve boşta yavaşça otomatik döner.

Telemetri payload'ındaki opsiyonel `enlem` ve `boylam` değerleri geldiğinde ana sayfadaki OpenStreetMap görünümü roketin güncel koordinatına odaklanır. Bu alanlar bulunmadığında harita alanı konum verisi beklediğini gösterir; dekoratif veya sahte rota çizilmez.

Opsiyonel `roll`, `pitch` ve `yaw` telemetri değerleri yönelim panelini canlı olarak hareket ettirir. `roll` yapay ufku döndürür, `pitch` ufuk çizgisini dikey hareket ettirir ve `yaw` pusula yönünü belirler.
