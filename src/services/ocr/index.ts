import { extractImageText } from './extractImageText';
import { extractPdfText } from './extractPdfText';

export interface DocumentTextResult {
  text: string;
  confidence?: number;
}

/**
 * Best-effort on-device text extraction. Never throws — a failure here should
 * never block the upload/wizard flow, it just means less context for
 * AI/offline analysis downstream.
 */
export async function extractDocumentText(file: File, fileType: 'image' | 'pdf'): Promise<DocumentTextResult | null> {
  try {
    if (fileType === 'pdf') {
      const result = await extractPdfText(file);
      // A scanned/photographed PDF has ~no text layer for pdf.js to find; per-page
      // image OCR of a PDF is out of scope here (same limit the scaffold this was
      // ported from left unimplemented) — the text is just left short/empty.
      return { text: result.text };
    }
    const result = await extractImageText(file);
    return { text: result.text, confidence: result.confidence };
  } catch {
    return null;
  }
}
