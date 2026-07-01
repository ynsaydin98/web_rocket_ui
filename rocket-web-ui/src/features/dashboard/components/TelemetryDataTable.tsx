import { appConfig } from "../../../app/appConfig";
import { LabelValueTable } from "../../../shared/components/LabelValueTable";
import type { LabelValueRow } from "../../../shared/types/labelValueRow";
import { useTelemetryStore } from "../../telemetry/store/telemetryStore";

export function TelemetryDataTable() {
  const telemetry = useTelemetryStore((state) => state.roketOzet);

  const rows: LabelValueRow[] = [
    { label: "İrtifa", value: withUnit(telemetry?.irtifa, "m") },
    { label: "Hız", value: withUnit(telemetry?.hiz, "m/s") },
    { label: "Batarya", value: withUnit(telemetry?.batarya, "V") },
    { label: "Durum", value: telemetry?.durumText ?? "--" },
    {
      label: "Kritik Durum",
      value: telemetry ? (telemetry.kritikMi ? "Evet" : "Hayır") : "--",
    },
    {
      label: "Enlem",
      value: formatCoordinate(telemetry?.enlem ?? appConfig.testLatitude),
    },
    {
      label: "Boylam",
      value: formatCoordinate(telemetry?.boylam ?? appConfig.testLongitude),
    },
    {
      label: "Roll",
      value: withUnit(telemetry?.roll ?? appConfig.testRoll, "°"),
    },
    {
      label: "Pitch",
      value: withUnit(telemetry?.pitch ?? appConfig.testPitch, "°"),
    },
    {
      label: "Yaw",
      value: withUnit(telemetry?.yaw ?? appConfig.testYaw, "°"),
    },
    {
      label: "Sistem Saati",
      value: telemetry?.sistemSaati?.toString() ?? "--",
    },
  ];

  return <LabelValueTable title="Roket Modeli" rows={rows} />;
}

function withUnit(value: number | undefined, unit: string) {
  return Number.isFinite(value) ? `${value} ${unit}` : "--";
}

function formatCoordinate(value: number | undefined) {
  return Number.isFinite(value) ? `${value!.toFixed(6)}°` : "--";
}
