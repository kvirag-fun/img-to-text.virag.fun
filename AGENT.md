These are instructions for an agentic AI to understand this project, its rules and limitations.

1. This project is a static site built with Vite + React + TypeScript + Tailwind CSS v4,
   deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). All
   processing (image → ASCII) runs client-side in the browser — no backend, no server.
2. The shared visual identity (paper background, blueprint grid, corner-ticks, header/footer
   treatment, fonts) lives in `vendor/blueprint-framework`, a git submodule shared with other
   virag.fun sites. Do not put project-specific content in that submodule — it is edited in
   its own repo. See its README for the update procedure.
3. `public/CNAME` must keep the custom domain (`img-to-text.virag.fun`) — Vite copies
   `public/*` verbatim into `dist/`, which is what GitHub Actions deploys.
4. The core conversion algorithm lives in `src/lib/ascii.ts`. Keep it a pure function —
   no DOM/React coupling — so it stays easy to test and reason about.
