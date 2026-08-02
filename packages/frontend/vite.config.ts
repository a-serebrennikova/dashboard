import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "vendor-recharts";
            }

            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }

            if (id.includes("react-dom") || id.includes("react")) {
              return "vendor-react";
            }

            return "vendor";
          }
        },
      },
    },
  },
});
