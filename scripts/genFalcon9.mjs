// Falcon 9 benzeri bir 3D modeli (.obj) prosedürel olarak üretir.
// Çıktı: src/assets/models/falcon9.obj
// Çalıştırma: node scripts/genFalcon9.mjs
//
// Not: Bu, gerçek bir CAD modeli değil; doğru oranlara sahip stilize bir
// yer tutucudur. Gerçek bir model ile aynı yola koyarak değiştirebilirsiniz.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const verts = []
const faces = []

const v = (x, y, z) => {
  verts.push(`v ${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}`)
  return verts.length // 1-based index
}
const quad = (a, b, c, d) => faces.push(`f ${a} ${b} ${c} ${d}`)
const tri = (a, b, c) => faces.push(`f ${a} ${b} ${c}`)

const SEG = 28

// Bir gövde dilimi (taper destekli) ekler ve üst halkanın indekslerini döndürür.
function ring(y, r) {
  const idx = []
  for (let i = 0; i < SEG; i++) {
    const a = (i / SEG) * Math.PI * 2
    idx.push(v(Math.cos(a) * r, y, Math.sin(a) * r))
  }
  return idx
}

function connect(r0, r1) {
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    quad(r0[i], r0[j], r1[j], r1[i])
  }
}

// --- Gövde profili (y, yarıçap) ---
const profile = [
  [0.0, 0.62], // taban
  [4.6, 0.62], // 1. kademe
  [4.9, 0.55], // interstage
  [7.3, 0.55], // 2. kademe
  [7.6, 0.62], // payload fairing alt
  [8.6, 0.62], // fairing gövde
  [9.4, 0.40], // fairing daralma
  [10.1, 0.001], // burun ucu
]

let prevRing = ring(profile[0][0], profile[0][1])
const baseRing = prevRing
for (let i = 1; i < profile.length; i++) {
  const cur = ring(profile[i][0], profile[i][1])
  connect(prevRing, cur)
  prevRing = cur
}

// Taban kapağı (motor plakası) — merkez nokta ile üçgenler
const baseCenter = v(0, profile[0][0], 0)
for (let i = 0; i < SEG; i++) {
  const j = (i + 1) % SEG
  tri(baseCenter, baseRing[j], baseRing[i])
}

// --- Grid finler (üst, interstage civarı) ---
function box(cx, cy, cz, sx, sy, sz, ry = 0) {
  const c = Math.cos(ry)
  const s = Math.sin(ry)
  const corners = [
    [-sx, -sy, -sz], [sx, -sy, -sz], [sx, sy, -sz], [-sx, sy, -sz],
    [-sx, -sy, sz], [sx, -sy, sz], [sx, sy, sz], [-sx, sy, sz],
  ]
  const idx = corners.map(([x, y, z]) => {
    const rx = x * c - z * s
    const rz = x * s + z * c
    return v(cx + rx, cy + y, cz + rz)
  })
  quad(idx[0], idx[1], idx[2], idx[3])
  quad(idx[5], idx[4], idx[7], idx[6])
  quad(idx[4], idx[0], idx[3], idx[7])
  quad(idx[1], idx[5], idx[6], idx[2])
  quad(idx[3], idx[2], idx[6], idx[7])
  quad(idx[4], idx[5], idx[1], idx[0])
}

for (let k = 0; k < 4; k++) {
  const a = (k / 4) * Math.PI * 2
  const r = 0.6
  box(Math.cos(a) * r, 6.9, Math.sin(a) * r, 0.05, 0.45, 0.32, a)
}

// --- İniş ayakları (taban, dışa açık) ---
for (let k = 0; k < 4; k++) {
  const a = (k / 4) * Math.PI * 2 + Math.PI / 4
  const r = 0.85
  box(Math.cos(a) * r, 0.7, Math.sin(a) * r, 0.05, 0.7, 0.12, a)
}

// --- Motor nozülleri (taban altı) ---
for (let k = 0; k < 8; k++) {
  const a = (k / 8) * Math.PI * 2
  const r = 0.32
  const cx = Math.cos(a) * r
  const cz = Math.sin(a) * r
  const top = []
  const bot = []
  for (let i = 0; i < 10; i++) {
    const t = (i / 10) * Math.PI * 2
    top.push(v(cx + Math.cos(t) * 0.08, 0.0, cz + Math.sin(t) * 0.08))
  }
  for (let i = 0; i < 10; i++) {
    const t = (i / 10) * Math.PI * 2
    bot.push(v(cx + Math.cos(t) * 0.13, -0.35, cz + Math.sin(t) * 0.13))
  }
  for (let i = 0; i < 10; i++) {
    const j = (i + 1) % 10
    quad(top[i], top[j], bot[j], bot[i])
  }
}
// merkez motor
{
  const top = []
  const bot = []
  for (let i = 0; i < 10; i++) {
    const t = (i / 10) * Math.PI * 2
    top.push(v(Math.cos(t) * 0.08, 0.0, Math.sin(t) * 0.08))
  }
  for (let i = 0; i < 10; i++) {
    const t = (i / 10) * Math.PI * 2
    bot.push(v(Math.cos(t) * 0.13, -0.35, Math.sin(t) * 0.13))
  }
  for (let i = 0; i < 10; i++) {
    const j = (i + 1) % 10
    quad(top[i], top[j], bot[j], bot[i])
  }
}

const out = `# Falcon 9 (stilize, prosedürel olarak üretildi)
# Oluşturan: scripts/genFalcon9.mjs
o Falcon9
${verts.join('\n')}
${faces.join('\n')}
`

const target = 'src/assets/models/falcon9.obj'
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, out)
console.log(`Yazıldı: ${target} (${verts.length} köşe, ${faces.length} yüz)`)
