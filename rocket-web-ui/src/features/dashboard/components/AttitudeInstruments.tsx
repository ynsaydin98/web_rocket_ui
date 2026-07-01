type AttitudeInstrumentsProps = {
  roll?: number;
  pitch?: number;
  yaw?: number;
};

export function AttitudeInstruments({ roll, pitch, yaw }: AttitudeInstrumentsProps) {
  const safeRoll = clampAngle(roll);
  const safePitch = clampAngle(pitch);
  const safeYaw = normalizeHeading(yaw);

  return (
    <section className="subsystem-block attitude-block">
      <h3>Yönelim</h3>
      <div className="attitude-instruments">
        <div className="attitude-instrument">
          <span className="attitude-instrument__label">Pusula</span>
          <div className="compass">
            <span
              className="compass__needle"
              style={{ transform: `translateX(-50%) rotate(${-safeYaw}deg)` }}
            />
            <b>K</b><i>D</i><em>G</em><small>B</small>
          </div>
          <strong className="heading-value">{formatAngle(yaw, true)}</strong>
        </div>

        <div className="attitude-instrument">
          <span className="attitude-instrument__label">Yapay Ufuk</span>
          <div className="artificial-horizon">
            <span
              className="artificial-horizon__plane"
              style={{
                transform: `translateY(${safePitch * 0.75}px) rotate(${-safeRoll}deg)`,
              }}
            />
            <span className="artificial-horizon__aircraft" />
          </div>
          <div className="attitude-values">
            <strong>R {formatAngle(roll)}</strong>
            <strong>P {formatAngle(pitch)}</strong>
            <strong>Y {formatAngle(yaw)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function clampAngle(value?: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(90, Math.max(-90, value!));
}

function normalizeHeading(value?: number) {
  if (!Number.isFinite(value)) return 0;
  return ((value! % 360) + 360) % 360;
}

function formatAngle(value?: number, heading = false) {
  if (!Number.isFinite(value)) return "--°";
  const formattedValue = heading ? normalizeHeading(value) : value!;
  return `${formattedValue.toFixed(1)}°`;
}
