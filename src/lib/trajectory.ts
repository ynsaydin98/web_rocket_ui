// Ascent Profile / yörünge hesabı (saf).
// Gelen IMU (ivme + tutum/gyro) ve barometre (basınç → irtifa) verilerinden
// basit bir ölü-hesap (dead reckoning) ile yatay menzil ve irtifa üretir.

import type { TelemetryPacket } from '../packets'

export interface TrajPoint {
  /** Yatay menzil, metre. */
  range: number
  /** İrtifa, metre. */
  altitude: number
}

const DEG2RAD = Math.PI / 180

/**
 * Telemetri geçmişinden yörünge noktalarını üretir.
 * - İrtifa: barometre (basınç kaynaklı) yüksekliği.
 * - Menzil: ileri ivmenin tutum açısına (pitch) izdüşümünün iki kez integrali.
 *   pitch 90° = dik tırmanış (menzil ~0), küçük pitch = daha yatay (menzil artar).
 */
export function computeTrajectory(history: readonly TelemetryPacket[]): TrajPoint[] {
  const points: TrajPoint[] = []
  let vx = 0
  let range = 0
  let prevT: number | null = null

  for (const p of history) {
    const dt = prevT === null ? 0 : Math.max(0, Math.min(1, p.t - prevT))
    prevT = p.t

    // İleri eksen ivmesi (yerçekimi çıkarılmış kaba değer).
    const aForward = p.imu.accel.y
    // Tutum: pitch'in dikten sapması kadar yatay bileşen.
    const aHoriz = aForward * Math.cos(p.imu.pitch * DEG2RAD)

    vx += aHoriz * dt
    range += vx * dt

    points.push({ range, altitude: p.barometer.altitude })
  }

  return points
}
