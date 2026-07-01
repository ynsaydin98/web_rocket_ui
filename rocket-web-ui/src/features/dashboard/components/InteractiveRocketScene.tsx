import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function InteractiveRocketScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(5.5, 2.6, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 15;
    controls.target.set(0, 0.25, 0);

    const rocket = createRocket();
    scene.add(rocket);

    const grid = new THREE.GridHelper(16, 28, 0x245f91, 0x15334f);
    grid.position.y = -3.15;
    scene.add(grid);

    scene.add(new THREE.HemisphereLight(0xaedbff, 0x06101d, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38a3ff, 4.2);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

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
      controls.update();
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
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

function createRocket() {
  const rocket = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({
    color: 0xe8edf3,
    metalness: 0.72,
    roughness: 0.28,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x151b24,
    metalness: 0.82,
    roughness: 0.2,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0x287fc3,
    metalness: 0.7,
    roughness: 0.25,
  });

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.72, 4.8, 48),
    white,
  );
  body.position.y = -0.15;
  rocket.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.75, 48), white);
  nose.position.y = 3.125;
  rocket.add(nose);

  const avionicsBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.635, 0.655, 0.72, 48),
    graphite,
  );
  avionicsBand.position.y = 1.25;
  rocket.add(avionicsBand);

  const accentBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.64, 0.68, 0.1, 48),
    accent,
  );
  accentBand.position.y = 0.84;
  rocket.add(accentBand);

  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.56, 0.55, 40),
    graphite,
  );
  nozzle.position.y = -2.82;
  rocket.add(nozzle);

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(1.15, 0);
  finShape.lineTo(0, 1.65);
  finShape.closePath();
  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.12,
    bevelEnabled: false,
  });
  finGeometry.translate(0.48, -2.65, -0.06);

  for (let index = 0; index < 4; index += 1) {
    const fin = new THREE.Mesh(finGeometry, graphite);
    fin.rotation.y = index * (Math.PI / 2);
    rocket.add(fin);
  }

  rocket.rotation.z = -0.035;
  return rocket;
}
