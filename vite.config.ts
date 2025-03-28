import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import { imagetools } from "vite-imagetools";

export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "::",
      port: 8080,
    },
    base: "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react({ plugins: [] }),
      mode === "development" && componentTagger(),
      imagetools({
        defaultDirectives: new URLSearchParams("?format=webp&quality=85"),
      }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp}"],
          runtimeCaching: [
            {
              urlPattern:
                /^https:\/\/ida-smartbase-documents\.s3\..*\.amazonaws\.com\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "aws-s3-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
            {
              urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        manifest: {
          name: "IDA SmartBase",
          short_name: "IDASmart",
          description: "Patientenverwaltung und Dokumentationssystem",
          theme_color: "#e6217d",
          icons: [
            {
              src: "/favicon.ico",
              sizes: "64x64",
              type: "image/x-icon",
            },
          ],
          display: "standalone",
          start_url: "/",
        },
      }),
    ].filter(Boolean),
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "lucide-react",
        "sonner",
      ],
      exclude: [],
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            main: [
              "./src/main.tsx",
              "./src/App.tsx",
            ],
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-ui": [
              "@tanstack/react-query",
              "lucide-react",
              "sonner",
            ],
          },
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },
      cssCodeSplit: false,
      sourcemap: true,
      assetsInlineLimit: 4096,
    },
    publicDir: "public",
  };
});
