import {
  BATARYA_LIMITLERI,
  hesaplaBataryaDurum,
  type BataryaLimit,
} from "../utils/bataryaDurum";
import { isSayisal } from "../utils/sayisalDogrulama";

type Props = {
  /** Batarya doluluk yüzdesi (0-100); okunamadıysa undefined. */
  yuzde: number | undefined;
  /** Renk eşikleri; verilmezse BATARYA_LIMITLERI kullanılır. */
  limit?: BataryaLimit;
  /** Erişilebilirlik etiketi ve tooltip başlığı. */
  etiket?: string;
};

/** Çizimin iç doluluk alanının viewBox genişliği. */
const DOLUM_MAKS_GENISLIK = 29;

/**
 * Doluluk seviyesine göre renk değiştiren batarya göstergesi. Salt görsel bir
 * bileşendir: değeri prop olarak alır, store/paket okuması yapmaz.
 */
export function BataryaGostergesi({
  yuzde,
  limit = BATARYA_LIMITLERI,
  etiket = "Batarya",
}: Props) {
  const durum = hesaplaBataryaDurum(yuzde, limit);
  const gecerliDeger = isSayisal(yuzde);

  // Çizim 0-100 aralığına sabitlenir; servis aralık dışı değer gönderse bile
  // dolum çubuğu taşmaz. Renk hesabı ham değer üzerinden yapılır.
  const doluluk = gecerliDeger ? Math.min(100, Math.max(0, yuzde)) : 0;
  const yuzdeText = gecerliDeger ? `${Math.round(yuzde)}%` : "--%";
  const baslik = gecerliDeger
    ? `${etiket}: ${yuzdeText}`
    : `${etiket}: veri yok`;

  return (
    <span
      className={`batarya batarya--${durum}`}
      role="meter"
      aria-label={baslik}
      aria-valuenow={gecerliDeger ? doluluk : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={yuzdeText}
      title={baslik}
    >
      <svg className="batarya__cizim" viewBox="0 0 40 18" aria-hidden="true">
        <rect
          className="batarya__govde"
          x="0.75"
          y="0.75"
          width="34.5"
          height="16.5"
          rx="3"
        />
        <rect
          className="batarya__dolum"
          x="3"
          y="3"
          width={(DOLUM_MAKS_GENISLIK * doluluk) / 100}
          height="12"
          rx="1.5"
        />
        <rect
          className="batarya__uc"
          x="36"
          y="5.5"
          width="3.5"
          height="7"
          rx="1.5"
        />
      </svg>
      <strong className="batarya__yuzde">{yuzdeText}</strong>
    </span>
  );
}
