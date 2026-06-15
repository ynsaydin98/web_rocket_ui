// Ana sayfanın ortasındaki Falcon 9 3D görüntüleyicisi.
// Model src/assets/models/falcon9.obj dosyasından yüklenir.
// Model boyutu/merkezi çalışma anında normalize edilir; böylece kaynak .obj'nin
// ölçeği ne olursa olsun (ör. metre cinsinden 70 birim) ekrana düzgün sığar.

import { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { Box3, MeshStandardMaterial, Vector3, type Group, type Mesh } from 'three'
import falcon9Url from '../../assets/models/falcon9.obj?url'

/** Modelin sığacağı hedef yükseklik (sahne birimi). */
const TARGET_SIZE = 6

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

    // 1) En büyük boyuta göre ölçekle.
    const box = new Box3().setFromObject(clone)
    const size = box.getSize(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    clone.scale.setScalar(TARGET_SIZE / maxDim)

    // 2) Ölçek sonrası yeniden ölçüp merkezi orijine taşı.
    const box2 = new Box3().setFromObject(clone)
    const center = box2.getCenter(new Vector3())
    clone.position.sub(center)

    return clone
  }, [obj])

  return <primitive object={model} />
}

export default function RocketViewer() {
  // Dikey FOV'a göre tüm modeli çerçeveleyen kamera mesafesi (+ pay).
  const fov = 38
  const distance = (TARGET_SIZE / 2 / Math.tan((fov / 2) * (Math.PI / 180))) * 1.5

  return (
    <div className="rocket-viewer">
      <Canvas camera={{ position: [distance * 0.5, distance * 0.25, distance], fov }}>
        <color attach="background" args={['#0a0f1c']} />
        <ambientLight intensity={0.6} />
        <hemisphereLight args={['#bcd4ff', '#1a2030', 0.6]} />
        <directionalLight position={[8, 12, 6]} intensity={1.4} />
        <directionalLight position={[-6, 4, -8]} intensity={0.5} color="#88aaff" />
        <Suspense fallback={null}>
          <Falcon9 />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={TARGET_SIZE * 0.6}
          maxDistance={TARGET_SIZE * 6}
          target={[0, 0, 0]}
        />
      </Canvas>
      <span className="viewer-hint">Sürükleyerek döndürün · tekerlek ile yakınlaştırın</span>
    </div>
  )
}
