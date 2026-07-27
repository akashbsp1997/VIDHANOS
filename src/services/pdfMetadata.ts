import { File } from 'expo-file-system';
import { PDFDocument } from 'pdf-lib';

export interface PdfMetadata {
  pageCount: number;
  title: string | null;
  author: string | null;
  createdAt: number | null;
  modifiedAt: number | null;
}

export async function extractPdfMetadata(fileUri: string): Promise<PdfMetadata | null> {
  try {
    const bytes = await new File(fileUri).bytes();
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });

    const createdDate = doc.getCreationDate();
    const modifiedDate = doc.getModificationDate();

    return {
      pageCount: doc.getPageCount(),
      title: doc.getTitle() ?? null,
      author: doc.getAuthor() ?? null,
      createdAt: createdDate ? createdDate.getTime() : null,
      modifiedAt: modifiedDate ? modifiedDate.getTime() : null,
    };
  } catch {
    return null;
  }
}
