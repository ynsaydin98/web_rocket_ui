import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Offline tile deposu: scripts/tileIndir.mjs ile indirilen tile'lar
// public/tiles altindan servis edilir (dev ve prod build'de ayni yol).
// Zoom araligi, indirilen tile'larin zoom araligiyla eslesmelidir.
const TILE_URL = "/tiles/{z}/{x}/{y}.png";
const TILE_MIN_ZOOM = 12;
const TILE_MAX_ZOOM = 17;
const VARSAYILAN_ZOOM = 15;

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [latitude, longitude],
      zoom: VARSAYILAN_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(TILE_URL, {
      minZoom: TILE_MIN_ZOOM,
      maxZoom: TILE_MAX_ZOOM,
    }).addTo(map);

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
      map.remove();
    };
    // Harita bir kez kurulur; konum guncellemeleri asagidaki effect ile yapilir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
