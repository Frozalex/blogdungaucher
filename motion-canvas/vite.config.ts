import { defineConfig } from "vite";
import motionCanvasPlugin from "@motion-canvas/vite-plugin";

// Le plugin est publié en CJS avec `module.exports.default = fn`.
// Selon l'interop CJS↔ESM, l'import par défaut peut renvoyer un wrapper :
// on fallback explicitement sur `.default` si besoin.
const motionCanvas = (motionCanvasPlugin as unknown as { default?: typeof motionCanvasPlugin })
  .default ?? motionCanvasPlugin;

export default defineConfig({
  plugins: [
    motionCanvas({
      project: "./src/project.ts",
    }),
    {
      name: "motion-canvas-vite8-target",
      // Motion Canvas 3 emits Vite's former "modules" target. Rolldown
      // requires an explicit ECMAScript target instead.
      config: () => ({ build: { target: "es2020" } }),
    },
  ],
  server: {
    port: 9000,
  },
});
