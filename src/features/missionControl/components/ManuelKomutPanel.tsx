import { sendCommand } from "../../commands/services/commandSender";
import { createMKUKomut } from "../../../commands/mkuKomut/mkuKomutFactory";
import {
  MKUKomutHedefleri,
  type MKUKomutHedef,
} from "../../../paketler/mku/mkuKomutPaket";
import type { MissionControlView } from "../mappers/missionControlViewMapper";

type Props = {
  view: MissionControlView;
};

type SatirTanim = {
  hedef: MKUKomutHedef;
  etiket: string;
};

const SATIRLAR: SatirTanim[] = [
  { hedef: MKUKomutHedefleri.ItkiVanasi, etiket: "İTKİ VANASI" },
  { hedef: MKUKomutHedefleri.Atesleyici1, etiket: "ATEŞLEYİCİ-1" },
  { hedef: MKUKomutHedefleri.Atesleyici2, etiket: "ATEŞLEYİCİ-2" },
];

/** Vana ve ateşleyiciler için manuel AÇ / KAPAT komut satırları. */
export function ManuelKomutPanel({ view }: Props) {
  const durumlar: Record<MKUKomutHedef, { color: string; text: string }> = {
    [MKUKomutHedefleri.ItkiVanasi]: view.valveMain,
    [MKUKomutHedefleri.Atesleyici1]: view.igniter1,
    [MKUKomutHedefleri.Atesleyici2]: view.igniter2,
  };

  const komutGonder = (hedef: MKUKomutHedef, ac: boolean) => {
    sendCommand(createMKUKomut("1", hedef, ac));
  };

  return (
    <div className="mc-panel mc-manuel-komut">
      <div className="mc-panel__head">
        <div className="mc-panel__head-title">
          <span className="mc-panel__head-title-dot" />
          MANUEL KOMUT
        </div>
      </div>
      <div className="mc-manuel-komut__satirlar">
        {SATIRLAR.map(({ hedef, etiket }) => {
          const durum = durumlar[hedef];
          return (
            <div key={hedef} className="mc-manuel-komut__satir">
              <span
                className="mc-manuel-komut__led"
                style={{ color: durum.color }}
              />
              <span className="mc-manuel-komut__ad">{etiket}</span>
              <span
                className="mc-manuel-komut__durum"
                style={{ color: durum.color }}
              >
                {durum.text}
              </span>
              <div className="mc-manuel-komut__butonlar">
                <button type="button" onClick={() => komutGonder(hedef, true)}>
                  AÇ
                </button>
                <button type="button" onClick={() => komutGonder(hedef, false)}>
                  KAPAT
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
