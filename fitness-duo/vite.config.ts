// Configure the Lovable TanStack Start preset for Render's Node runtime.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: { preset: "render-com" },
  tanstackStart: {
    server: { entry: "server" },
  },
});
