import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgPlugin(),
    VitePWA({
      injectRegister: "inline",
      registerType: "autoUpdate",
      manifest: {
        short_name: "CAF",
        name: "Cards Against Formality",
        icons: [
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "android-chrome-192x192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "android-chrome-512x512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: "/rooms",
        scope: ".",
        display: "standalone",
        theme_color: "#303030",
        background_color: "#303030",
      },
    }),
  ],
  build: {
    outDir: "build",
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
});
