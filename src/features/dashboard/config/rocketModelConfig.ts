// 3D roket modelinin kaynak dosyası.
// Desteklenen formatlar: .obj, .glb, .gltf, .stp ve .step.
//
// STEP dosyaları tarayıcıda OpenCascade WASM ile geometriye dönüştürülür.
// Büyük CAD modellerinde ilk yükleme .glb'ye göre daha uzun sürebilir.
//
// Modeli değiştirmek için dosyayı assets'e ekleyip aşağıdaki import'u
// güncellemek yeterlidir; sahne yükleyiciyi dosya uzantısından seçer.
import rocketModelUrl from "../../../assets/roket.obj?url";

export const ROCKET_MODEL_URL: string = rocketModelUrl;
