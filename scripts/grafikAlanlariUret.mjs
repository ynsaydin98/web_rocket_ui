import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const uiModelsRoot = join(process.cwd(), "src", "ui-models");
const outputFile = join(
  process.cwd(),
  "src",
  "features",
  "grafik",
  "config",
  "generatedGrafikAlanlari.ts",
);

function listTsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return listTsFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".ts") ? [fullPath] : [];
  });
}

function toLabel(messageTypeName) {
  return messageTypeName.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function parseModel(source) {
  const bodyMatch = source.match(/export\s+type\s+(\w+)\s*=\s*{([\s\S]*?)^};/m);
  if (!bodyMatch) return undefined;

  const fields = [];
  // "deger: number;" ve "deger: number | undefined;" alanlari grafige acilir.
  // Sayisal alanlar servis tarafinda okunamadiginda undefined olabildigi icin
  // ikinci bicim de eslesmek zorunda (bkz. src/shared/utils/sayisalDogrulama.ts).
  const fieldRegex =
    /^\s*([A-Za-z_][A-Za-z0-9_]*)\??:\s*number(?:\s*\|\s*undefined)?\s*;/gm;
  let match;
  while ((match = fieldRegex.exec(bodyMatch[2])) !== null) {
    fields.push(match[1]);
  }
  return {
    messageTypeName: bodyMatch[1].replace(/UiModel$/, ""),
    fields,
  };
}

const kaynaklar = listTsFiles(uiModelsRoot)
  .map((filePath) => {
    const source = readFileSync(filePath, "utf8");
    const model = parseModel(source);
    const messageTypeName = model?.messageTypeName ?? basename(filePath, "UiModel.ts");
    return {
      messageTypeName,
      label: toLabel(messageTypeName),
      source: relative(process.cwd(), filePath).replace(/\\/g, "/"),
      alanlar: (model?.fields ?? []).map((field) => ({
        key: field,
        label: field,
      })),
    };
  })
  .filter((kaynak) => kaynak.alanlar.length > 0)
  .sort((a, b) => a.messageTypeName.localeCompare(b.messageTypeName));

const content = `// Bu dosya scripts/grafikAlanlariUret.mjs tarafindan uretilir.
// Elle duzenlemeyin; ui-model type alanlari degistiginde script yeniden calistirilir.

export type GeneratedGrafikKaynakAlanlari = {
  messageTypeName: string;
  label: string;
  source: string;
  alanlar: Array<{ key: string; label: string }>;
};

export const GENERATED_GRAFIK_ALANLARI = ${JSON.stringify(kaynaklar, null, 2)} as const satisfies readonly GeneratedGrafikKaynakAlanlari[];
`;

mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, content, "utf8");

console.log(
  `Grafik alan metadata uretildi: ${relative(process.cwd(), outputFile)} (${kaynaklar.length} kaynak)`,
);
