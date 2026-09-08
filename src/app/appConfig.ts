function readOptionalNumber(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function readPositiveNumberEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export const appConfig = {
  appName: "Roket Web Arayüzü",
  brandLogoPath: "/baykar-logo.png",
  websocketUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:5000/ws",
  // Video ayri bir WebSocket ucundan ikili olarak gelir; telemetri kanalini
  // mesgul etmemesi icin kendi baglantisini kullanir.
  videoWebsocketUrl:
    import.meta.env.VITE_VIDEO_WS_URL ?? "ws://localhost:5001/ws/video",
  defaultCommandTargetId: "processor-1",
  testLatitude: readOptionalNumber(import.meta.env.VITE_TEST_LATITUDE),
  testLongitude: readOptionalNumber(import.meta.env.VITE_TEST_LONGITUDE),
  testRoll: readOptionalNumber(import.meta.env.VITE_TEST_ROLL),
  testPitch: readOptionalNumber(import.meta.env.VITE_TEST_PITCH),
  testYaw: readOptionalNumber(import.meta.env.VITE_TEST_YAW),
  // 3D roket modelinin başlangıç duruş düzeltmesi (derece). IMU
  // değerleri bu offsetlerin üzerine eklenir.
  modelRollOffset: readOptionalNumber(import.meta.env.VITE_MODEL_ROLL_OFFSET),
  modelPitchOffset: readOptionalNumber(import.meta.env.VITE_MODEL_PITCH_OFFSET),
  modelYawOffset: readOptionalNumber(import.meta.env.VITE_MODEL_YAW_OFFSET),
  telemetryUiPublishIntervalMs: readPositiveNumberEnv(
    import.meta.env.VITE_TELEMETRY_UI_PUBLISH_INTERVAL_MS,
    1000,
  ),
  debugUiPublishIntervalMs: readPositiveNumberEnv(
    import.meta.env.VITE_DEBUG_UI_PUBLISH_INTERVAL_MS,
    1000,
  ),
  debugRawMessageLimit: readPositiveNumberEnv(
    import.meta.env.VITE_DEBUG_RAW_MESSAGE_LIMIT,
    100,
  ),
  websocketReconnectDelayMs: readPositiveNumberEnv(
    import.meta.env.VITE_WS_RECONNECT_DELAY_MS,
    3000,
  ),
  videoUiPublishIntervalMs: readPositiveNumberEnv(
    import.meta.env.VITE_VIDEO_UI_PUBLISH_INTERVAL_MS,
    1000,
  ),
  // Seri port <-> UDP koprusu Vite sunucusunun icinde calisir; arayuz ayni
  // origin uzerindeki /__kopru uclarini kullanir. Kopru bagimsiz surec olarak
  // calistirilirsa (npm run kopru) bu deger tam adresle ezilir.
  kopruDurumUrl: import.meta.env.VITE_KOPRU_DURUM_URL?.trim() || "/__kopru",
  kopruDurumAralikMs: readPositiveNumberEnv(
    import.meta.env.VITE_KOPRU_DURUM_ARALIK_MS,
    1000,
  ),
} as const;
