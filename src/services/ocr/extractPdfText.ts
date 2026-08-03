const NEEDS_OCR_CHARS_PER_PAGE = 100; // a scanned/photographed page has ~no extractable text layer

export interface PdfTextResult {
  text: string;
  pageCount: number;
  charsPerPage: number;
  /** True when the PDF has ~no real text layer (scanned/photographed) — caller should try image OCR per page instead. */
  needsOcr: boolean;
}

/** Client-side text-layer extraction via pdf.js. No network call for a born-digital PDF. */
export async function extractPdfText(file: File): Promise<PdfTextResult> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n\n';
  }

  const cleaned = text.trim();
  const charsPerPage = cleaned.replace(/\s+/g, '').length / Math.max(pdf.numPages, 1);

  return {
    text: cleaned,
    pageCount: pdf.numPages,
    charsPerPage: Math.round(charsPerPage),
    needsOcr: charsPerPage < NEEDS_OCR_CHARS_PER_PAGE,
  };
}
