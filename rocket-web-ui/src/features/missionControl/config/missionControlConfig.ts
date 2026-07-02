// Static simulation configuration for the propulsion test-stand Mission
// Control demo: sensor characteristics, sequence steps and the per-phase
// target values the simulated sensors settle toward.

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
  /** Response rate toward the phase target (higher = faster settle). */
  k: number;
  /** Amplitude of simulated measurement noise. */
  noise: number;
};

export const SENSORS: Record<SensorId, SensorConfig> = {
  "PT-01": { desc: "Oksitleyici Çıkış Bas.", unit: "bar", axis: [0, 60], warnHi: 50, alarmHi: 58, k: 5, noise: 0.35 },
  "PT-02": { desc: "Oksitleyici Tank Bas.", unit: "bar", axis: [0, 70], warnHi: 62, alarmHi: 66, k: 2, noise: 0.3 },
  "TC-01": { desc: "Oksitleyici Sıcaklığı", unit: "°C", axis: [-40, 40], warnHi: 20, alarmHi: 32, warnLo: -30, k: 1.5, noise: 0.5 },
  "PT-03": { desc: "Yanma Odası Bas. #1", unit: "bar", axis: [0, 55], warnHi: 44, alarmHi: 50, k: 6, noise: 0.8 },
  "PT-04": { desc: "Yanma Odası Bas. #2", unit: "bar", axis: [0, 55], warnHi: 44, alarmHi: 50, k: 6, noise: 0.8 },
  "PT-05": { desc: "Manifold Alt Basınç", unit: "bar", axis: [0, 45], warnHi: 38, alarmHi: 42, k: 5, noise: 0.5 },
  "TC-02": { desc: "Yanma Odası Sıcaklığı", unit: "°C", axis: [0, 2600], warnHi: 2400, alarmHi: 2550, k: 4, noise: 22 },
};

export const SENSOR_ORDER: SensorId[] = [
  "PT-01",
  "PT-02",
  "TC-01",
  "PT-03",
  "PT-04",
  "PT-05",
  "TC-02",
];

export type StepId =
  | "IDLE"
  | "PRECHECK"
  | "ARM"
  | "BACKUP"
  | "MAINVALVE"
  | "IGNITION"
  | "BURN"
  | "SHUTDOWN";

export type SequenceStep = {
  id: StepId;
  label: string;
  /** Duration in seconds; Infinity for the resting IDLE step. */
  dur: number;
};

export const STEPS: SequenceStep[] = [
  { id: "IDLE", label: "IDLE / SAFE", dur: Infinity },
  { id: "PRECHECK", label: "Pre-check (sensör)", dur: 3 },
  { id: "ARM", label: "ARM / Kollama", dur: 2.5 },
  { id: "BACKUP", label: "Yedek Vana Hazırlık", dur: 2 },
  { id: "MAINVALVE", label: "İtki Vanası Aç", dur: 2.5 },
  { id: "IGNITION", label: "Ateşleme (Igniter)", dur: 1.5 },
  { id: "BURN", label: "Yanma / İzleme", dur: 9 },
  { id: "SHUTDOWN", label: "Shutdown", dur: 4 },
];

/** Index of the IGNITION step — used to flip the mission clock from T- to T+. */
export const IGNITION_STEP_INDEX = STEPS.findIndex((s) => s.id === "IGNITION");

export type Phase = StepId | "ABORT";

export const TARGETS: Record<Phase, Record<SensorId, number>> = {
  IDLE: { "PT-01": 2, "PT-02": 55, "TC-01": -12, "PT-03": 1, "PT-04": 1, "PT-05": 1, "TC-02": 24 },
  PRECHECK: { "PT-01": 2, "PT-02": 55, "TC-01": -12, "PT-03": 1, "PT-04": 1, "PT-05": 1, "TC-02": 24 },
  ARM: { "PT-01": 3, "PT-02": 57, "TC-01": -11, "PT-03": 1, "PT-04": 1, "PT-05": 2, "TC-02": 25 },
  BACKUP: { "PT-01": 4, "PT-02": 57, "TC-01": -11, "PT-03": 2, "PT-04": 2, "PT-05": 3, "TC-02": 26 },
  MAINVALVE: { "PT-01": 46, "PT-02": 54, "TC-01": -9, "PT-03": 5, "PT-04": 5, "PT-05": 32, "TC-02": 42 },
  IGNITION: { "PT-01": 45, "PT-02": 53, "TC-01": -8, "PT-03": 15, "PT-04": 14, "PT-05": 30, "TC-02": 720 },
  BURN: { "PT-01": 43, "PT-02": 48, "TC-01": -7, "PT-03": 40, "PT-04": 39, "PT-05": 29, "TC-02": 2180 },
  SHUTDOWN: { "PT-01": 3, "PT-02": 50, "TC-01": -10, "PT-03": 2, "PT-04": 2, "PT-05": 2, "TC-02": 340 },
  ABORT: { "PT-01": 1, "PT-02": 52, "TC-01": -12, "PT-03": 1, "PT-04": 1, "PT-05": 1, "TC-02": 60 },
};

/** Number of samples kept per sensor for the sparkline/telemetry graph history. */
export const HISTORY_LENGTH = 160;

/** Simulation tick period, matching the source design's 10Hz update rate. */
export const TICK_MS = 100;

/** How long the emergency-stop unlock stays armed after the lock is opened. */
export const ABORT_UNLOCK_MS = 10_000;

export const STATUS_COLORS = {
  SAFE: "#39e08a",
  ARMED: "#ffb020",
  FIRING: "#ff6a2a",
  ABORT: "#ff4d4d",
} as const;

export type MissionStatus = keyof typeof STATUS_COLORS;
