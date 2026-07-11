import { useEffect, useMemo, useState } from "react";
import "./EepromTablo.css";

export type EepromAlanTanim<TModel extends object> = {
  etiket: string;
  varsayilanKey: keyof TModel;
  degerKey: keyof TModel;
};

type Props<TModel extends object, TPayload extends object> = {
  baslik: string;
  tip: string;
  model?: TModel;
  lastUpdateId?: number;
  alanlar: EepromAlanTanim<TModel>[];
  payloadHazirla: (model: TModel) => TPayload;
  onAl: () => void;
  onGonder: (payload: TPayload) => void;
};

export function EepromTablo<
  TModel extends object,
  TPayload extends object,
>({
  baslik,
  tip,
  model,
  lastUpdateId,
  alanlar,
  payloadHazirla,
  onAl,
  onGonder,
}: Props<TModel, TPayload>) {
  const bosModel = useMemo(() => buildBosModel(alanlar), [alanlar]);
  const [duzenlenenModel, setDuzenlenenModel] = useState<TModel>(bosModel);

  useEffect(() => {
    setDuzenlenenModel(model ?? bosModel);
  }, [bosModel, lastUpdateId, model]);

  const degerGuncelle = (key: keyof TModel, value: number) => {
    setDuzenlenenModel((onceki) => ({
      ...onceki,
      [key]: value,
    }));
  };

  return (
    <div className="mc-panel mc-eeprom">
      <div className="mc-panel__head">
        <div className="mc-panel__head-title">
          <span className="mc-panel__head-title-dot" />
          {baslik}
        </div>
        <span className="mc-eeprom__tip-rozeti">{tip}</span>
      </div>

      <div className="mc-eeprom__tablo-sarici">
        <table className="mc-eeprom__tablo">
          <thead>
            <tr>
              <th>Parametre</th>
              <th>Varsayilan</th>
              <th>Deger</th>
            </tr>
          </thead>
          <tbody>
            {alanlar.map((alan) => (
              <tr key={String(alan.degerKey)}>
                <td className="mc-eeprom__parametre">{alan.etiket}</td>
                <td>
                  <input
                    type="number"
                    value={readNumberValue(duzenlenenModel, alan.varsayilanKey)}
                    disabled
                    aria-label={`${alan.etiket} varsayilan degeri`}
                  />
                </td>
                <td className="mc-eeprom__deger">
                  <input
                    type="number"
                    value={readNumberValue(duzenlenenModel, alan.degerKey)}
                    aria-label={`${alan.etiket} degeri`}
                    onChange={(event) => {
                      const sayi = event.target.valueAsNumber;
                      degerGuncelle(
                        alan.degerKey,
                        Number.isFinite(sayi) ? sayi : 0,
                      );
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mc-eeprom__aksiyonlar">
        <button type="button" className="mc-eeprom-btn" onClick={onAl}>
          AL
        </button>
        <button
          type="button"
          className="mc-eeprom-btn mc-eeprom-btn--gonder"
          onClick={() => onGonder(payloadHazirla(duzenlenenModel))}
        >
          GONDER
        </button>
      </div>
    </div>
  );
}

function buildBosModel<TModel extends object>(
  alanlar: EepromAlanTanim<TModel>[],
): TModel {
  return alanlar.reduce<Record<string, number>>((model, alan) => {
    model[String(alan.varsayilanKey)] = 0;
    model[String(alan.degerKey)] = 0;
    return model;
  }, {}) as TModel;
}

function readNumberValue<TModel extends object>(
  model: TModel,
  key: keyof TModel,
): number {
  const value = model[key];
  return typeof value === "number" ? value : 0;
}
