export * from './telemetry'
export * from './command'

import type { TelemetryPacket } from './telemetry'
import type { CommandAck } from './command'

/** Sunucudan gelebilecek tüm mesaj tipleri. */
export type IncomingMessage = TelemetryPacket | CommandAck
