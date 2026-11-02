// The Lovable TanStack preset supplies TanStack Start, React, Tailwind, path aliases,
// and the Nitro Cloudflare build target used by this project.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
