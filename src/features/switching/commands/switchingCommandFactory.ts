import { appConfig } from "../../../app/appConfig";
import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { SwitchingCommands, type SwitchingCommand } from "./switchingCommands";

export type SwitchingAction = "close" | "reset" | "open";

export type SwitchingCommandPayload = {
  switchId: string;
  action: SwitchingAction;
  force: boolean;
};

const commandTypeByAction: Record<SwitchingAction, SwitchingCommand> = {
  close: SwitchingCommands.Close,
  reset: SwitchingCommands.Reset,
  open: SwitchingCommands.Open,
};

export function createSwitchingCommand(
  payload: SwitchingCommandPayload,
): CommandEnvelope<SwitchingCommandPayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: "SwitchingCommand",
    commandType: commandTypeByAction[payload.action],
    payload,
  };
}
