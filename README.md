# 🖼️ Image to ASCII Converter

A fast, 100% client-side web tool that converts uploaded images into ASCII art text files (`.txt`). Built with React, Vite and Tailwind CSS, deployed to **GitHub Pages** via GitHub Actions.

---

## ✨ Features

* **100% Private & Local:** All image processing runs in the browser via the HTML5 Canvas API. No images are uploaded to any server.
* **Instant Text Export:** Download your generated ASCII art as a clean `.txt` file, or copy it straight to the clipboard.
* **Aspect Ratio Correction:** Automatic vertical scaling compensates for font dimensions so images don't look stretched.

## Stack

React + Vite + TypeScript + Tailwind CSS v4, styled with the shared
[`blueprint-framework`](https://github.com/kvirag-fun/virag.fun_blueprint_framework) design
system (a git submodule — see that repo's README for setup and update instructions).

## Development

```sh
bun install
bun run dev
```

## Build

```sh
bun run build
```

Deploys automatically to GitHub Pages on push to `main` via
`.github/workflows/deploy.yml`.
