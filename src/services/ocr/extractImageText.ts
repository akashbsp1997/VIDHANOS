export interface ImageTextResult {
  text: string;
  confidence: number;
}

/**
 * OCR for a photographed/scanned image, entirely on-device via tesseract.js.
 * The recognition engine (~15MB WASM core + trained data) is fetched from its
 * default CDN on first use; vite.config.ts runtime-caches that origin so every
 * OCR run after the first successful one works with no network at all.
 */
export async function extractImageText(file: File, onProgress?: (percent: number) => void): Promise<ImageTextResult> {
  const { createWorker } = await import('tesseract.js');

  const worker = await createWorker('eng', 1, {
    logger: onProgress
      ? (m) => {
          if (m.status === 'recognizing text') onProgress(Math.round((m.progress || 0) * 100));
        }
      : undefined,
  });

  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(file);
    return { text: text.trim(), confidence };
  } finally {
    await worker.terminate();
  }
}
