import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Download, Check, ImageUp } from "lucide-react";
import {
  imageToAscii,
  loadImage,
  DEFAULT_OUTPUT_WIDTH,
  MIN_OUTPUT_WIDTH,
  MAX_OUTPUT_WIDTH,
  type BackgroundTarget,
} from "./lib/ascii";

function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" className="blueprint-button" onClick={onClick} disabled={disabled}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

export default function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(DEFAULT_OUTPUT_WIDTH);
  const [background, setBackground] = useState<BackgroundTarget>("light");
  const [ascii, setAscii] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-render the ASCII art whenever a new image loads, the width slider
  // changes, or the target background switches — the character mapping
  // itself depends on which background the result will be viewed against.
  useEffect(() => {
    if (image) setAscii(imageToAscii(image, width, background));
  }, [image, width, background]);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const img = await loadImage(file);
      setImage(img);
      setFileName(file.name);
    } catch {
      setError("Couldn't read that image. Try a different file.");
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!ascii) return;
    const blob = new Blob([ascii], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-art.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [ascii]);

  const handleCopy = useCallback(async () => {
    if (!ascii) return;
    const escaped = ascii.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Apps that read the rich clipboard entry (Word, Teams, most comment
    // fields) ignore <pre>'s implicit monospace default — they only honor
    // inline styles. Consolas/Courier New cover Windows+Office, Menlo/Monaco
    // cover Mac, so the font stays monospace wherever this gets pasted.
    const html = `<pre style="margin:0;font-family:Consolas,'Courier New',Menlo,Monaco,'Liberation Mono',monospace;font-size:10px;line-height:10px;white-space:pre;"><code style="font-family:inherit;white-space:inherit;">${escaped}</code></pre>`;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([ascii], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(ascii);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [ascii]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-blueprint-grid" aria-hidden="true" />

      <header className="blueprint-topbar">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Ing. Krisztián Virág
        </span>
      </header>

      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8">
        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Image to ASCII
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Upload a photo and get back plain-text ASCII art — converted entirely in your
          browser, nothing leaves your device.
        </p>

        <section className="mt-10 border border-border bg-card p-5">
          <label className="flex cursor-pointer flex-wrap items-center gap-4">
            <span className="blueprint-button">
              <ImageUp className="h-3.5 w-3.5" aria-hidden="true" />
              Choose image
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              {fileName || "No file selected"}
            </span>
          </label>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {image && (
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
              <label htmlFor="width" className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Width
              </label>
              <input
                id="width"
                type="range"
                min={MIN_OUTPUT_WIDTH}
                max={MAX_OUTPUT_WIDTH}
                step={10}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="h-1 flex-1 accent-primary"
              />
              <span className="w-28 shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                {width} columns
              </span>
            </div>
          )}

          {image && (
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Optimize for
              </span>
              <div className="flex border border-border">
                <button
                  type="button"
                  onClick={() => setBackground("light")}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    background === "light"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-primary"
                  }`}
                >
                  Light mode
                </button>
                <button
                  type="button"
                  onClick={() => setBackground("dark")}
                  className={`border-l border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    background === "dark"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-primary"
                  }`}
                >
                  Dark mode
                </button>
              </div>
            </div>
          )}
        </section>

        <section
          className={`corner-ticks relative mt-6 overflow-x-auto p-5 ${
            background === "dark" ? "bg-[#0b0f17]" : "bg-card"
          }`}
        >
          <pre
            className={`font-mono text-[8px] leading-[8px] ${
              background === "dark" ? "text-white" : "text-foreground"
            }`}
          >
            {ascii || "Upload an image to see the ASCII preview here..."}
          </pre>
        </section>

        <div className="mt-6 flex flex-wrap gap-2">
          <IconButton
            icon={copied ? Check : Copy}
            label={copied ? "Copied!" : "Copy text"}
            onClick={handleCopy}
            disabled={!ascii}
          />
          <IconButton icon={Download} label="Download .txt" onClick={handleDownload} disabled={!ascii} />
        </div>

        <footer className="mt-20 border-t border-border pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Ing. Krisztián Virág · Product Manager · Bratislava, Slovak Republic · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
