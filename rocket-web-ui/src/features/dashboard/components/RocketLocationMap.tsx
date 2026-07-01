type RocketLocationMapProps = {
  latitude?: number;
  longitude?: number;
};

export function RocketLocationMap({ latitude, longitude }: RocketLocationMapProps) {
  if (!isValidCoordinate(latitude, longitude)) {
    return (
      <div className="position-map position-map--empty">
        <span className="position-map__empty-icon" aria-hidden="true" />
        <strong>Konum verisi bekleniyor</strong>
        <small>Harita, geçerli enlem ve boylam alındığında açılacak.</small>
      </div>
    );
  }

  return (
    <div className="position-map position-map--live">
      <iframe
        title="Roketin güncel konumu"
        src={createOpenStreetMapUrl(latitude!, longitude!)}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <span className="position-map__rocket-marker" aria-hidden="true" />
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

function createOpenStreetMapUrl(latitude: number, longitude: number) {
  const offset = 0.01;
  const params = new URLSearchParams({
    bbox: [
      longitude - offset,
      latitude - offset,
      longitude + offset,
      latitude + offset,
    ].join(","),
    layer: "mapnik",
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
