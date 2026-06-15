// Ana sayfanın ortasındaki Falcon 9 3D görüntüleyicisi.
// Model src/assets/models/falcon9.obj dosyasından yüklenir.

import { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MeshStandardMaterial, type Group, type Mesh } from 'three'
import falcon9Url from '../../assets/models/falcon9.obj?url'

function Falcon9() {
  const obj = useLoader(OBJLoader, falcon9Url)

  const model = useMemo(() => {
    const clone = obj.clone(true) as Group
    const material = new MeshStandardMaterial({
      color: '#d6dde6',
      metalness: 0.6,
      roughness: 0.35,
    })
    clone.traverse((child) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        mesh.material = material
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    return clone
  }, [obj])

  return <primitive object={model} />
}

export default function RocketViewer() {
  return (
    <div className="rocket-viewer">
      <Canvas camera={{ position: [6, 5, 9], fov: 42 }} shadows>
        <color attach="background" args={['#0a0f1c']} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} adjustCamera shadows="contact">
            <Falcon9 />
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} minDistance={4} maxDistance={20} />
      </Canvas>
      <span className="viewer-hint">Sürükleyerek döndürün · tekerlek ile yakınlaştırın</span>
    </div>
  )
}
