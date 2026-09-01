// Darkest to lightest characters.
const ASCII_CHARS =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

export const DEFAULT_OUTPUT_WIDTH = 120;
export const MIN_OUTPUT_WIDTH = 30;
export const MAX_OUTPUT_WIDTH = 300;

export function imageToAscii(img: HTMLImageElement, width: number = DEFAULT_OUTPUT_WIDTH): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Characters are roughly twice as tall as they are wide, so compensate
  // when deriving the output height from the image's aspect ratio.
  const height = Math.floor((img.height / img.width) * width * 0.5);

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
    const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
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
