// Uygulama yapılandırması.
//
// Telemetri/komut WebSocket sunucusunun adresi. Gerçek yer istasyonu
// sunucunuzun IP/Port'unu derleme/çalıştırma sırasında VITE_WS_URL ile verin:
//
//   VITE_WS_URL=ws://192.168.1.50:8080 npm run dev
//
// Tanımlı değilse aşağıdaki varsayılan kullanılır.
export const WS_URL: string = import.meta.env.VITE_WS_URL ?? 'ws://127.0.0.1:8080'
