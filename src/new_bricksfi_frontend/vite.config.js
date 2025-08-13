import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "@dfinity/agent",
        "@dfinity/auth-client",
        "@dfinity/identity",
        "@dfinity/principal",
        "@dfinity/candid",
      ],
      output: {
        globals: {
          "@dfinity/agent": "dfinityAgent",
          "@dfinity/auth-client": "dfinityAuthClient",
          "@dfinity/identity": "dfinityIdentity",
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ["@dfinity/agent", "@dfinity/auth-client", "@dfinity/identity"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    exclude: ["@dfinity/agent", "@dfinity/auth-client", "@dfinity/identity"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
    ],
  },
});
