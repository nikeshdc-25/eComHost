import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer"; // For analyzing bundle size

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
  plugins: [
    react(),
    visualizer({
      open: true, // Opens the stats report in the browser
      filename: "bundle-visualizer.html",
      template: "treemap", // Options: sunburst, treemap, network, circle
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    minify: "esbuild", // Use esbuild for minification
    sourcemap: true, // Helpful for debugging and analysis
  },
});
