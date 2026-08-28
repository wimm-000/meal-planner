import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    netlifyReactRouter(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      manifest: {
        name: "Weekly Meal Planner",
        short_name: "Meal Planner",
        description: "Plan weekly meals, recipes, and shopping in one place.",
        theme_color: "#f1f6e9",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/assets/maskable-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/assets/maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{css,js,ico,png,svg,webmanifest}"],
        navigateFallback: null,
        runtimeCaching: [],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
