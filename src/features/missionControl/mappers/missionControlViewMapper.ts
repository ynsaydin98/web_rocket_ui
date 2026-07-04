// Ham mission-control state'inden (missionControlStore) render'a hazır view
// model üreten saf fonksiyon. status/vana/ateşleyici/adım türetimi artık
// tamamen gerçek opMod değerinin (+ yerel aborted güvenlik bayrağının) bir
// fonksiyonu, yerel kurgulanmış bir simülasyon değil.

import { ptColor, tcColor } from "../engine/colorRamp";
import {
  OP_MOD_SEQUENCE,
  SENSORS,
  STATUS_COLORS,
  type MissionStatus,
  type OpMod,
  type SensorId,
} from "../config/missionControlConfig";
import type { IgniterState, MissionControlState, ValveState } from "../store/missionControlStore";

function fmt(id: SensorId, v: number): string {
  return id.startsWith("TC") ? String(Math.round(v)) : v.toFixed(1);
}

function fmtClock(opMod: OpMod, phaseEnteredAt: number): string {
  const sign = opMod === "ATEŞLEME" || opMod === "TAMAMLANDI" ? "T+ " : "T- ";
  const elapsedSec = Math.max(0, (Date.now() - phaseEnteredAt) / 1000);
  const m = Math.floor(elapsedSec / 60);
  const s = elapsedSec % 60;
  return `${sign}${String(m).padStart(2, "0")}:${s.toFixed(1).padStart(4, "0")}`;
}

function valveColor(s: ValveState): string {
  return s === "open" ? "#39e08a" : "#57697c";
}
function valveText(s: ValveState): string {
  return s === "open" ? "AÇIK" : "KAPALI";
}
function igniterColor(s: IgniterState): string {
  if (s === "fired") return "#ff4d4d";
  if (s === "armed") return "#ffb020";
  return "#57697c";
}
function igniterText(s: IgniterState): string {
  if (s === "fired") return "ATEŞLENDİ";
  if (s === "armed") return "KOLLANDI";
  return "GÜVENLİ";
}

/**
 * opMod'u status pilli / ana vana / ateşleyici okumalarına indirger.
 * Onaylanan sözleşme yalnızca itkiOpMod + sensör değerlerini garanti ediyor;
 * ayrı vana/ateşleyici telemetrisi varsa bu fonksiyon kolayca değiştirilir.
 */
function deriveFromOpMod(opMod: OpMod): { status: MissionStatus; valveMainOpen: boolean; igniter: IgniterState } {
  switch (opMod) {
    case "BEKLEMEDE":
      return { status: "SAFE", valveMainOpen: false, igniter: "safe" };
    case "GERİ SAYIM":
      return { status: "ARMED", valveMainOpen: true, igniter: "armed" };
    case "ATEŞLEME":
      return { status: "FIRING", valveMainOpen: true, igniter: "fired" };
    case "TAMAMLANDI":
      return { status: "SAFE", valveMainOpen: false, igniter: "safe" };
  }
}

