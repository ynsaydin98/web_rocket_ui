import type { ReactNode } from "react";

type UnitCommandHeaderProps = {
  unitName: string;
  actionLabel?: ReactNode;
  actionState?: 0 | 1 | null;
  versionLabel?: ReactNode;
  responseText?: ReactNode;
  onActionClick?: () => void;
  onVersionClick?: () => void;
};

export function UnitCommandHeader({
  unitName,
  actionLabel = "?",
  actionState = null,
  versionLabel = "Versiyon",
  responseText = "Cevap bekleniyor",
  onActionClick,
  onVersionClick,
}: UnitCommandHeaderProps) {
  const actionStateClass =
    actionState === 1
      ? "unit-command-header__action--success"
      : actionState === 0
        ? "unit-command-header__action--danger"
        : "";

  return (
    <section
      className="unit-command-header"
      aria-label={`${unitName} komut alanı`}
    >
      <div className="unit-command-header__top">
        <strong className="unit-command-header__name">{unitName}</strong>
        <button
          className={`unit-command-header__action ${actionStateClass}`.trim()}
          type="button"
          onClick={onActionClick}
        >
          {actionLabel}
        </button>
      </div>
      <div className="unit-command-header__bottom">
        <button
          className="unit-command-header__version"
          type="button"
          onClick={onVersionClick}
        >
          {versionLabel}
        </button>
        <span className="unit-command-header__response">{responseText}</span>
      </div>
    </section>
  );
}
