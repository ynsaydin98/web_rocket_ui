// Paket tipleri tek kaynak olarak src/packets altında tanımlıdır.
// Bu barrel, paket tiplerini ve ağ/uygulama düzeyi tipleri birlikte sunar.

export * from '../packets'

/** Bağlantı durumu (ağ katmanı; bir paket değildir). */
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'
