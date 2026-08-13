import { useId } from "react";
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

/**
 * Çizim geometrisi (viewBox birimi). Dolum alanı gövdenin içinde kalır ve
 * genişliği en uzun metnin ("100.0%") rahatça sığacağı şekilde seçilmiştir.
 */
const DOLUM_X = 4;
const DOLUM_Y = 4;
const DOLUM_MAKS_GENISLIK = 58;
const DOLUM_YUKSEKLIK = 22;
const METIN_MERKEZ_X = DOLUM_X + DOLUM_MAKS_GENISLIK / 2;
const METIN_MERKEZ_Y = DOLUM_Y + DOLUM_YUKSEKLIK / 2;

/** Yüzde metnindeki ondalık hane sayısı. Değer yuvarlanmaz, kırpılarak gösterilir. */
const YUZDE_HANE = 1;

/**
 * Doluluk seviyesine göre renk değiştiren batarya göstergesi. Yüzde metni
 * bataryanın içinde, dolum çubuğunun üzerinde durur.
 *
 * Metin iki kez çizilir: biri dolu alana, diğeri boş alana kırpılır. Böylece
 * yüzde hem koyu zemin hem de renkli dolum üzerinde okunaklı kalır.
 *
 * Salt görsel bir bileşendir: değeri prop olarak alır, store/paket okuması yapmaz.
 */
export function BataryaGostergesi({
  yuzde,
  limit = BATARYA_LIMITLERI,
  etiket = "Batarya",
}: Props) {
  // clipPath id'leri sayfada birden fazla batarya olursa çakışmamalı.
  // useId'in ürettiği ayraç karakterleri url(#...) referansında sorun
  // çıkarmasın diye temizlenir.
  const benzersizId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const doluKirpmaId = `${benzersizId}-dolu`;
  const bosKirpmaId = `${benzersizId}-bos`;

  const durum = hesaplaBataryaDurum(yuzde, limit);
  const gecerliDeger = isSayisal(yuzde);

  // Çizim 0-100 aralığına sabitlenir; servis aralık dışı değer gönderse bile
  // dolum çubuğu taşmaz. Renk hesabı ham değer üzerinden yapılır.
  const doluluk = gecerliDeger ? Math.min(100, Math.max(0, yuzde)) : 0;
  const dolumGenisligi = (DOLUM_MAKS_GENISLIK * doluluk) / 100;
  const yuzdeText = gecerliDeger ? `${yuzde.toFixed(YUZDE_HANE)}%` : "--%";
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
      <svg className="batarya__cizim" viewBox="0 0 72 30" aria-hidden="true">
        <defs>
          <clipPath id={doluKirpmaId}>
            <rect
              x={DOLUM_X}
              y={DOLUM_Y}
              width={dolumGenisligi}
              height={DOLUM_YUKSEKLIK}
            />
          </clipPath>
          <clipPath id={bosKirpmaId}>
            <rect
              x={DOLUM_X + dolumGenisligi}
              y={DOLUM_Y}
              width={DOLUM_MAKS_GENISLIK - dolumGenisligi}
              height={DOLUM_YUKSEKLIK}
            />
          </clipPath>
        </defs>

        <rect
          className="batarya__govde"
          x="1"
          y="1"
          width="64"
          height="28"
          rx="5"
        />
        <rect className="batarya__uc" x="66" y="9" width="5" height="12" rx="2" />
        <rect
          className="batarya__dolum"
          x={DOLUM_X}
          y={DOLUM_Y}
          width={dolumGenisligi}
          height={DOLUM_YUKSEKLIK}
          rx="2"
        />

        <text
          className="batarya__yuzde batarya__yuzde--dolu"
          x={METIN_MERKEZ_X}
          y={METIN_MERKEZ_Y}
          textAnchor="middle"
          dominantBaseline="central"
          clipPath={`url(#${doluKirpmaId})`}
        >
          {yuzdeText}
        </text>
        <text
          className="batarya__yuzde batarya__yuzde--bos"
          x={METIN_MERKEZ_X}
          y={METIN_MERKEZ_Y}
          textAnchor="middle"
          dominantBaseline="central"
          clipPath={`url(#${bosKirpmaId})`}
        >
          {yuzdeText}
        </text>
      </svg>
    </span>
  );
}
