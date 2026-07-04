import { LabelValueTables } from "../../../../shared/components/LabelValueTables";
import type { TableRowModels } from "../../../../shared/types/TableRowModel";
import { formatDeger } from "../../../../shared/utils/formatDeger";
import { useMKUItkiDiagnostikPaketStore } from "../../../../store/mku/mkuItkiDiagnostikPaketStore";

export function MKUItkiDiagnostikDataTable() {
  const data = useMKUItkiDiagnostikPaketStore((state) => state.ozet);

  const rows: TableRowModels[] = [
    {
      baslik: "itkiOpDurumlari",
      degerler: [formatDeger(data?.itkiOpDurumlari)],
    },
    { baslik: "opGecenSure_ms", degerler: [formatDeger(data?.opGecenSure_ms)] },
    {
      baslik: "itkiBaslatmaGeriSayim_sn",
      degerler: [formatDeger(data?.itkiBaslatmaGeriSayim_sn)],
    },
    {
      baslik: "acilDurdurDurum",
      degerler: [formatDeger(data?.acilDurdurDurum)],
    },
    {
      baslik: "acilDurdurBasla",
      degerler: [formatDeger(data?.acilDurdurBasla)],
    },
    {
      baslik: "komutItkiSuresi_ms",
      degerler: [formatDeger(data?.komutItkiSuresi_ms)],
    },
    {
      baslik: "tahliyeGecenSure",
      degerler: [formatDeger(data?.tahliyeGecenSure)],
    },
    {
      baslik: "itkiGecenSure_ms",
      degerler: [formatDeger(data?.itkiGecenSure_ms)],
    },
    {
      baslik: "kalanItkiSuresi_ms",
      degerler: [formatDeger(data?.kalanItkiSuresi_ms)],
    },
    {
      baslik: "kalanTahliyeSuresi_ms",
      degerler: [formatDeger(data?.kalanTahliyeSuresi_ms)],
    },
    {
      baslik: "kalanAcilDurdurSuresi_ms",
      degerler: [formatDeger(data?.kalanAcilDurdurSuresi_ms)],
    },
    {
      baslik: "acilDurdurGecenSure_ms",
      degerler: [formatDeger(data?.acilDurdurGecenSure_ms)],
    },
    { baslik: "sistemSaati_ms", degerler: [formatDeger(data?.sistemSaati_ms)] },
    {
      baslik: "sonIslemSuresi_ms",
      degerler: [formatDeger(data?.sonIslemSuresi_ms)],
    },
    { baslik: "islemDurumlari", degerler: [formatDeger(data?.islemDurumlari)] },

    {
      baslik: "valfDurum_Igniter1",
      degerler: [formatDeger(data?.valfDurum_Igniter1)],
    },
    {
      baslik: "valfDurum_Igniter2",
      degerler: [formatDeger(data?.valfDurum_Igniter2)],
    },
    {
      baslik: "valfDurum_OksitleyiciValf",
      degerler: [formatDeger(data?.valfDurum_OksitleyiciValf)],
    },
    {
      baslik: "valfDurum_OksitleyiciYedekValf",
      degerler: [formatDeger(data?.valfDurum_OksitleyiciYedekValf)],
    },

    {
      baslik: "itkiSistemDurum",
      degerler: [formatDeger(data?.itkiSistemDurum)],
    },
    {
      baslik: "itkiOperasyonCevrim",
      degerler: [formatDeger(data?.itkiOperasyonCevrim)],
    },
    {
      baslik: "itkiHazirlikCevrim",
      degerler: [formatDeger(data?.itkiHazirlikCevrim)],
    },
    {
      baslik: "itkiTahliyeDurum",
      degerler: [formatDeger(data?.itkiTahliyeDurum)],
    },
    { baslik: "aphisDurum", degerler: [formatDeger(data?.aphisDurum)] },
    { baslik: "rksDurum", degerler: [formatDeger(data?.rksDurum)] },
    { baslik: "valfKomutMod", degerler: [formatDeger(data?.valfKomutMod)] },
    {
      baslik: "seciliAtesleyici",
      degerler: [formatDeger(data?.seciliAtesleyici)],
    },
  ];

  return (
    <LabelValueTables
      tabloBasligi="İTKİ DİAGNOSTİK"
      degerBasliklari={["DEĞER"]}
      rows={rows}
    />
  );
}
