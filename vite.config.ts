import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/",
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react({ jsxImportSource: "react" }),
    // Lovable-Tagger nur in Entwicklung verwenden
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  optimizeDeps: {
    include: ["react", "react-dom"],
    force: true, // zwingt Vite, Abhängigkeiten neu zu verarbeiten
  },
  build: {
    sourcemap: true,
    minify: "terser",
    // Optional, um dynamische Imports besser zu behandeln
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));

