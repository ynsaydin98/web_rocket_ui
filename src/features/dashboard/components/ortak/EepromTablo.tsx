import { useEffect, useMemo, useState } from "react";
import "./EepromTablo.css";

export type EepromAlanTanim<TModel extends object> = {
  etiket: string;
  varsayilanKey: keyof TModel;
  degerKey: keyof TModel;
  index?: number;
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

  const degerGuncelle = (
    key: keyof TModel,
    value: number,
    index?: number,
  ) => {
    setDuzenlenenModel((onceki) => {
      if (index === undefined) {
        return {
          ...onceki,
          [key]: value,
        };
      }

      const currentValue = onceki[key];
      const nextValue = Array.isArray(currentValue) ? [...currentValue] : [];
      nextValue[index] = value;

      return {
        ...onceki,
        [key]: nextValue,
      };
    });
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
              <tr key={`${String(alan.degerKey)}-${alan.index ?? "single"}`}>
                <td className="mc-eeprom__parametre">{alan.etiket}</td>
                <td>
                  <input
                    type="number"
                    value={readNumberValue(
                      duzenlenenModel,
                      alan.varsayilanKey,
                      alan.index,
                    )}
                    disabled
                    aria-label={`${alan.etiket} varsayilan degeri`}
                  />
                </td>
                <td className="mc-eeprom__deger">
                  <input
                    type="number"
                    value={readNumberValue(
                      duzenlenenModel,
                      alan.degerKey,
                      alan.index,
                    )}
                    aria-label={`${alan.etiket} degeri`}
                    onChange={(event) => {
                      const sayi = event.target.valueAsNumber;
                      degerGuncelle(
                        alan.degerKey,
                        Number.isFinite(sayi) ? sayi : 0,
                        alan.index,
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
  return alanlar.reduce<Record<string, unknown>>((model, alan) => {
    setInitialValue(model, alan.varsayilanKey, alan.index);
    setInitialValue(model, alan.degerKey, alan.index);
    return model;
  }, {}) as TModel;
}

function readNumberValue<TModel extends object>(
  model: TModel,
  key: keyof TModel,
  index?: number,
): number {
  const value = model[key];
  if (index !== undefined) {
    return Array.isArray(value) && typeof value[index] === "number"
      ? value[index]
      : 0;
  }

  return typeof value === "number" ? value : 0;
}

function setInitialValue<TModel extends object>(
  model: Record<string, unknown>,
  key: keyof TModel,
  index?: number,
) {
  const modelKey = String(key);
  if (index === undefined) {
    model[modelKey] = 0;
    return;
  }

  const currentValue = Array.isArray(model[modelKey])
    ? (model[modelKey] as number[])
    : [];
  currentValue[index] = 0;
  model[modelKey] = currentValue;
}
