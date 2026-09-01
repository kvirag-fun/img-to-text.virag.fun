import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative asset URLs so the static build works from any sub-path.
  base: "./",
  plugins: [react(), tailwindcss()],
});
