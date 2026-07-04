// MKU itki diagnostik paketinin UI modelinden (mkuItkiDiagnostikPaketStore)
// ve yerel güvenlik durumundan (missionControlStore) render'a hazır view
// model üreten saf fonksiyon. Vana/ateşleyici/faz okumaları artık paketteki
// gerçek alanlardan (valfDurum_*, itkiOpDurumlari, geri sayım / geçen süre
// sayaçları) türetiliyor.

import { ptColor, tcColor } from "../engine/colorRamp";
import {
  OP_MOD_SEQUENCE,
  SENSORS,
  STATUS_COLORS,
  type MissionStatus,
  type OpMod,
  type SensorId,
} from "../config/missionControlConfig";
import type { MKUItkiDiagnostikPaketUiModel } from "../../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";
import type { IgniterState, MissionControlState, ValveState } from "../store/missionControlStore";
import { mapItkiOpDurumlariToOpMod } from "./itkiOpModMapper";

function fmt(id: SensorId, v: number): string {
  return id.startsWith("TC") ? String(Math.round(v)) : v.toFixed(1);
}

/** valfDurum_* sayısal kodu vana durumuna eşler. PLACEHOLDER: 0=KAPALI, diğer=AÇIK. */
function mapValfDurum(kod: number | undefined): ValveState {
  return kod !== undefined && kod !== 0 ? "open" : "closed";
}

/** valfDurum_Igniter* kodunu ateşleyici durumuna eşler. PLACEHOLDER: 0=GÜVENLİ, 1=KOLLANDI, 2+=ATEŞLENDİ. */
function mapAtesleyiciDurum(kod: number | undefined): IgniterState {
  if (kod === undefined || kod <= 0) return "safe";
  if (kod === 1) return "armed";
  return "fired";
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

function mapOpModToStatus(opMod: OpMod): MissionStatus {
  switch (opMod) {
    case "BEKLEMEDE":
      return "SAFE";
    case "GERİ SAYIM":
      return "ARMED";
    case "ATEŞLEME":
      return "FIRING";
    case "TAMAMLANDI":
      return "SAFE";
  }
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

/**
 * Sensör okumaları MKUItkiDiagnostikPaket'te bulunmuyor; ayrı sensör
 * telemetri paketi tanımlanana kadar rozetler/grafik eksen alt değerinde
 * düz çizgi gösterir. Sensör paketi geldiğinde bu iki yardımcıya gerçek
 * değer/tarihçe bağlanması yeterli.
 */
function sensorPlaceholderValue(id: SensorId): number {
  return SENSORS[id].axis[0];
}

function flatLinePoints(id: SensorId, axisMax: number): string {
  const y = 97 - Math.max(0, Math.min(1, sensorPlaceholderValue(id) / axisMax)) * 92;
  return `0,${y.toFixed(1)} 300,${y.toFixed(1)}`;
}

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

export function buildMissionControlView(
  ozet: MKUItkiDiagnostikPaketUiModel | undefined,
  local: MissionControlState,
): MissionControlView {
  const opMod = ozet ? mapItkiOpDurumlariToOpMod(ozet.itkiOpDurumlari) : "BEKLEMEDE";

  // Acil durdur: yerel kilit-onaylı buton VEYA paketteki acilDurdurDurum alanı.
  const aborted = local.aborted || (ozet !== undefined && ozet.acilDurdurDurum !== 0);
  const status: MissionStatus = aborted ? "ABORT" : mapOpModToStatus(opMod);
  const statusColor = STATUS_COLORS[status];

  // Vana/ateşleyici okumaları paketteki gerçek valfDurum_* alanlarından gelir.
  const valveMainState = mapValfDurum(ozet?.valfDurum_OksitleyiciValf);
  const igniter1State = mapAtesleyiciDurum(ozet?.valfDurum_Igniter1);
  const igniter2State = mapAtesleyiciDurum(ozet?.valfDurum_Igniter2);

  const badges: SensorBadgeView[] = BADGE_DEFS.map((d) => {
    const v = sensorPlaceholderValue(d.id);
    const cfg = SENSORS[d.id];
    const color = d.id.startsWith("TC") ? tcColor(v, cfg.axis) : ptColor(v, cfg.axis);
    return {
      id: d.id.replace("-0", "-"),
      cx: d.cx,
      cy: d.cy,
      ax: d.ax,
      ay: d.ay,
      foX: d.cx - 36,
      foY: d.cy - 28,
      color,
      reading: `${fmt(d.id, v)} ${cfg.unit}`,
    };
  });

  const graphLines: GraphLineView[] = GRAPH_SERIES.map((s) => ({
    color: s.color,
    label: s.label,
    points: flatLinePoints(s.id, s.axisMax),
  }));

  const steps = buildSteps(opMod, aborted, statusColor);

  const abortUnlocked = local.abortUnlockUntil > Date.now();
  const unlockRemainingSec = abortUnlocked ? Math.ceil((local.abortUnlockUntil - Date.now()) / 1000) : 0;

  const flowActive = valveMainState === "open" && local.manualValve === "open" && !aborted;
  const exhaustActive = status === "FIRING" && valveMainState === "open";

  return {
    valveMain: { color: valveColor(valveMainState), text: valveText(valveMainState) },
    valveManual: {
      color: valveColor(local.manualValve),
      text: valveText(local.manualValve),
      isOpen: local.manualValve === "open",
    },
    igniter1: { color: igniterColor(igniter1State), text: igniterText(igniter1State), state: igniter1State },
    igniter2: { color: igniterColor(igniter2State), text: igniterText(igniter2State), state: igniter2State },
    badges,
    flowActive,
    exhaustActive,
    graphLines,
    steps,
    showReset: local.aborted,
    abortUnlocked,
    unlockRemainingSec,
    lockIcon: abortUnlocked ? "\u{1F513}" : "\u{1F512}",
    abortSubLabel: abortUnlocked ? `AKTİF · ${unlockRemainingSec} sn` : "KİLİTLİ",
  };
}
