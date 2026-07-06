import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Offline tile depolari: scripts/tileIndir.mjs ile indirilen tile'lar
// public/tiles (sokak) ve public/tiles-uydu (uydu, --tip uydu) altindan
// servis edilir (dev ve prod build'de ayni yol). Katman secimi haritanin
// sag ust kosesindeki UYDU/SOKAK dugmesiyle yapilir ve localStorage'da
// saklanir. Uydu secildiginde uydu katmani ustte durur; uydu tile'i
// indirilmemis bolgelerde alttaki sokak haritasi gorunur.
// Zoom araligi, indirilen tile'larin zoom araligiyla eslesmelidir.
const SOKAK_TILE_URL = "/tiles/{z}/{x}/{y}.png";
const UYDU_TILE_URL = "/tiles-uydu/{z}/{x}/{y}.jpg";
const TILE_MIN_ZOOM = 12;
const TILE_MAX_ZOOM = 17;
const VARSAYILAN_ZOOM = 15;
// Depoda olmayan tile'lar (404) kirik resim ikonu yerine seffaf gorunsun.
const BOS_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

type HaritaKatmani = "uydu" | "sokak";
const KATMAN_STORAGE_ANAHTARI = "harita-katman";

function kayitliKatman(): HaritaKatmani {
  return localStorage.getItem(KATMAN_STORAGE_ANAHTARI) === "sokak" ? "sokak" : "uydu";
}

type RocketLocationMapProps = {
  latitude?: number;
  longitude?: number;
};

export function RocketLocationMap({ latitude, longitude }: RocketLocationMapProps) {
  const gecerli = isValidCoordinate(latitude, longitude);

  if (!gecerli) {
    return (
      <div className="position-map position-map--empty">
        <span className="position-map__empty-icon" aria-hidden="true" />
        <strong>Konum verisi bekleniyor</strong>
        <small>Harita, geçerli enlem ve boylam alındığında açılacak.</small>
      </div>
    );
  }

  return <OfflineLeafletMap latitude={latitude!} longitude={longitude!} />;
}

function OfflineLeafletMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const uyduKatmanRef = useRef<L.TileLayer | null>(null);
  const [katman, setKatman] = useState<HaritaKatmani>(kayitliKatman);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [latitude, longitude],
      zoom: VARSAYILAN_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(SOKAK_TILE_URL, {
      minZoom: TILE_MIN_ZOOM,
      maxZoom: TILE_MAX_ZOOM,
      errorTileUrl: BOS_TILE,
    }).addTo(map);

    // Uydu katmani burada sadece olusturulur; haritaya eklenmesi/cikarilmasi
    // asagidaki katman effect'inde secime gore yapilir.
    uyduKatmanRef.current = L.tileLayer(UYDU_TILE_URL, {
      minZoom: TILE_MIN_ZOOM,
      maxZoom: TILE_MAX_ZOOM,
      errorTileUrl: BOS_TILE,
    });

    const marker = L.circleMarker([latitude, longitude], {
      radius: 6,
      color: "#ffffff",
      weight: 2,
      fillColor: "#ff4d4f",
      fillOpacity: 1,
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      markerRef.current = null;
      mapRef.current = null;
      uyduKatmanRef.current = null;
      map.remove();
    };
    // Harita bir kez kurulur; konum guncellemeleri asagidaki effect ile yapilir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const uydu = uyduKatmanRef.current;
    if (!map || !uydu) return;

    if (katman === "uydu") {
      if (!map.hasLayer(uydu)) uydu.addTo(map);
    } else if (map.hasLayer(uydu)) {
      map.removeLayer(uydu);
    }
    localStorage.setItem(KATMAN_STORAGE_ANAHTARI, katman);
  }, [katman]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
  }, [latitude, longitude]);

  return (
    <div className="position-map position-map--live">
      <div
        ref={containerRef}
        className="position-map__canvas"
        role="img"
        aria-label="Roketin güncel konumu (offline harita)"
      />
      <div className="position-map__layer-toggle" role="group" aria-label="Harita katmanı">
        <button
          type="button"
          className={katman === "uydu" ? "is-active" : ""}
          aria-pressed={katman === "uydu"}
          onClick={() => setKatman("uydu")}
        >
          UYDU
        </button>
        <button
          type="button"
          className={katman === "sokak" ? "is-active" : ""}
          aria-pressed={katman === "sokak"}
          onClick={() => setKatman("sokak")}
        >
          SOKAK
        </button>
      </div>
    </div>
  );
}

function isValidCoordinate(latitude?: number, longitude?: number) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude! >= -90 &&
    latitude! <= 90 &&
    longitude! >= -180 &&
    longitude! <= 180
  );
}
