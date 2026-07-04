import type { ReactNode } from "react";

type YoklamaVersiyonProps = {
  uniteAdi: string;
  yoklamaLabel?: ReactNode;
  yoklamaDurumu: 0 | 1;
  versiyonLabel?: ReactNode;
  versiyonCevabi: ReactNode;
  resetLabel?: ReactNode;
  onYoklamaClick: () => void;
  onVersiyonClick: () => void;
  onResetClick?: () => void;
};

export function YoklamaVersiyon({
  uniteAdi: uniteAdi,
  yoklamaLabel = "?",
  yoklamaDurumu = 0,
  versiyonLabel = "Versiyon",
  versiyonCevabi = "Cevap bekleniyor...",
  resetLabel = "Sıfırla",
  onYoklamaClick,
  onVersiyonClick,
  onResetClick,
}: YoklamaVersiyonProps) {
  const yoklamaDurumuClass =
    yoklamaDurumu === 1
      ? "unit-command-header__action--success"
      : yoklamaDurumu === 0
        ? "unit-command-header__action--danger"
        : "";

  return (
    <section
      className="unit-command-header"
      aria-label={`${uniteAdi} komut alanı`}
    >
      <div className="unit-command-header__top">
        <strong className="unit-command-header__name">{uniteAdi}</strong>
        <button
          className={`unit-command-header__action ${yoklamaDurumuClass}`.trim()}
          type="button"
          onClick={onYoklamaClick}
        >
          {yoklamaLabel}
        </button>
      </div>
      <div className="unit-command-header__bottom">
        <button
          className="unit-command-header__version"
          type="button"
          onClick={onVersiyonClick}
        >
          {versiyonLabel}
        </button>
        <span className="unit-command-header__response">{versiyonCevabi}</span>
      </div>
      {onResetClick && (
        <div className="unit-command-header__bottom">
          <button
            className="unit-command-header__version unit-command-header__reset"
            type="button"
            onClick={onResetClick}
          >
            {resetLabel}
          </button>
          <span className="unit-command-header__response">
            Üniteyi yeniden başlatır
          </span>
        </div>
      )}
    </section>
  );
}
