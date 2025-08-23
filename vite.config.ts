import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base:
    process.env.NODE_ENV === "production" ? "/camper-booking-calendar/" : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
