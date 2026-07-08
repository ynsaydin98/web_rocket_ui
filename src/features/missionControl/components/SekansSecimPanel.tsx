import { useEffect, useState } from "react";
import { sendCommand } from "../../commands/services/commandSender";
import {
  createSekansAlKomut,
  createSekansEepromOkuKomut,
  createSekansEepromYazKomut,
  createSekansGonderKomut,
} from "../../../commands/sekansKomut/sekansKomutFactory";
import {
  SekansKomutSecimleri,
  SekansValfSecimleri,
  type MKUSekansAdim,
  type SekansKomutSecimi,
  type SekansValfSecimi,
} from "../../../paketler/mku/mkuSekansGonderPaket";
import { useMKUItkiKomutaPaketStore } from "../../../store/mku/mkuItkiKomutaPaketStore";
import type { MKUItkiKomutaPaketUiModel } from "../../../ui-models/mku/mkuItkiKomutaPaketUiModel";

/** Sekans tablosundaki satır sayısı. */
const ADIM_SAYISI = 10;

const VALF_SECENEKLERI: { deger: SekansValfSecimi; etiket: string }[] = [
  { deger: SekansValfSecimleri.SecimYok, etiket: "SECIM_YOK" },
  { deger: SekansValfSecimleri.ItkiVanasi, etiket: "İTKİ VANASI" },
  { deger: SekansValfSecimleri.YedekVana, etiket: "YEDEK VANA" },
  { deger: SekansValfSecimleri.Atesleyici1, etiket: "ATEŞLEYİCİ-1" },
  { deger: SekansValfSecimleri.Atesleyici2, etiket: "ATEŞLEYİCİ-2" },
];

const KOMUT_SECENEKLERI: { deger: SekansKomutSecimi; etiket: string }[] = [
  { deger: SekansKomutSecimleri.SecimYok, etiket: "SECIM_YOK" },
  { deger: SekansKomutSecimleri.Ac, etiket: "AÇ" },
  { deger: SekansKomutSecimleri.Kapat, etiket: "KAPAT" },
];

function bosAdimlar(): MKUSekansAdim[] {
  return Array.from({ length: ADIM_SAYISI }, (_, i) => ({
    islemNo: i + 1,
    valfSecimi: SekansValfSecimleri.SecimYok,
    komutSecimi: SekansKomutSecimleri.SecimYok,
    sure_ms: 0,
  }));
}

function adimlarFromItkiKomutaPaket(
  model: MKUItkiKomutaPaketUiModel,
): MKUSekansAdim[] {
  return Array.from({ length: ADIM_SAYISI }, (_, i) => ({
    islemNo: i + 1,
    valfSecimi: model[`seciliValf_${i}` as keyof MKUItkiKomutaPaketUiModel] as SekansValfSecimi,
    komutSecimi: model[`seciliIslem_${i}` as keyof MKUItkiKomutaPaketUiModel] as SekansKomutSecimi,
    sure_ms: model[`islemSuresi_${i}` as keyof MKUItkiKomutaPaketUiModel] as number,
  }));
}

/** İşlem no / valf / komut / süre kolonlu sekans tablosu ve gönder-al-EEPROM aksiyonları. */
export function SekansSecimPanel() {
  const itkiKomutaOzet = useMKUItkiKomutaPaketStore((s) => s.ozet);
  const itkiKomutaLastUpdateId = useMKUItkiKomutaPaketStore(
    (s) => s.lastUpdateId,
  );
  const [adimlar, setAdimlar] = useState<MKUSekansAdim[]>(bosAdimlar);
  const [gecenSure, setGecenSure] = useState<number>(0);

  useEffect(() => {
    if (!itkiKomutaOzet) return;
    setAdimlar(adimlarFromItkiKomutaPaket(itkiKomutaOzet));
    setGecenSure(itkiKomutaOzet.geriSayim_sn);
  }, [itkiKomutaLastUpdateId, itkiKomutaOzet]);

  const adimGuncelle = (index: number, degisiklik: Partial<MKUSekansAdim>) => {
    setAdimlar((onceki) =>
      onceki.map((adim, i) => (i === index ? { ...adim, ...degisiklik } : adim)),
    );
  };

  return (
    <div className="mc-panel mc-sekans-secim">
      <div className="mc-panel__head">
        <div className="mc-panel__head-title">
          <span className="mc-panel__head-title-dot" />
          SEKANS SEÇİMİ
        </div>
      </div>

      <div className="mc-sekans-secim__tablo-sarici">
        <table className="mc-sekans-secim__tablo">
          <colgroup>
            <col className="mc-sekans-secim__col-no" />
            <col className="mc-sekans-secim__col-valf" />
            <col className="mc-sekans-secim__col-komut" />
            <col className="mc-sekans-secim__col-sure" />
          </colgroup>
          <thead>
            <tr>
              <th>İşlem No</th>
              <th>Valf Seçimi</th>
              <th>Komut Seçimi</th>
              <th>Süre (T + MS)</th>
            </tr>
          </thead>
          <tbody>
            {adimlar.map((adim, index) => (
              <tr key={adim.islemNo}>
                <td className="mc-sekans-secim__no">{adim.islemNo}</td>
                <td>
                  <select
                    value={adim.valfSecimi}
                    onChange={(e) =>
                      adimGuncelle(index, {
                        valfSecimi: Number(e.target.value) as SekansValfSecimi,
                      })
                    }
                  >
                    {VALF_SECENEKLERI.map((s) => (
                      <option key={s.deger} value={s.deger}>
                        {s.etiket}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={adim.komutSecimi}
                    onChange={(e) =>
                      adimGuncelle(index, {
                        komutSecimi: Number(e.target.value) as SekansKomutSecimi,
                      })
                    }
                  >
                    {KOMUT_SECENEKLERI.map((s) => (
                      <option key={s.deger} value={s.deger}>
                        {s.etiket}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={adim.sure_ms}
                    onChange={(e) => {
                      const sure = e.target.valueAsNumber;
                      adimGuncelle(index, {
                        sure_ms: Number.isFinite(sure) && sure >= 0 ? sure : 0,
                      });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label className="mc-sekans-secim__metin-alani">
        <span>GEÇEN SÜRE</span>
        <input
          type="number"
          min={0}
          value={gecenSure}
          onChange={(e) => {
            const sayi = e.target.valueAsNumber;
            setGecenSure(Number.isFinite(sayi) && sayi >= 0 ? sayi : 0);
          }}
          placeholder="0"
        />
      </label>

      <div className="mc-sekans-secim__aksiyonlar">
        <button
          type="button"
          className="mc-sekans-btn mc-sekans-btn--gonder"
          onClick={() => sendCommand(createSekansGonderKomut("1", adimlar))}
        >
          SEKANS GONDER
        </button>
        <button
          type="button"
          className="mc-sekans-btn mc-sekans-btn--al"
          onClick={() => sendCommand(createSekansAlKomut("1"))}
        >
          SEKANS AL
        </button>
        <button
          type="button"
          className="mc-sekans-btn mc-sekans-btn--eeprom-yaz"
          onClick={() => sendCommand(createSekansEepromYazKomut("1"))}
        >
          SEKANS EEPROM YAZ
        </button>
        <button
          type="button"
          className="mc-sekans-btn mc-sekans-btn--eeprom-oku"
          onClick={() => sendCommand(createSekansEepromOkuKomut("1"))}
        >
          SEKANS EEPROM OKU
        </button>
      </div>
    </div>
  );
}
