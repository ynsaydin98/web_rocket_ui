// Static configuration for the propulsion test-stand Mission Control page:
// sensor characteristics (used for axis scaling / gauge coloring) and the
// 4-phase mission sequence (BEKLEMEDE/GERİ SAYIM/ATEŞLEME/TAMAMLANDI) driven
// by the real MKUItkiDiagnostikPaket telemetry pipeline (itkiOpDurumlari).
// There is no local simulation any more — see store/missionControlStore.ts.

export type SensorId =
  | "PT-01"
  | "PT-02"
  | "TC-01"
  | "PT-03"
  | "PT-04"
  | "PT-05"
  | "TC-02";

export type SensorConfig = {
  desc: string;
  unit: string;
  axis: [number, number];
  warnHi: number;
  alarmHi: number;
  warnLo?: number;
};

export const SENSORS: Record<SensorId, SensorConfig> = {
  "PT-01": { desc: "Oksitleyici Çıkış Bas.", unit: "bar", axis: [0, 60], warnHi: 50, alarmHi: 58 },
  "PT-02": { desc: "Oksitleyici Tank Bas.", unit: "bar", axis: [0, 70], warnHi: 62, alarmHi: 66 },
  "TC-01": { desc: "Oksitleyici Sıcaklığı", unit: "°C", axis: [-40, 40], warnHi: 20, alarmHi: 32, warnLo: -30 },
  "PT-03": { desc: "Yanma Odası Bas. #1", unit: "bar", axis: [0, 55], warnHi: 44, alarmHi: 50 },
  "PT-04": { desc: "Yanma Odası Bas. #2", unit: "bar", axis: [0, 55], warnHi: 44, alarmHi: 50 },
  "PT-05": { desc: "Manifold Alt Basınç", unit: "bar", axis: [0, 45], warnHi: 38, alarmHi: 42 },
  "TC-02": { desc: "Yanma Odası Sıcaklığı", unit: "°C", axis: [0, 2600], warnHi: 2400, alarmHi: 2550 },
};

/**
 * Real mission phase, driven by the itkiOpDurumlari code on the MKU itki
 * diagnostik packet (see mapItkiOpDurumlariToOpMod in mappers/itkiOpModMapper.ts).
 * The 4 values are confirmed; the numeric codes 0/1/2/3 mapping onto them
 * are a PLACEHOLDER pending the real protocol document.
 */
export type OpMod = "BEKLEMEDE" | "GERİ SAYIM" | "ATEŞLEME" | "TAMAMLANDI";

/** Ordered sequence backing the 4-row sequence panel; index = done/active/pending ordinal. */
export const OP_MOD_SEQUENCE: OpMod[] = ["BEKLEMEDE", "GERİ SAYIM", "ATEŞLEME", "TAMAMLANDI"];

/** How long the emergency-stop unlock stays armed after the lock is opened. */
export const ABORT_UNLOCK_MS = 10_000;

export const STATUS_COLORS = {
  SAFE: "#39e08a",
  ARMED: "#ffb020",
  FIRING: "#ff6a2a",
  ABORT: "#ff4d4d",
} as const;

export type MissionStatus = keyof typeof STATUS_COLORS;
