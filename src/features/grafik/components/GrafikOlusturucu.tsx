import { useState } from "react";
import { GRAFIK_KAYNAKLARI, getGrafikKaynak } from "../config/grafikKaynaklari";
import { GRAFIK_MAX_SERI, GRAFIK_SERI_RENKLERI } from "../config/grafikRenkleri";
import { useGrafikTanimStore } from "../store/grafikTanimStore";

/**
 * Grid'in son hücresinde duran büyük "grafik ekle" kartı. Tıklanınca kaynak
 * paket + alan seçim formuna genişler; kayıtlı her paket kaynağı
 * (config/grafikKaynaklari.ts) burada otomatik listelenir.
 */
export function GrafikOlusturucu() {
  const addGrafik = useGrafikTanimStore((s) => s.addGrafik);

  const [acik, setAcik] = useState(false);
  const [baslik, setBaslik] = useState("");
  const [kaynakId, setKaynakId] = useState(GRAFIK_KAYNAKLARI[0]?.id ?? "");
  const [seciliAlanlar, setSeciliAlanlar] = useState<string[]>([]);

  const kaynak = getGrafikKaynak(kaynakId);

  const kapat = () => {
    setAcik(false);
    setBaslik("");
    setSeciliAlanlar([]);
  };

  const toggleAlan = (key: string) => {
    setSeciliAlanlar((mevcut) => {
      if (mevcut.includes(key)) return mevcut.filter((alan) => alan !== key);
      if (mevcut.length >= GRAFIK_MAX_SERI) return mevcut;
      return [...mevcut, key];
    });
  };

  const handleKaynakChange = (id: string) => {
    setKaynakId(id);
    setSeciliAlanlar([]);
  };

  const handleEkle = () => {
    if (!kaynak || seciliAlanlar.length === 0) return;
    addGrafik({
      baslik: baslik.trim() || kaynak.label,
      kaynakId: kaynak.id,
      alanlar: seciliAlanlar,
    });
    kapat();
  };

  if (!acik) {
    return (
      <button
        type="button"
        className="grafik-ekle-kart"
        onClick={() => setAcik(true)}
      >
        <span className="grafik-ekle-kart__arti" aria-hidden="true">
          +
        </span>
        <span className="grafik-ekle-kart__baslik">YENİ GRAFİK EKLE</span>
        <span className="grafik-ekle-kart__aciklama">
          Paket değişkenlerinden kendi grafiğini oluştur
        </span>
      </button>
    );
  }

  return (
    <section className="grafik-panel grafik-olusturucu">
      <header className="grafik-panel__head">
        <div>
          <h3>Yeni Grafik</h3>
          <p>Kaynak paketi ve çizilecek değişkenleri seç</p>
        </div>
        <button
          type="button"
          className="grafik-panel__remove"
          title="Vazgeç"
          aria-label="Grafik eklemeden vazgeç"
          onClick={kapat}
        >
          ×
        </button>
      </header>

      <div className="grafik-olusturucu__form">
        <label className="grafik-olusturucu__satir">
          <span>Grafik Başlığı</span>
          <input
            type="text"
            value={baslik}
            placeholder={kaynak?.label ?? "Grafik başlığı"}
            onChange={(e) => setBaslik(e.target.value)}
          />
        </label>

        <label className="grafik-olusturucu__satir">
          <span>Kaynak Paket</span>
          <select
            value={kaynakId}
            onChange={(e) => handleKaynakChange(e.target.value)}
          >
            {GRAFIK_KAYNAKLARI.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grafik-olusturucu__satir">
          <span>
            Değişkenler ({seciliAlanlar.length}/{GRAFIK_MAX_SERI})
          </span>
          <div className="grafik-olusturucu__alanlar">
            {kaynak?.alanlar.map((alan) => {
              const secili = seciliAlanlar.includes(alan.key);
              const dolu = !secili && seciliAlanlar.length >= GRAFIK_MAX_SERI;
              const renkIndex = seciliAlanlar.indexOf(alan.key);
              return (
                <label
                  key={alan.key}
                  className={`grafik-olusturucu__alan${secili ? " is-secili" : ""}${dolu ? " is-dolu" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={secili}
                    disabled={dolu}
                    onChange={() => toggleAlan(alan.key)}
                  />
                  {secili && (
                    <span
                      className="grafik-panel__swatch"
                      style={{ background: GRAFIK_SERI_RENKLERI[renkIndex] }}
                    />
                  )}
                  {alan.label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="grafik-olusturucu__aksiyonlar">
          <button
            type="button"
            className="grafik-olusturucu__ekle"
            disabled={seciliAlanlar.length === 0}
            onClick={handleEkle}
          >
            GRAFİĞİ EKLE
          </button>
          <button
            type="button"
            className="grafik-olusturucu__vazgec"
            onClick={kapat}
          >
            VAZGEÇ
          </button>
        </div>
      </div>
    </section>
  );
}
