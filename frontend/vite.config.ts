import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "state-vendor": ["@reduxjs/toolkit", "react-redux"],
          "form-vendor": ["react-hook-form", "zod", "@hookform/resolvers"],
          "dnd-vendor": ["react-dnd", "react-dnd-html5-backend", "dnd-core"],
          "select-vendor": ["react-select"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
