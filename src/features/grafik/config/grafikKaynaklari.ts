// Grafik sayfasinin paket kaynak kayitlari. Alan listeleri
// src/ui-models/**/*.ts dosyalarindan scripts/grafikAlanlariUret.mjs ile
// uretilir; bu dosya yalnizca paket-store baglantisini tutar.

import { MessageTypes } from "../../../contracts/messageTypes";
import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";
import { useMKUItkiKomutaPaketStore } from "../../../store/mku/mkuItkiKomutaPaketStore";
import { useMKUVersiyonPaketStore } from "../../../store/mku/mkuVersiyonPaketStore";
import { useMKUYoklamaPaketStore } from "../../../store/mku/mkuYoklamaPaketStore";
import { GENERATED_GRAFIK_ALANLARI } from "./generatedGrafikAlanlari";

export type GrafikAlanTanim = {
  key: string;
  label: string;
};

export type GrafikKaynakTanim = {
  /** MessageTypes degeriyle ayni kimlik. */
  id: string;
  label: string;
  /** Grafige secilebilir sayisal alanlar. */
  alanlar: GrafikAlanTanim[];
  /** Kaynagin son ornegini okur (henuz veri yoksa undefined). */
  getSnapshot: () => Record<string, number> | undefined;
  /** Yeni ornek geldiginde cagrilacak dinleyiciyi baglar; unsubscribe doner. */
  subscribe: (onSample: () => void) => () => void;
};

type StoreLike = {
  getState: () => {
    ozet?: Record<string, unknown>;
    lastUpdateId?: number;
  };
  subscribe: (
    listener: (
      state: { lastUpdateId?: number },
      prevState: { lastUpdateId?: number },
    ) => void,
  ) => () => void;
};

type GrafikKaynakStoreKaydi = {
  id: string;
  label?: string;
  store: StoreLike;
};

const GRAFIK_KAYNAK_STORE_KAYITLARI: GrafikKaynakStoreKaydi[] = [
  {
    id: MessageTypes.MKUItkiDiagnostikPaket,
    label: "MKU Itki Diagnostik Paketi",
    store: useMKUItkiDiagnostikPaketStore,
  },
  {
    id: MessageTypes.MKUItkiKomutaPaket,
    label: "MKU Itki Komuta Paketi",
    store: useMKUItkiKomutaPaketStore,
  },
  {
    id: MessageTypes.MKUVersiyonPaket,
    label: "MKU Versiyon Paketi",
    store: useMKUVersiyonPaketStore,
  },
  {
    id: MessageTypes.MKUYoklamaPaket,
    label: "MKU Yoklama Paketi",
    store: useMKUYoklamaPaketStore,
  },
];

const generatedAlanlarByMessageType = new Map<string, (typeof GENERATED_GRAFIK_ALANLARI)[number]>(
  GENERATED_GRAFIK_ALANLARI.map((kaynak) => [kaynak.messageTypeName, kaynak]),
);

function numberOnlySnapshot(
  snapshot: Record<string, unknown> | undefined,
): Record<string, number> | undefined {
  if (!snapshot) return undefined;

  const numericEntries = Object.entries(snapshot).filter(
    (entry): entry is [string, number] =>
      typeof entry[1] === "number" && Number.isFinite(entry[1]),
  );

  return numericEntries.length > 0 ? Object.fromEntries(numericEntries) : undefined;
}

function createGrafikKaynak(kayit: GrafikKaynakStoreKaydi): GrafikKaynakTanim {
  const generated = generatedAlanlarByMessageType.get(kayit.id);

  return {
    id: kayit.id,
    label: kayit.label ?? generated?.label ?? kayit.id,
    alanlar: generated?.alanlar.map((alan) => ({ ...alan })) ?? [],
    getSnapshot: () => numberOnlySnapshot(kayit.store.getState().ozet),
    subscribe: (onSample) =>
      kayit.store.subscribe((state, prevState) => {
        if (state.lastUpdateId !== prevState.lastUpdateId) onSample();
      }),
  };
}

export const GRAFIK_KAYNAKLARI: GrafikKaynakTanim[] =
  GRAFIK_KAYNAK_STORE_KAYITLARI.map(createGrafikKaynak).filter(
    (kaynak) => kaynak.alanlar.length > 0,
  );

export function getGrafikKaynak(id: string): GrafikKaynakTanim | undefined {
  return GRAFIK_KAYNAKLARI.find((kaynak) => kaynak.id === id);
}

export function getGrafikAlanLabel(kaynakId: string, alanKey: string): string {
  const kaynak = getGrafikKaynak(kaynakId);
  return kaynak?.alanlar.find((alan) => alan.key === alanKey)?.label ?? alanKey;
}
