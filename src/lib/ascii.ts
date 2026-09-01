// Darkest to lightest characters.
const ASCII_CHARS =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

export const DEFAULT_OUTPUT_WIDTH = 120;
export const MIN_OUTPUT_WIDTH = 30;
export const MAX_OUTPUT_WIDTH = 300;

// IBM Plex Mono's measured glyph advance width, as a fraction of its
// font-size (verified via canvas measureText at font-size 200px: every
// glyph in a monospace font shares one advance width, and IBM Plex Mono's
// is 0.602 * font-size). Both the preview and the copied HTML render at
// line-height == font-size, so a character cell's on-screen aspect ratio
// is 1 : CHAR_ASPECT_RATIO (height : width) — used below to keep the
// output block's proportions matching the source image's.
const CHAR_ASPECT_RATIO = 0.602;

export type BackgroundTarget = "light" | "dark";

export function imageToAscii(
  img: HTMLImageElement,
  width: number = DEFAULT_OUTPUT_WIDTH,
  optimizeFor: BackgroundTarget = "light",
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const height = Math.floor((img.height / img.width) * width * CHAR_ASPECT_RATIO);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const { data: pixels } = ctx.getImageData(0, 0, width, height);

  let ascii = "";
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]!;
    const g = pixels[i + 1]!;
    const b = pixels[i + 2]!;

    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // Dense characters carry more visible ink than sparse ones, so which
    // brightness they should represent depends on what color that ink
    // will be against. On a light background (dark ink), dense = dark
    // pixel. On a dark background (light ink), dense = light pixel —
    // the exact opposite — so the mapping flips there.
    const normalized = optimizeFor === "dark" ? (255 - brightness) / 255 : brightness / 255;
    const charIndex = Math.floor(normalized * (ASCII_CHARS.length - 1));
    ascii += ASCII_CHARS[charIndex];

    if ((i / 4 + 1) % width === 0) {
      ascii += "\n";
    }
  }

  return ascii;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => resolve(img);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
