// Lovable's TanStack preset configures TanStack Start, React and Tailwind.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "render_com",
  },
});
