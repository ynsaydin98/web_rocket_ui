import { useEffect } from "react";
import { Panel } from "../../../shared/components/Panel";
import {
  StatusBadge,
  type StatusTone,
} from "../../../shared/components/StatusBadge";
import type { KopruCalismaDurumu } from "../models/seriUdpKopruDurumu";
import {
  kopruBaslat,
  kopruDurdur,
  kopruDurumTakibiBaslat,
} from "../services/seriUdpKopruService";
import { useAdminSessionStore } from "../store/adminSessionStore";
import { useSeriUdpKopruStore } from "../store/seriUdpKopruStore";

const tones = {
  kapali: "neutral",
  aciliyor: "warning",
  acik: "success",
  hata: "danger",
} satisfies Record<KopruCalismaDurumu, StatusTone>;

export function SeriUdpKopruPanel() {
  const durum = useSeriUdpKopruStore((state) => state.durum);
  const kopruyeUlasildi = useSeriUdpKopruStore((state) => state.kopruyeUlasildi);
  const hataMesaji = useSeriUdpKopruStore((state) => state.hataMesaji);
  const isAdmin = useAdminSessionStore((state) => state.isAdmin);

  useEffect(() => kopruDurumTakibiBaslat(), []);

  const calismaDurumu = durum?.durum ?? "kapali";
  const acik = calismaDurumu === "acik" || calismaDurumu === "aciliyor";

  return (
    <Panel
      title="Seri Port - UDP Köprüsü"
      eyebrow="Kripto Servis Bağlantısı"
      action={
        <StatusBadge tone={kopruyeUlasildi ? tones[calismaDurumu] : "danger"}>
          {kopruyeUlasildi ? calismaDurumu.toUpperCase() : "KÖPRÜ YOK"}
        </StatusBadge>
      }
    >
      <div className="kopru-panel">
        <dl className="kopru-panel__grid">
          <div>
            <dt>Seri Port</dt>
            <dd>
              {durum?.seriPortYolu || "-"} @ {durum?.seriBaud ?? "-"}
            </dd>
          </div>
          <div>
            <dt>Kripto Servis (UDP)</dt>
            <dd>
              {durum ? `${durum.kriptoUdpIp}:${durum.kriptoUdpPort}` : "-"}
            </dd>
          </div>
          <div>
            <dt>UDP Dinleme Portu</dt>
            <dd>{durum?.udpDinlemePort ?? "-"}</dd>
          </div>
          <div>
            <dt>Seri → UDP</dt>
            <dd>
              {durum?.seriOkunanBayt ?? 0} bayt /{" "}
              {durum?.udpGonderilenPaket ?? 0} paket
            </dd>
          </div>
          <div>
            <dt>UDP → Seri</dt>
            <dd>
              {durum?.udpAlinanPaket ?? 0} paket / {durum?.seriYazilanBayt ?? 0}{" "}
              bayt
            </dd>
          </div>
          <div>
            <dt>Son Seri Veri</dt>
            <dd>{durum?.sonSeriVeriZamani ?? "-"}</dd>
          </div>
        </dl>

        <div className="kopru-panel__actions">
          <button
            type="button"
            className="button"
            disabled={!isAdmin || !kopruyeUlasildi || acik}
            onClick={() => void kopruBaslat()}
          >
            Köprüyü Başlat
          </button>
          <button
            type="button"
            className="button button--danger"
            disabled={!isAdmin || !kopruyeUlasildi || !acik}
            onClick={() => void kopruDurdur()}
          >
            Köprüyü Durdur
          </button>
          {!isAdmin && (
            <span className="muted-copy">
              Başlat/durdur için admin yetkisi gerekir.
            </span>
          )}
        </div>

        {hataMesaji && <p className="error-copy">{hataMesaji}</p>}
        {durum?.sonHata && <p className="error-copy">Köprü: {durum.sonHata}</p>}
      </div>
    </Panel>
  );
}
