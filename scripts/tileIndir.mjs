// Offline harita icin tile indirme scripti.
//
// Verilen merkez koordinat + yaricapin kapladigi bbox'a giren tile'lari
// tile sunucusundan indirir ve yerel depoya yazar. Var olan tile'lar
// atlanir; script tekrar calistirilabilir.
//
// Iki tip desteklenir (--tip):
//   sokak (varsayilan): OpenStreetMap sokak haritasi -> public/tiles/{z}/{x}/{y}.png
//   uydu:               Esri World Imagery uydu goruntusu -> public/tiles-uydu/{z}/{x}/{y}.jpg
//
// Kullanim:
//   node scripts/tileIndir.mjs --lat 41.095125 --lon 28.637975 --yaricap-km 5 --zmin 12 --zmax 17
//   npm run tiles -- --lat 41.095125 --lon 28.637975
//   npm run tiles -- --tip uydu --lat 41.095125 --lon 28.637975
//   npm run tiles -- --sunucu https://tile.openstreetmap.de --bekleme-ms 1000
//
// Sunucu "Access blocked" / 403 / 429 dondururse: script bekleyip yeniden
// dener; ust uste cok blok yerse temiz durur (var olan tile'lar korunur,
// tekrar calistirinca kaldigi yerden devam eder). Alternatif sunucu icin
// --sunucu, tempo icin --bekleme-ms kullanin.
//
// NOT: OSM tile kullanim politikasi geregi (operations.osmfoundation.org/policies/tiles)
// toplu indirme kucuk saha alanlariyla sinirli tutulmalidir. Script istekler
// arasinda bekleyerek sunucuya nazik davranir.

import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Tile tipleri: sunucu, URL yapisi ve yerel depo yolu tipten belirlenir.
// - sokak: tile.openstreetmap.org script'lere HTTP 200 ile "Access blocked"
//   yazan placeholder PNG donduruyor; FOSSGIS'in Alman OSM sunucusu gercek
//   tile verir.
// - uydu: Esri World Imagery. URL sirasi {z}/{y}/{x} ve uzantisizdir; JPEG
//   doner. Kucuk saha alaniyla sinirli tek seferlik indirme icindir.
const TILE_TIPLERI = {
  sokak: {
    sunucu: "https://tile.openstreetmap.de",
    klasor: "tiles",
    uzanti: "png",
    url: (sunucu, z, x, y) => `${sunucu}/${z}/${x}/${y}.png`,
  },
  uydu: {
    sunucu: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile",
    klasor: "tiles-uydu",
    uzanti: "jpg",
    url: (sunucu, z, x, y) => `${sunucu}/${z}/${y}/${x}`,
  },
};
const VARSAYILAN_BEKLEME_MS = 600;
// Blok (403/418/429) sonrasi yeniden deneme beklemeleri (ms).
const BLOK_BEKLEMELERI_MS = [5000, 15000, 45000];
// Ust uste bu kadar tile bloklanirsa sunucu bizi engellemistir; temiz dur.
const MAKS_ARDISIK_BLOK = 5;
const BLOK_KODLARI = new Set([403, 418, 429]);
const USER_AGENT = "rocket-web-ui-offline-tile-indirici/1.0 (yer istasyonu; tek seferlik saha hazirligi)";

const projeKoku = join(dirname(fileURLToPath(import.meta.url)), "..");

const argumanlar = parseArgs(process.argv.slice(2));
const tipAdi = String(argumanlar.tip ?? "sokak");
const tip = TILE_TIPLERI[tipAdi];
if (!tip) hata(`--tip gecersiz (${Object.keys(TILE_TIPLERI).join(" | ")})`);

const cikisKlasoru = join(projeKoku, "public", tip.klasor);
const lat = argumanlar.lat ?? 41.095125;
const lon = argumanlar.lon ?? 28.637975;
const yaricapKm = argumanlar["yaricap-km"] ?? 5;
const zmin = argumanlar.zmin ?? 12;
const zmax = argumanlar.zmax ?? 17;
const tileSunucu = String(argumanlar.sunucu ?? tip.sunucu).replace(/\/+$/, "");
const beklemeMs = argumanlar["bekleme-ms"] ?? VARSAYILAN_BEKLEME_MS;

