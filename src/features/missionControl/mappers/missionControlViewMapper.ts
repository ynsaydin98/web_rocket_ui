// MKU itki diagnostik paketinin UI modelinden (mkuItkiDiagnostikPaketStore)
// ve yerel güvenlik durumundan (missionControlStore) render'a hazır view
// model üreten fonksiyon. Vana/ateşleyici/faz okumaları paketteki gerçek
// alanlardan (valfDurum_*, itkiOpDurumlari, süre sayaçları), sensör rozet
// ve grafikleri de paketin PT1..PT5 / TC1..TC2 alanlarından besleniyor
// (grafik geçmişi, Grafikler sayfasıyla ortak zaman serisi tamponundan okunur).

import { MessageTypes } from "../../../contracts/messageTypes";
import { getGrafikGecmisi } from "../../grafik/services/grafikVeriGecmisi";
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
  /** Sayısal okuma; birim ayrı satırda render edilir ki uzun değerler rozetten taşmasın. */
  deger: string;
  birim: string;
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
};

const GRAPH_SERIES: { id: SensorId; color: string; label: string; axisMax: number }[] = [
  { id: "PT-01", color: "#3aa0ff", label: "PT-1", axisMax: 60 },
  { id: "PT-03", color: "#ff4d4d", label: "PT-3", axisMax: 60 },
  { id: "PT-04", color: "#ff8a3a", label: "PT-4", axisMax: 60 },
  { id: "PT-05", color: "#38d6d6", label: "PT-5", axisMax: 60 },
  { id: "TC-02", color: "#ffb020", label: "TC-2", axisMax: 2600 },
];

/** P&ID sensör kimliği -> MKUItkiDiagnostikPaket alan adı eşlemesi. */
const SENSOR_ALANLARI: Record<SensorId, keyof MKUItkiDiagnostikPaketUiModel> = {
  "PT-01": "PT1",
  "PT-02": "PT2",
  "PT-03": "PT3",
  "PT-04": "PT4",
  "PT-05": "PT5",
  "TC-01": "TC1",
  "TC-02": "TC2",
};

/** Paket henüz gelmediyse rozetler eksen alt değerini gösterir. */
function sensorDeger(
  id: SensorId,
  ozet: MKUItkiDiagnostikPaketUiModel | undefined,
): number {
  return ozet ? ozet[SENSOR_ALANLARI[id]] : SENSORS[id].axis[0];
}

function buildLinePoints(degerler: number[], axisMax: number): string {
  const n = degerler.length;
  if (n < 2) return "";
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 300;
    const y = 97 - Math.max(0, Math.min(1, degerler[i] / axisMax)) * 92;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
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
    const tag = stepState === "active" ? (abortActive ? "ACİL DUR" : "AKTİF") : stepState === "done" ? "✓" : "";

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
    const v = sensorDeger(d.id, ozet);
    const cfg = SENSORS[d.id];
    const color = d.id.startsWith("TC") ? tcColor(v, cfg.axis) : ptColor(v, cfg.axis);
    return {
      id: d.id.replace("-0", "-"),
      cx: d.cx,
      cy: d.cy,
      ax: d.ax,
      ay: d.ay,
      foX: d.cx - 42,
      foY: d.cy - 31,
      color,
      deger: fmt(d.id, v),
      birim: cfg.unit,
    };
  });

  const sensorGecmisi = getGrafikGecmisi(MessageTypes.MKUItkiDiagnostikPaket);
  const graphLines: GraphLineView[] = GRAPH_SERIES.map((s) => {
    const alan = SENSOR_ALANLARI[s.id];
    const degerler = sensorGecmisi
      .map((ornek) => ornek.degerler[alan])
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
    return {
      color: s.color,
      label: s.label,
      points: buildLinePoints(degerler, s.axisMax),
    };
  });

  const steps = buildSteps(opMod, aborted, statusColor);

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
  };
}
