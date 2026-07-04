import type { OpMod, SensorId } from "../config/missionControlConfig";

export type MissionControlIngestModel = {
  opMod: OpMod;
  sensors: Partial<Record<SensorId, number>>;
  sistemSaati?: number;
};
