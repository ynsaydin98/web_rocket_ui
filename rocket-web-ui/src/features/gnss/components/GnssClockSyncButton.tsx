import { sendCommand } from "../../commands/services/commandSender";
import { createSyncGnssClockCommand } from "../commands/gnssCommandFactory";

function getCurrentEpochSecondsAsUint() {
  return Math.floor(Date.now() / 1000);
}

export function GnssClockSyncButton() {
  const sendClockSyncCommand = () => {
    const epochSeconds = getCurrentEpochSecondsAsUint();

    if (epochSeconds < 0 || epochSeconds > 4_294_967_295) {
      alert("Epoch değeri uint32 aralığında değil.");
      return;
    }

    if (
      !window.confirm(
        `GNSS saati ${epochSeconds} epoch seconds değeri ile senkron edilecek. Emin misiniz?`,
      )
    ) {
      return;
    }

    sendCommand(
      createSyncGnssClockCommand({
        epochSeconds,
      }),
    );
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={sendClockSyncCommand}
      title="GNSS saatini bilgisayar saati ile senkron et"
      aria-label="GNSS saatini senkron et"
    >
      ↻
    </button>
  );
}
