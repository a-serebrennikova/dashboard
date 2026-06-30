import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: false,
  bundle: true,
  noExternal: ["@package/dashboard-shared"],
});
