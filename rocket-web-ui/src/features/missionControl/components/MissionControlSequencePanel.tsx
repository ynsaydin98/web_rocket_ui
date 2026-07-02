import type { ChangeEvent } from "react";
import { useMissionControlStore } from "../store/missionControlStore";
import type { MissionControlView } from "../mappers/missionControlViewMapper";

type Props = {
  view: MissionControlView;
};

/** Start/abort controls, manual valve slider and the 8-step sequence list. */
export function MissionControlSequencePanel({ view }: Props) {
  const start = useMissionControlStore((s) => s.start);
  const abort = useMissionControlStore((s) => s.abort);
  const reset = useMissionControlStore((s) => s.reset);
  const unlockAbort = useMissionControlStore((s) => s.unlockAbort);
  const setManualValve = useMissionControlStore((s) => s.setManualValve);

  const handleManualValveChange = (e: ChangeEvent<HTMLInputElement>) => {
    setManualValve(e.target.value === "1");
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
        <button
          onClick={start}
          disabled={!view.canStart}
          className={`mc-start-btn${view.canStart ? " mc-start-btn--enabled" : ""}`}
        >
          <span className="mc-start-btn__title">SEKANS BAŞLAT</span>
          <span className="mc-start-btn__subtitle">START SEQUENCE</span>
        </button>

        <div className="mc-lock-row">
          <button
            onClick={unlockAbort}
            title="Güvenlik kilidi"
            disabled={view.abortUnlocked}
            className={`mc-lock-btn${view.abortUnlocked ? " mc-lock-btn--unlocked mc-lock-btn--disabled" : ""}`}
          >
            <span>{view.lockIcon}</span>
          </button>
          <button
            onClick={abort}
            disabled={!view.abortUnlocked}
            className={`mc-abort-btn${view.abortUnlocked ? " mc-abort-btn--unlocked" : ""}`}
          >
            <span className="mc-abort-btn__title">ACİL DURDUR</span>
            <span className="mc-abort-btn__sub">{view.abortSubLabel}</span>
          </button>
        </div>
      </div>

      <div className="mc-manual-row">
        <span className="mc-manual-row__label">MANUEL VANA</span>
        <input
          type="range"
          min={0}
          max={1}
          step={1}
          value={view.valveManual.sliderValue}
          onChange={handleManualValveChange}
          className="mc-manual-row__slider"
          style={{
            accentColor: view.valveManual.color,
            background:
              view.valveManual.sliderValue === 1
                ? "linear-gradient(90deg,#1a2732,#39e08a)"
                : "linear-gradient(90deg,#57697c,#1a2732)",
          }}
        />
        <span className="mc-manual-row__tag" style={{ color: view.valveManual.color }}>{view.valveManual.text}</span>
      </div>

      {view.showReset && (
        <div className="mc-reset">
          <button onClick={reset} className="mc-reset-btn">RESET · SAFE'E DÖN</button>
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
