# Fitness Duo

Standalone TanStack Start application copied from the Lovable project.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The Vite preset configures TanStack Start with Nitro's Cloudflare target. This is an SSR application; it is **not** a plain static folder that can be copied into GitHub Pages. Deploy it to a compatible server/runtime (for example Cloudflare Workers via the Nitro preset), or adapt it to a static SPA/export before using GitHub Pages.

Keep this app isolated under `fitness-duo/`; do not replace the repository root site or its deployment workflow.
