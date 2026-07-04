export type ZenitAzimut = {
  /** Roket ekseninin dikeyden sapma açısı (derece, 0 = tam dik). */
  zenit: number;
  /** Sapmanın pusula yönü (derece, 0 = Kuzey, saat yönünde 0-360). */
  azimut: number;
};

/**
 * IMU yönelim değerlerinden (derece) roketin zenit/azimut açılarını
 * hesaplar. 3D sahnedekiyle aynı eksen kuralı kullanılır: YXZ sırası,
 * yaw dikey eksende pusula yönünde, pitch X, roll Z ekseninde.
 *
 * Roketin gövde ekseni (yukarı vektörü) dünya koordinatına döndürülür;
 * zenit bu vektörün dikeyle yaptığı açı, azimut ise yatay izdüşümünün
 * pusula yönüdür.
 */
export function hesaplaZenitAzimut(
  pitchDerece: number,
  rollDerece: number,
  yawDerece: number,
): ZenitAzimut {
  const tx = (pitchDerece * Math.PI) / 180; // X ekseni (pitch)
  const ty = (-yawDerece * Math.PI) / 180; // Y ekseni (yaw, pusula yönü)
  const tz = (-rollDerece * Math.PI) / 180; // Z ekseni (roll)

  // R = Ry(ty) * Rx(tx) * Rz(tz) uygulanmış (0,1,0) gövde-yukarı vektörü.
  const ux =
    -Math.sin(tz) * Math.cos(ty) +
    Math.cos(tz) * Math.sin(tx) * Math.sin(ty);
  const uy = Math.cos(tz) * Math.cos(tx);
  const uz =
    Math.sin(tz) * Math.sin(ty) +
    Math.cos(tz) * Math.sin(tx) * Math.cos(ty);

  const zenit =
    (Math.acos(Math.min(1, Math.max(-1, uy))) * 180) / Math.PI;

  // Yatay izdüşüm yok denecek kadar küçükse (roket dik) azimut anlamsızdır.
  const yatayBuyukluk = Math.hypot(ux, uz);
  if (yatayBuyukluk < 1e-9) {
    return { zenit, azimut: 0 };
  }

  // Kuzey = -Z, Doğu = +X (pusula göstergesiyle aynı yön kuralı).
  const azimutHam = (Math.atan2(ux, -uz) * 180) / Math.PI;
  const azimut = ((azimutHam % 360) + 360) % 360;

  return { zenit, azimut };
}
