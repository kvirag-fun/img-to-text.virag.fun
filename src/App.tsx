import { useCallback, useRef, useState } from "react";
import { Copy, Download, Check, ImageUp } from "lucide-react";
import { imageToAscii, loadImage } from "./lib/ascii";

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
  const [ascii, setAscii] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const img = await loadImage(file);
      setAscii(imageToAscii(img));
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
    const html = `<pre><code>${escaped}</code></pre>`;
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
          Krisztián Virág
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
        </section>

        <section className="corner-ticks relative mt-6 overflow-x-auto bg-[#0b0f17] p-5">
          <pre className="font-mono text-[8px] leading-[8px] text-white">
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
            Krisztián Virág · Structural Engineer / Product Manager · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
