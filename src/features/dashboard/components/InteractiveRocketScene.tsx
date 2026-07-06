import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ROCKET_MODEL_URL } from "../config/rocketModelConfig";

// Modelin sahnedeki hedef yüksekliği (dünya birimi). Model bu boyuta
// otomatik ölçeklenir ve sahne merkezine hizalanır.
const HEDEF_MODEL_YUKSEKLIGI = 6.3;

type InteractiveRocketSceneProps = {
  // IMU yönelim değerleri (derece). Veri yokken 0 kabul edilir.
  roll?: number;
  pitch?: number;
  yaw?: number;
  // Modelin başlangıç duruş düzeltmesi (derece). Model dosyasının
  // eksen yönelimi sahneyle uyuşmuyorsa elle girilir; IMU değerleri
  // bu offsetin üzerine eklenir.
  rollOffset?: number;
  pitchOffset?: number;
  yawOffset?: number;
};

export function InteractiveRocketScene({
  roll = 0,
  pitch = 0,
  yaw = 0,
  rollOffset = 0,
  pitchOffset = 0,
  yawOffset = 0,
}: InteractiveRocketSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef({
    roll: roll + rollOffset,
    pitch: pitch + pitchOffset,
    yaw: yaw + yawOffset,
  });

  useEffect(() => {
    orientationRef.current = {
      roll: roll + rollOffset,
      pitch: pitch + pitchOffset,
      yaw: yaw + yawOffset,
    };
  }, [roll, pitch, yaw, rollOffset, pitchOffset, yawOffset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let modelPivot: THREE.Group | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(5.5, 2.6, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Sahne etkileşimsizdir; model yalnızca IMU + offset ile yönelir.
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xaedbff, 0x06101d, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38a3ff, 4.2);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    loadRocketModel(ROCKET_MODEL_URL)
      .then((object) => {
        // Bileşen yükleme tamamlanmadan önce kaldırıldıysa modeli
        // sahneye ekleme; kaynakları hemen serbest bırak.
        if (disposed) {
          disposeObject3D(object);
          return;
        }
        modelPivot = frameModel(object);
        scene.add(modelPivot);
      })
      .catch((error) => {
        console.error(`Roket modeli (${ROCKET_MODEL_URL}) yüklenemedi:`, error);
      });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let animationFrame = 0;
    const animate = () => {
      // IMU yönelimini modele uygula: yaw -> dikey eksen (pusula ile
      // aynı yön), pitch -> X, roll -> Z (yapay ufuk ile aynı yön).
      if (modelPivot) {
        const orientation = orientationRef.current;
        modelPivot.rotation.set(
          THREE.MathUtils.degToRad(orientation.pitch),
          -THREE.MathUtils.degToRad(orientation.yaw),
          -THREE.MathUtils.degToRad(orientation.roll),
        );
      }
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-rocket-scene"
      aria-label="Etkileşimli üç boyutlu roket modeli"
    />
  );
}

// Model dosyasını uzantısına göre uygun three.js yükleyicisiyle yükler.
// .glb/.gltf (CATIA -> STEP -> glTF dönüşümü çıktıları) kendi materyalleriyle
// gelir; .obj materyalsiz olduğundan metalik varsayılan materyal uygulanır.
async function loadRocketModel(url: string): Promise<THREE.Object3D> {
  const uzanti = url.split("?")[0].split(".").pop()?.toLowerCase();

  if (uzanti === "glb" || uzanti === "gltf") {
    const gltf = await new GLTFLoader().loadAsync(url);
    return gltf.scene;
  }

  const object = await new OBJLoader().loadAsync(url);
  applyRocketMaterial(object);
  return object;
}

// Yüklenen OBJ mesh'lerine mission-control tarzı metalik materyal uygular.
// OBJ dosyasında normal verisi yoksa aydınlatmanın doğru çalışması için
// yüzey normalleri hesaplanır.
function applyRocketMaterial(object: THREE.Object3D) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xe8edf3,
    metalness: 0.72,
    roughness: 0.28,
  });

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (!child.geometry.getAttribute("normal")) {
      child.geometry.computeVertexNormals();
    }
    child.material = material;
  });
}

// Modeli bir pivot grubuna alır; boyutundan bağımsız olarak hedef
// yüksekliğe ölçekler ve merkezini sahne orijinine hizalar. Pivot,
// IMU yönelim rotasyonlarının modelin merkezinden uygulanmasını sağlar.
function frameModel(object: THREE.Object3D): THREE.Group {
  const pivot = new THREE.Group();
  // Yaw (dikey eksen) önce uygulanır; ardından pitch ve roll.
  pivot.rotation.order = "YXZ";
  pivot.add(object);

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Modelin merkezini pivot orijinine taşı.
  object.position.sub(center);

  const maxBoyut = Math.max(size.x, size.y, size.z) || 1;
  pivot.scale.setScalar(HEDEF_MODEL_YUKSEKLIGI / maxBoyut);

  return pivot;
}

// Sahneye eklenmeden serbest bırakılan bir modelin geometri ve
// materyallerini temizler (yükleme, unmount sonrası tamamlanırsa).
function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach((material) => material.dispose());
  });
}
