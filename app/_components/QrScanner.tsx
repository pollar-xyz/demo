"use client";

// Generic QR input: hands back whatever string a code contains, without
// interpreting it. Three ways in — the live camera (native BarcodeDetector when
// the browser has it, jsQR on a canvas otherwise), pasting the payload, and
// uploading a screenshot of the code.
//
// The camera needs a secure context: it works on localhost and over https, and
// is simply unavailable on a plain-http LAN address.
//
// Sep7Scanner does the same job for `web+stellar:` URIs and still carries its
// own copy of this plumbing; it could be rebased on this component.

import jsQR from "jsqr";
import { useCallback, useEffect, useRef, useState } from "react";

export type QrScannerLabels = {
  modeCamera: string;
  modePaste: string;
  cameraStart: string;
  cameraStop: string;
  cameraHint: string;
  cameraDenied: string;
  cameraUnsupported: string;
  scanning: string;
  pasteLabel: string;
  pastePh: string;
  pasteBtn: string;
  uploadBtn: string;
  decodeFailed: string;
};

type Mode = "camera" | "paste";

const btnPrimary =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";
const btnSecondary =
  "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// `BarcodeDetector` isn't in the DOM lib types yet — describe just what we call.
type BarcodeDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};
type BarcodeDetectorCtor = {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
};

export function QrScanner({
  labels,
  onDecode,
}: {
  labels: QrScannerLabels;
  // Called with the raw contents of the code. Validation is the caller's job.
  onDecode: (raw: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("camera");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  // Holds the latest decode loop so the recursive rAF never closes over a stale
  // copy (and doesn't need to reference itself before it's declared).
  const scanFrameRef = useRef<() => void>(() => {});

  // Stop the camera and cancel the decode loop. Safe to call more than once.
  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  const handleRaw = useCallback(
    (raw: string) => {
      const value = raw.trim();
      if (!value) return;
      setError(null);
      stopCamera();
      onDecode(value);
    },
    [onDecode, stopCamera],
  );

  // Schedule the next frame through the ref, so the loop stays current.
  const scheduleNext = useCallback(() => {
    rafRef.current = requestAnimationFrame(() => scanFrameRef.current());
  }, []);

  // Decode one video frame — BarcodeDetector first, jsQR on a canvas otherwise.
  const scanFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) {
      scheduleNext();
      return;
    }

    let decoded: string | null = null;
    if (detectorRef.current) {
      try {
        const found = await detectorRef.current.detect(video);
        decoded = found[0]?.rawValue ?? null;
      } catch {
        // Detector can throw on a not-ready frame — just try the next one.
      }
    } else {
      const w = video.videoWidth;
      const h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        decoded = jsQR(data, w, h)?.data ?? null;
      }
    }

    if (decoded) {
      handleRaw(decoded);
      return; // handleRaw() stops the loop
    }
    scheduleNext();
  }, [handleRaw, scheduleNext]);

  // Keep the ref pointing at the newest loop closure.
  useEffect(() => {
    scanFrameRef.current = scanFrame;
  }, [scanFrame]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(labels.cameraUnsupported);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      const Ctor = (
        window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }
      ).BarcodeDetector;
      detectorRef.current = Ctor ? new Ctor({ formats: ["qr_code"] }) : null;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      scheduleNext();
    } catch {
      // NotAllowedError (denied) or any other getUserMedia failure.
      setError(labels.cameraDenied);
      stopCamera();
    }
  }, [labels.cameraDenied, labels.cameraUnsupported, scheduleNext, stopCamera]);

  // Always release the camera when the component unmounts.
  useEffect(() => stopCamera, [stopCamera]);

  function switchMode(next: Mode) {
    if (next !== "camera") stopCamera();
    setMode(next);
  }

  async function decodeImageFile(file: File) {
    setError(null);
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      // A scratch canvas of its own — the ref'd one belongs to the camera loop,
      // and resizing it from here would fight with it.
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setError(labels.decodeFailed);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const found = jsQR(data, width, height);
      if (!found) {
        setError(labels.decodeFailed);
        return;
      }
      handleRaw(found.data);
    } catch {
      setError(labels.decodeFailed);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const tabBtn = (value: Mode, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => switchMode(value)}
      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
        mode === value
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-light hover:text-muted"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="inline-flex w-full gap-1 rounded-lg border border-border bg-surface p-1">
        {tabBtn("camera", labels.modeCamera)}
        {tabBtn("paste", labels.modePaste)}
      </div>

      {mode === "camera" ? (
        <div className="space-y-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-black/90">
            <video
              ref={videoRef}
              muted
              playsInline
              className={`h-full w-full object-cover ${cameraOn ? "" : "opacity-0"}`}
            />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                <p className="text-xs font-mono text-muted-light">
                  {labels.cameraHint}
                </p>
              </div>
            )}
            {cameraOn && (
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
                <span className="rounded bg-black/60 px-2 py-1 text-[10px] font-mono text-white">
                  {labels.scanning}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {cameraOn ? (
              <button
                type="button"
                onClick={stopCamera}
                className={btnSecondary}
              >
                {labels.cameraStop}
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className={btnPrimary}
              >
                {labels.cameraStart}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-mono text-muted">
              {labels.pasteLabel}
            </label>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder={labels.pastePh}
              spellCheck={false}
              rows={3}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-xs font-mono outline-none focus:border-primary placeholder:text-muted-light"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleRaw(pasted)}
              disabled={!pasted.trim()}
              className={btnPrimary}
            >
              {labels.pasteBtn}
            </button>
            <label className={`${btnSecondary} cursor-pointer`}>
              {labels.uploadBtn}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) decodeImageFile(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      )}

      {error && <p className="text-xs font-mono text-error">{error}</p>}

      {/* Off-screen scratch canvas used by both the camera loop and uploads. */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