if (!/^https?:\/\//.test(tileSunucu)) hata("--sunucu gecersiz (http/https URL olmali)");
if (!Number.isFinite(beklemeMs) || beklemeMs < 100)
  hata("--bekleme-ms gecersiz (en az 100 ms; sunucuya nazik davranin)");

if (!Number.isFinite(lat) || lat < -85 || lat > 85) hata("--lat gecersiz (-85..85)");
if (!Number.isFinite(lon) || lon < -180 || lon > 180) hata("--lon gecersiz (-180..180)");
if (!Number.isFinite(yaricapKm) || yaricapKm <= 0 || yaricapKm > 50)
  hata("--yaricap-km gecersiz (0-50 km; OSM politikasi geregi kucuk tutun)");
if (!Number.isFinite(zmin) || !Number.isFinite(zmax) || zmin < 0 || zmax > 19 || zmin > zmax)
  hata("--zmin/--zmax gecersiz (0-19, zmin <= zmax)");

// Yaricapi dereceye cevir (enlem: ~111 km/derece; boylam enleme gore daralir).
const latDelta = yaricapKm / 111;
const lonDelta = yaricapKm / (111 * Math.cos((lat * Math.PI) / 180));
const bbox = {
  latMin: lat - latDelta,
  latMax: lat + latDelta,
  lonMin: lon - lonDelta,
  lonMax: lon + lonDelta,
};

const isler = [];
for (let z = zmin; z <= zmax; z += 1) {
  const xMin = lon2tile(bbox.lonMin, z);
  const xMax = lon2tile(bbox.lonMax, z);
  const yMin = lat2tile(bbox.latMax, z); // tile y ekseni kuzeyden guneye artar
  const yMax = lat2tile(bbox.latMin, z);
  for (let x = xMin; x <= xMax; x += 1) {
    for (let y = yMin; y <= yMax; y += 1) {
      isler.push({ z, x, y });
    }
  }
}

console.log(
  `Tip ${tipAdi} | merkez ${lat},${lon} | yaricap ${yaricapKm} km | zoom ${zmin}-${zmax} | toplam ${isler.length} tile | sunucu ${tileSunucu} | bekleme ${beklemeMs} ms`,
);
if (isler.length > 20000) {
  hata(
    `${isler.length} tile cok fazla — OSM politikasina uymak icin yaricapi veya zoom araligini kucultun.`,
  );
}

// Kalibrasyon: bazi sunucular blok durumunda her tile icin HTTP 200 +
// ayni "Access blocked" placeholder PNG'sini dondurur. Merkez tile'i iki
// farkli zoom'da indirip karsilastiriyoruz; ayni baytlarsa sunucu bizi
// blokluyor demektir (iki farkli zoom'daki gercek tile'lar ayni olamaz).
if (await sunucuBloklu()) {
  // Burada process.exit KULLANILMAZ: acik fetch soketleri Windows'ta
  // libuv assert'ine yol acabiliyor; exitCode ile dogal cikis yapilir.
  console.error(
    `HATA: ${tileSunucu} her tile icin ayni gorseli donduruyor — sunucu bu istemciyi ` +
      `blokluyor ("Access blocked" placeholder). Alternatif sunucu deneyin: ` +
      `--sunucu https://tile.openstreetmap.de veya --sunucu https://a.tile.opentopomap.org`,
  );
  process.exitCode = 9;
} else {
  await indirmeleriCalistir();
}

async function indirmeleriCalistir() {
let indirilen = 0;
let atlanan = 0;
let hatali = 0;
let ardisikBlok = 0;

for (const { z, x, y } of isler) {
  const hedef = join(cikisKlasoru, String(z), String(x), `${y}.${tip.uzanti}`);
  if (existsSync(hedef)) {
    atlanan += 1;
    continue;
  }

  const sonuc = await tileIndir(z, x, y, hedef);

  if (sonuc === "blok") {
    ardisikBlok += 1;
    hatali += 1;
    if (ardisikBlok >= MAKS_ARDISIK_BLOK) {
      console.error(
        `Sunucu ust uste ${ardisikBlok} tile blokladi (Access blocked). ` +
          `Birkac saat sonra tekrar deneyin (var olan tile'lar atlanir) ` +
          `veya alternatif sunucu kullanin: --sunucu https://tile.openstreetmap.de`,
      );
      break;
    }
  } else {
    ardisikBlok = 0;
    if (sonuc === "hata") hatali += 1;
    else indirilen += 1;

    if (indirilen > 0 && indirilen % 50 === 0) {
      console.log(`  ${indirilen} indirildi / ${isler.length}`);
    }
  }

  await new Promise((coz) => setTimeout(coz, beklemeMs));
}

console.log(
  `Bitti: ${indirilen} indirildi, ${atlanan} zaten vardi, ${hatali} hatali -> ${cikisKlasoru}`,
);
}

// Tek tile indirir; blok kodlarinda (403/418/429) artan bekleme ile yeniden
// dener. Donus: "tamam" | "blok" | "hata".
async function tileIndir(z, x, y, hedef) {
  for (let deneme = 0; ; deneme += 1) {
    try {
      const cevap = await fetch(tip.url(tileSunucu, z, x, y), {
        headers: { "User-Agent": USER_AGENT },
      });

      if (BLOK_KODLARI.has(cevap.status)) {
        if (deneme < BLOK_BEKLEMELERI_MS.length) {
          const bekle = BLOK_BEKLEMELERI_MS[deneme];
          console.warn(
            `  BLOK ${z}/${x}/${y}: HTTP ${cevap.status} — ${bekle / 1000} sn bekleyip yeniden denenecek (${deneme + 1}/${BLOK_BEKLEMELERI_MS.length})`,
          );
          await new Promise((coz) => setTimeout(coz, bekle));
          continue;
        }
        console.warn(`  BLOK ${z}/${x}/${y}: HTTP ${cevap.status} — vazgecildi`);
        return "blok";
      }

      if (!cevap.ok) throw new Error(`HTTP ${cevap.status}`);

      const govde = Buffer.from(await cevap.arrayBuffer());
      const icerikTipi = cevap.headers.get("content-type") ?? "";
      // Bazi engeller 200 + HTML hata sayfasi dondurur; PNG olmayani yazma.
      if (!icerikTipi.includes("image")) {
        console.warn(
          `  BLOK ${z}/${x}/${y}: sunucu resim yerine '${icerikTipi}' dondurdu (Access blocked sayfasi olabilir)`,
        );
        return "blok";
      }

      mkdirSync(dirname(hedef), { recursive: true });
      writeFileSync(hedef, govde);
      return "tamam";
    } catch (sebep) {
      console.warn(`  HATA ${z}/${x}/${y}: ${sebep.message}`);
      return "hata";
    }
  }
}

async function sunucuBloklu() {
  const z1 = zmin;
  const z2 = zmin < 19 ? zmin + 1 : zmin - 1;

  const [a, b] = await Promise.all(
    [z1, z2].map(async (z) => {
      const cevap = await fetch(tip.url(tileSunucu, z, lon2tile(lon, z), lat2tile(lat, z)), {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!cevap.ok) return null;
      return Buffer.from(await cevap.arrayBuffer());
    }),
  );

  return Boolean(a && b && a.equals(b));
}

function lon2tile(lonDeg, zoom) {
  return Math.floor(((lonDeg + 180) / 360) * 2 ** zoom);
}

function lat2tile(latDeg, zoom) {
  const latRad = (latDeg * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** zoom,
  );
}

function parseArgs(args) {
  const sonuc = {};
  for (let i = 0; i < args.length; i += 2) {
    const anahtar = args[i]?.replace(/^--/, "");
    const deger = args[i + 1];
    if (!anahtar || deger === undefined) continue;
    // Sayisal degerler sayiya cevrilir; --sunucu gibi metinler oldugu gibi kalir.
    sonuc[anahtar] = deger.trim() !== "" && Number.isFinite(Number(deger)) ? Number(deger) : deger;
  }
  return sonuc;
}

function hata(mesaj) {
  console.error(`HATA: ${mesaj}`);
  process.exit(1);
}
