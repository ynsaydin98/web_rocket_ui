// Ana sayfanın ortasındaki Falcon 9 3D görüntüleyicisi + yanında uçuş izi.
// Model src/assets/models/falcon9.obj dosyasından yüklenir; model boyutu/merkezi
// çalışma anında normalize edilir. Uçuş izi (trajectory) roketin sağ tarafında
// 3B bir çizgi olarak telemetri geçmişinden çizilir.

import { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { Box3, MeshStandardMaterial, Vector3, type Group, type Mesh } from 'three'
import { useStoreSelector } from '../../app/services'
import { computeTrajectory } from '../../lib/trajectory'
import falcon9Url from '../../assets/models/falcon9.obj?url'

/** Modelin sığacağı hedef yükseklik (sahne birimi). */
const TARGET_SIZE = 6

// İzin çizileceği bölge (roketin sağında).
const TRAIL = { offsetX: 3.2, width: 4.5, height: 6, baseY: -3 }

type Point3 = [number, number, number]

function Falcon9() {
  const obj = useLoader(OBJLoader, falcon9Url)

  const model = useMemo(() => {
    const clone = obj.clone(true) as Group
    const material = new MeshStandardMaterial({
      color: '#cdd6e2',
      metalness: 0.55,
      roughness: 0.4,
    })
    clone.traverse((child) => {
      const mesh = child as Mesh
      if (mesh.isMesh) mesh.material = material
    })

    const box = new Box3().setFromObject(clone)
    const size = box.getSize(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    clone.scale.setScalar(TARGET_SIZE / maxDim)

    const box2 = new Box3().setFromObject(clone)
    const center = box2.getCenter(new Vector3())
    clone.position.sub(center)
    return clone
  }, [obj])

  return <primitive object={model} />
}

/** Uçuş izi çizgisi + güncel konum işareti (Canvas içinde, props ile beslenir). */
function TrajectoryTrail({ points }: { points: Point3[] }) {
  if (points.length < 2) return null
  const last = points[points.length - 1] ?? [0, 0, 0]
  return (
    <group>
      <Line points={points} color="#38bdf8" lineWidth={2} />
      <mesh position={last}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

/** Telemetri geçmişini, iz bölgesine ölçeklenmiş 3B noktalara çevirir. */
function toTrailPoints(traj: { range: number; altitude: number }[]): Point3[] {
  if (traj.length < 2) return []
  const maxRange = Math.max(1, ...traj.map((p) => p.range))
  const maxAlt = Math.max(1, ...traj.map((p) => p.altitude))
  return traj.map((p) => [
    TRAIL.offsetX + (p.range / maxRange) * TRAIL.width,
    TRAIL.baseY + (p.altitude / maxAlt) * TRAIL.height,
    0,
  ])
}

export default function RocketViewer() {
  // Canvas DIŞINDA store'a eriş (context köprüsü gerekmesin); noktaları prop ile geçir.
  const history = useStoreSelector((s) => s.history)
  const points = useMemo(() => toTrailPoints(computeTrajectory(history)), [history])

  const fov = 38
  const distance =
    (TARGET_SIZE / 2 / Math.tan((fov / 2) * (Math.PI / 180))) * 2.1

  return (
    <div className="rocket-viewer">
      <Canvas camera={{ position: [2 + distance * 0.45, distance * 0.28, distance], fov }}>
        <color attach="background" args={['#0a0f1c']} />
        <ambientLight intensity={0.6} />
        <hemisphereLight args={['#bcd4ff', '#1a2030', 0.6]} />
        <directionalLight position={[8, 12, 6]} intensity={1.4} />
        <directionalLight position={[-6, 4, -8]} intensity={0.5} color="#88aaff" />
        <gridHelper args={[24, 24, '#23314a', '#161f30']} position={[2, TRAIL.baseY, 0]} />
        <Suspense fallback={null}>
          <Falcon9 />
        </Suspense>
        <TrajectoryTrail points={points} />
        <OrbitControls
          enablePan={false}
          minDistance={TARGET_SIZE * 0.6}
          maxDistance={TARGET_SIZE * 8}
          target={[2, 0, 0]}
        />
      </Canvas>
      <span className="viewer-hint">
        Roketin yanındaki çizgi: uçuş izi (menzil / irtifa) · sürükle-döndür, tekerlekle yakınlaş
      </span>
    </div>
  )
}
