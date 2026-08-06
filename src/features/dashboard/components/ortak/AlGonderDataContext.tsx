import { useEffect, useMemo, useState } from "react";
import "./EepromTablo.css";
import "./AlGonderDataContext.css";

export type AlGonderDegerTipi = "sayi" | "metin";

export type AlGonderDataAlanTanim<TModel extends object> = {
  etiket: string;
  degerKey: keyof TModel;
  index?: number;
  /** Alanin deger tipi. Verilmezse "sayi" kabul edilir. */
  tip?: AlGonderDegerTipi;
  /** Sadece "metin" tipindeki alanlar icin karakter siniri. */
  maxUzunluk?: number;
  /**
   * Model henuz yokken gosterilecek deger. Verilmezse metin alanlari "",
   * sayi alanlari 0 ile baslar. Ornegin IP alani icin "0.0.0.0" verilebilir.
   */
  bosDeger?: AlanDeger;
};

type AlanDeger = number | string;

type Props<TModel extends object, TPayload extends object> = {
  baslik: string;
  tip: string;
  model?: TModel;
  lastUpdateId?: number;
  alanlar: AlGonderDataAlanTanim<TModel>[];
  payloadHazirla: (model: TModel) => TPayload;
  onAl: () => void;
  onGonder: (payload: TPayload) => void;
};

export function AlGonderDataContext<
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
    value: AlanDeger,
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
      const nextValue: AlanDeger[] = Array.isArray(currentValue)
        ? [...currentValue]
        : [];
      nextValue[index] = value;

      return {
        ...onceki,
        [key]: nextValue,
      };
    });
  };

  return (
    <div className="mc-panel mc-eeprom mc-eeprom--al-gonder">
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
              <th>Deger</th>
            </tr>
          </thead>
          <tbody>
            {alanlar.map((alan) => (
              <tr key={`${String(alan.degerKey)}-${alan.index ?? "single"}`}>
                <td className="mc-eeprom__parametre">{alan.etiket}</td>
                <td className="mc-eeprom__deger">
                  {metinAlaniMi(alan) ? (
                    <input
                      type="text"
                      value={readMetinValue(
                        duzenlenenModel,
                        alan.degerKey,
                        alan.index,
                      )}
                      maxLength={alan.maxUzunluk}
                      aria-label={`${alan.etiket} degeri`}
                      onChange={(event) =>
                        degerGuncelle(
                          alan.degerKey,
                          event.target.value,
                          alan.index,
                        )
                      }
                    />
                  ) : (
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
                  )}
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

function metinAlaniMi<TModel extends object>(
  alan: AlGonderDataAlanTanim<TModel>,
): boolean {
  return (alan.tip ?? "sayi") === "metin";
}

function buildBosModel<TModel extends object>(
  alanlar: AlGonderDataAlanTanim<TModel>[],
): TModel {
  return alanlar.reduce<Record<string, unknown>>((model, alan) => {
    setInitialValue(model, alan.degerKey, alan.index, bosDegerHesapla(alan));
    return model;
  }, {}) as TModel;
}

function bosDegerHesapla<TModel extends object>(
  alan: AlGonderDataAlanTanim<TModel>,
): AlanDeger {
  if (alan.bosDeger !== undefined) {
    return alan.bosDeger;
  }

  return metinAlaniMi(alan) ? "" : 0;
}

function readNumberValue<TModel extends object>(
  model: TModel,
  key: keyof TModel,
  index?: number,
): number {
  const value = okuHamDeger(model, key, index);
  return typeof value === "number" ? value : 0;
}

function readMetinValue<TModel extends object>(
  model: TModel,
  key: keyof TModel,
  index?: number,
): string {
  const value = okuHamDeger(model, key, index);
  if (typeof value === "string") {
    return value;
  }

  return typeof value === "number" ? String(value) : "";
}

function okuHamDeger<TModel extends object>(
  model: TModel,
  key: keyof TModel,
  index?: number,
): unknown {
  const value = model[key];
  if (index !== undefined) {
    return Array.isArray(value) ? value[index] : undefined;
  }

  return value;
}

function setInitialValue<TModel extends object>(
  model: Record<string, unknown>,
  key: keyof TModel,
  index: number | undefined,
  bosDeger: AlanDeger,
) {
  const modelKey = String(key);

  if (index === undefined) {
    model[modelKey] = bosDeger;
    return;
  }

  const currentValue = Array.isArray(model[modelKey])
    ? (model[modelKey] as AlanDeger[])
    : [];
  currentValue[index] = bosDeger;
  model[modelKey] = currentValue;
}
