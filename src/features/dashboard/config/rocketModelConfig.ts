// 3D roket modelinin kaynak dosyası. Desteklenen formatlar: .obj, .glb, .gltf.
//
// CATIA çıktıları için önerilen akış: CATIA'dan STEP (.stp) dışa aktarın ve
// glTF'e dönüştürüp (ör. CAD Assistant, FreeCAD veya `cadexchanger`)
// src/assets altına .glb olarak koyun. STEP, BREP tabanlı bir CAD formatı
// olduğu için tarayıcıda doğrudan render edilemez; .glb hem malzeme/renk
// bilgisini taşır hem de web için optimize yüklenir.
//
// Modeli değiştirmek için dosyayı assets'e ekleyip aşağıdaki import'u
// güncellemek yeterlidir; sahne yükleyiciyi dosya uzantısından seçer.
import rocketModelUrl from "../../../assets/roket.obj?url";

export const ROCKET_MODEL_URL: string = rocketModelUrl;
