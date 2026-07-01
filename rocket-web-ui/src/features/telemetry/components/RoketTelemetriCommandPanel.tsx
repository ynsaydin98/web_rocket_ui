import { useState } from "react";
import { sendCommand } from "../../commands/services/commandSender";
import {
  createRoketTelemetriSoftResetCommand,
  createRoketTelemetriSoftResetWithPayloadCommand,
} from "../commands/roketTelemetriCommandFactory";

export function RoketTelemetriCommandPanel() {
  const [reason, setReason] = useState("UserRequest");
  const [delayMs, setDelayMs] = useState("1000");
  const sendSoftReset = () => {
    if (!window.confirm("SoftReset komutu gönderilecek. Emin misiniz?")) return;
    sendCommand(createRoketTelemetriSoftResetCommand());
  };
  const sendSoftResetWithPayload = () => {
    if (!reason.trim()) {
      alert("Reason boş olamaz.");
      return;
    }

    if (!delayMs.trim()) {
      alert("Delay değeri boş olamaz.");
      return;
    }

    const parsedDelayMs = Number(delayMs);

    if (
      !Number.isFinite(parsedDelayMs) ||
      !Number.isInteger(parsedDelayMs) ||
      parsedDelayMs < 0
    ) {
      alert("Delay değeri geçerli bir sayı olmalı ve 0'dan küçük olmamalı.");
      return;
    }

    if (
      !window.confirm(
        "Payload içeren SoftReset komutu gönderilecek. Emin misiniz?",
      )
    )
      return;
    sendCommand(
      createRoketTelemetriSoftResetWithPayloadCommand({
        reason: reason.trim(),
        delayMs: parsedDelayMs,
      }),
    );
  };
  return (
    <div className="command-groups">
      <div className="command-group">
        <div>
          <p className="command-group__title">Hızlı Komut</p>
          <p className="muted-copy">
            Payload içermeyen kontrollü reset komutu.
          </p>
        </div>
        <button
          type="button"
          className="button button--danger"
          onClick={sendSoftReset}
        >
          Reset
        </button>
      </div>
      <div className="command-group command-group--form">
        <div>
          <p className="command-group__title">Zamanlanmış Reset</p>
          <p className="muted-copy">
            Payload değerlerini doğrulayarak komut fabrikasına iletir.
          </p>
        </div>
        <div className="form-grid">
          <label>
            Reason
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <label>
            Delay Ms
            <input
              type="number"
              value={delayMs}
              onChange={(event) => setDelayMs(event.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          className="button"
          onClick={sendSoftResetWithPayload}
        >
          Payload ile Reset
        </button>
      </div>
    </div>
  );
}
