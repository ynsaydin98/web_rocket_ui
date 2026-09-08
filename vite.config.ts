import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { readFileSync } from "node:fs";
// @ts-expect-error - kopru eklentisi sade JS modulu olarak tutuluyor.
import { seriUdpKopruPlugin } from "./scripts/kopru/kopruVitePlugin.mjs";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

// https://vite.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // Seri port <-> UDP koprusu dev/preview sunucusuyla birlikte ayaga kalkar.
    seriUdpKopruPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 700,
  },
});