function buildLinePoints(hist: number[], axisMax: number): string {
  const n = hist.length;
  if (n < 2) return "";
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 300;
    const y = 97 - Math.max(0, Math.min(1, hist[i] / axisMax)) * 92;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

type BadgeDef = { id: SensorId; cx: number; cy: number; ax: number; ay: number };

const BADGE_DEFS: BadgeDef[] = [
  { id: "PT-01", cx: 80, cy: 88, ax: 95, ay: 170 },
  { id: "PT-02", cx: 195, cy: 88, ax: 178, ay: 170 },
  { id: "TC-01", cx: 140, cy: 378, ax: 140, ay: 290 },
  { id: "PT-03", cx: 608, cy: 95, ax: 608, ay: 196 },
  { id: "TC-02", cx: 608, cy: 375, ax: 608, ay: 264 },
  { id: "PT-04", cx: 770, cy: 95, ax: 720, ay: 170 },
  { id: "PT-05", cx: 770, cy: 375, ax: 720, ay: 290 },
];

export type SensorBadgeView = {
  id: string;
  cx: number;
  cy: number;
  ax: number;
  ay: number;
  foX: number;
  foY: number;
  color: string;
  reading: string;
};

export type GraphLineView = { color: string; label: string; points: string };

export type SequenceStepView = {
  n: number;
  label: string;
  state: "active" | "done" | "pending";
  tag: string;
  accentColor: string;
};

export type MissionControlView = {
  clockText: string;
  statusColor: string;
  status: MissionStatus;
  valveMain: { color: string; text: string };
  valveManual: { color: string; text: string; isOpen: boolean };
  igniter1: { color: string; text: string; state: IgniterState };
  igniter2: { color: string; text: string; state: IgniterState };
  badges: SensorBadgeView[];
  flowActive: boolean;
  exhaustActive: boolean;
  graphLines: GraphLineView[];
  steps: SequenceStepView[];
  showReset: boolean;
  abortUnlocked: boolean;
  unlockRemainingSec: number;
  lockIcon: string;
  abortSubLabel: string;
};

const GRAPH_SERIES: { id: SensorId; color: string; label: string; axisMax: number }[] = [
  { id: "PT-01", color: "#3aa0ff", label: "PT-1", axisMax: 60 },
  { id: "PT-03", color: "#ff4d4d", label: "PT-3", axisMax: 60 },
  { id: "PT-04", color: "#ff8a3a", label: "PT-4", axisMax: 60 },
  { id: "PT-05", color: "#38d6d6", label: "PT-5", axisMax: 60 },
  { id: "TC-02", color: "#ffb020", label: "TC-2", axisMax: 2600 },
];

function buildSteps(opMod: OpMod, aborted: boolean, statusColor: string): SequenceStepView[] {
  const currentIndex = OP_MOD_SEQUENCE.findIndex((s) => s === opMod);
  return OP_MOD_SEQUENCE.map((step, i) => {
    const abortActive = aborted && i === 0;
    let stepState: SequenceStepView["state"];
    if (aborted) stepState = i === 0 ? "active" : "pending";
    else if (i < currentIndex) stepState = "done";
    else if (i === currentIndex) stepState = "active";
    else stepState = "pending";

    const accentColor = abortActive ? "#ff4d4d" : statusColor;
    const tag = stepState === "active" ? (abortActive ? "ABORT" : "ACTIVE") : stepState === "done" ? "✓" : "";

    return { n: i, label: step, state: stepState, tag, accentColor };
  });
}

export function buildMissionControlView(state: MissionControlState): MissionControlView {
  const derived = deriveFromOpMod(state.opMod);
  const status: MissionStatus = state.aborted ? "ABORT" : derived.status;
  const statusColor = STATUS_COLORS[status];
  const valveMainState: ValveState = !state.aborted && derived.valveMainOpen ? "open" : "closed";
  const igniterState: IgniterState = state.aborted ? "safe" : derived.igniter;

  const badges: SensorBadgeView[] = BADGE_DEFS.map((d) => {
    const v = state.cur[d.id];
    const cfg = SENSORS[d.id];
    const color = d.id.startsWith("TC") ? tcColor(v, cfg.axis) : ptColor(v, cfg.axis);
    return {
      id: d.id.replace("-0", "-"),
      cx: d.cx,
      cy: d.cy,
      ax: d.ax,
      ay: d.ay,
      foX: d.cx - 32,
      foY: d.cy - 26,
      color,
      reading: `${fmt(d.id, v)} ${cfg.unit}`,
    };
  });

  const graphLines: GraphLineView[] = GRAPH_SERIES.map((s) => ({
    color: s.color,
    label: s.label,
    points: buildLinePoints(state.hist[s.id], s.axisMax),
  }));

  const steps = buildSteps(state.opMod, state.aborted, statusColor);

  const abortUnlocked = state.abortUnlockUntil > Date.now();
  const unlockRemainingSec = abortUnlocked ? Math.ceil((state.abortUnlockUntil - Date.now()) / 1000) : 0;

  const flowActive = valveMainState === "open" && state.manualValve === "open" && !state.aborted;
  const exhaustActive = status === "FIRING" && valveMainState === "open";

  return {
    clockText: fmtClock(state.opMod, state.phaseEnteredAt),
    statusColor,
    status,
    valveMain: { color: valveColor(valveMainState), text: valveText(valveMainState) },
    valveManual: {
      color: valveColor(state.manualValve),
      text: valveText(state.manualValve),
      isOpen: state.manualValve === "open",
    },
    igniter1: { color: igniterColor(igniterState), text: igniterText(igniterState), state: igniterState },
    igniter2: { color: igniterColor(igniterState), text: igniterText(igniterState), state: igniterState },
    badges,
    flowActive,
    exhaustActive,
    graphLines,
    steps,
    showReset: state.aborted,
    abortUnlocked,
    unlockRemainingSec,
    lockIcon: abortUnlocked ? "\u{1F513}" : "\u{1F512}",
    abortSubLabel: abortUnlocked ? `AKTİF · ${unlockRemainingSec} sn` : "KİLİTLİ",
  };
}
