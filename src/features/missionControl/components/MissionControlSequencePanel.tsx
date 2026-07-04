import { useEffect, useState } from "react";
import { useMissionControlStore } from "../store/missionControlStore";
import type { MissionControlView } from "../mappers/missionControlViewMapper";
import { sendCommand } from "../../commands/services/commandSender";
import { MessageTypes } from "../../../contracts/messageTypes";
import { createSekansBaslatKomut } from "../../../commands/sekansBaslatKomut/sekansBaslatKomutFactory";
import { createAcilDurdurKomut } from "../../../commands/acilDurdurKomut/acilDurdurKomutFactory";
import { createManuelValfKomut } from "../../../commands/manuelValfKomut/manuelValfKomutFactory";

type Props = {
  view: MissionControlView;
};

/** Başlat/acil durdur kontrolleri, manuel vana switch'i ve 4 adımlı (opMod) sekans listesi. */
export function MissionControlSequencePanel({ view }: Props) {
  const abort = useMissionControlStore((s) => s.abort);
  const reset = useMissionControlStore((s) => s.reset);
  const unlockAbort = useMissionControlStore((s) => s.unlockAbort);
  const setManualValve = useMissionControlStore((s) => s.setManualValve);
  const abortUnlockUntil = useMissionControlStore((s) => s.abortUnlockUntil);

  // Kilit açıkken kalan süreyi canlı işletmek için yerel saat tick'i.
  // Store yalnızca kilidin açılış/kapanış anlarında değiştiği için kalan
  // saniye telemetri render'larına bırakılamaz.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (abortUnlockUntil <= Date.now()) return;
    const timerId = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timerId);
  }, [abortUnlockUntil]);

  const abortUnlocked = abortUnlockUntil > now;
  const kalanKilitSn = abortUnlocked
    ? Math.ceil((abortUnlockUntil - now) / 1000)
    : 0;

  const handleStart = () => {
    sendCommand(createSekansBaslatKomut("1", MessageTypes.MKUItkiDiagnostikPaket));
  };

  const handleAbort = () => {
    sendCommand(createAcilDurdurKomut("1", MessageTypes.MKUItkiDiagnostikPaket));
    abort();
  };

  const handleManualValveToggle = () => {
    const next = !view.valveManual.isOpen;
    setManualValve(next);
    sendCommand(createManuelValfKomut("1", MessageTypes.MKUItkiDiagnostikPaket, next));
  };

  return (
    <div className="mc-panel mc-sequence__panel">
      <div className="mc-panel__head">
        <div className="mc-panel__head-title">
          <span className="mc-panel__head-title-dot" />
          SEKANS KONTROL
        </div>
      </div>

      <div className="mc-sequence__controls">
        <button onClick={handleStart} className="mc-start-btn mc-start-btn--enabled">
          <span className="mc-start-btn__title">SEKANS BAŞLAT</span>
          <span className="mc-start-btn__subtitle">İTKİ SEKANSINI BAŞLATIR</span>
        </button>

        <div className="mc-lock-row">
          <button
            onClick={() => {
              setNow(Date.now());
              unlockAbort();
            }}
            title="Güvenlik kilidi"
            disabled={abortUnlocked}
            className={`mc-lock-btn${abortUnlocked ? " mc-lock-btn--unlocked mc-lock-btn--disabled" : ""}`}
          >
            <span>{abortUnlocked ? "\u{1F513}" : "\u{1F512}"}</span>
          </button>
          <button
            onClick={handleAbort}
            disabled={!abortUnlocked}
            className={`mc-abort-btn${abortUnlocked ? " mc-abort-btn--unlocked" : ""}`}
          >
            <span className="mc-abort-btn__title">ACİL DURDUR</span>
            <span className="mc-abort-btn__sub">
              {abortUnlocked ? `AKTİF · ${kalanKilitSn} sn` : "KİLİTLİ"}
            </span>
          </button>
        </div>
      </div>

      <div className="mc-manual-row">
        <span className="mc-manual-row__label">MANUEL VANA</span>
        <button
          type="button"
          role="switch"
          aria-checked={view.valveManual.isOpen}
          onClick={handleManualValveToggle}
          className={`mc-toggle-switch${view.valveManual.isOpen ? " mc-toggle-switch--on" : ""}`}
        >
          <span className="mc-toggle-switch__thumb" />
        </button>
        <span className="mc-manual-row__tag" style={{ color: view.valveManual.color }}>{view.valveManual.text}</span>
      </div>

      {view.showReset && (
        <div className="mc-reset">
          <button onClick={reset} className="mc-reset-btn">SIFIRLA · GÜVENLİ DURUMA DÖN</button>
        </div>
      )}

      <div className="mc-steps">
        {view.steps.map((step) => (
          <div
            key={step.n}
            className={`mc-step mc-step--${step.state}`}
            style={
              step.state === "active"
                ? { borderColor: step.accentColor, boxShadow: `inset 3px 0 0 ${step.accentColor}, 0 0 14px -4px ${step.accentColor}` }
                : undefined
            }
          >
            <div className="mc-step__num" style={step.state === "active" ? { background: step.accentColor } : undefined}>
              {step.n}
            </div>
            <div className="mc-step__label">{step.label}</div>
            <div className="mc-step__tag" style={step.state === "active" ? { color: step.accentColor } : undefined}>
              {step.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
