import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward any calls to /assetdata/... to your FastAPI at http://localhost:8000/api/assetdata/...
      "/assetdata": {
        target: "http://localhost:8000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assetdata/, "/assetdata"),
      },
    },
  },
});
