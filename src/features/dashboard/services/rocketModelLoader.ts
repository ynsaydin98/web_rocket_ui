import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import occtScriptUrl from "occt-import-js/dist/occt-import-js.js?url";
import occtWasmUrl from "occt-import-js/dist/occt-import-js.wasm?url";

type OcctMesh = {
  name: string;
  color?: number[];
  attributes: {
    position: { array: number[] };
    normal?: { array: number[] };
  };
  index: { array: number[] };
};

type OcctResult = {
  success: boolean;
  meshes: OcctMesh[];
};

type OcctModule = {
  ReadStepFile: (content: Uint8Array, params: null) => OcctResult;
};

type OcctInitializer = (options?: {
  locateFile?: (path: string) => string;
}) => Promise<OcctModule>;

let occtInitializerPromise: Promise<OcctInitializer> | undefined;

export async function loadRocketModel(url: string): Promise<THREE.Object3D> {
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase();

  if (extension === "glb" || extension === "gltf") {
    const gltf = await new GLTFLoader().loadAsync(url);
    return gltf.scene;
  }

  if (extension === "stp" || extension === "step") {
    return loadStepModel(url);
  }

  if (extension === "obj") {
    const object = await new OBJLoader().loadAsync(url);
    applyRocketMaterial(object);
    return object;
  }

  throw new Error(`Desteklenmeyen 3D model formati: .${extension ?? "bilinmiyor"}`);
}

async function loadStepModel(url: string): Promise<THREE.Object3D> {
  const initializeOcct = await loadOcctInitializer();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`STEP dosyasi alinamadi (${response.status}).`);
  }

  const occt = await initializeOcct({
    locateFile: (path) => (path.endsWith(".wasm") ? occtWasmUrl : path),
  });
  const result = occt.ReadStepFile(
    new Uint8Array(await response.arrayBuffer()),
    null,
  );
  if (!result.success || result.meshes.length === 0) {
    throw new Error("STEP modeli geometriye donusturulemedi.");
  }

  const group = new THREE.Group();
  result.meshes.forEach((sourceMesh) => {
    const geometry = new THREE.BufferGeometry();
    geometry.name = sourceMesh.name;
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sourceMesh.attributes.position.array, 3),
    );
    if (sourceMesh.attributes.normal) {
      geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(sourceMesh.attributes.normal.array, 3),
      );
    } else {
      geometry.computeVertexNormals();
    }
    geometry.setIndex(sourceMesh.index.array);

    const color = sourceMesh.color
      ? new THREE.Color(...(sourceMesh.color as [number, number, number]))
      : new THREE.Color(0xe8edf3);
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.55,
      roughness: 0.32,
    });
    group.add(new THREE.Mesh(geometry, material));
  });

  return group;
}

function loadOcctInitializer(): Promise<OcctInitializer> {
  if (window.occtimportjs) {
    return Promise.resolve(window.occtimportjs);
  }
  if (occtInitializerPromise) {
    return occtInitializerPromise;
  }

  occtInitializerPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = occtScriptUrl;
    script.async = true;
    script.onload = () => {
      if (window.occtimportjs) {
        resolve(window.occtimportjs);
        return;
      }
      reject(new Error("OpenCascade yukleyicisi baslatilamadi."));
    };
    script.onerror = () => {
      occtInitializerPromise = undefined;
      reject(new Error("OpenCascade script dosyasi yuklenemedi."));
    };
    document.head.appendChild(script);
  });

  return occtInitializerPromise;
}

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

declare global {
  interface Window {
    occtimportjs?: OcctInitializer;
  }
}
