import { Directory, File, Paths } from 'expo-file-system';

const ROOT = 'vidhanos';

function caseDocumentsDir(caseId: string): Directory {
  return new Directory(Paths.document, ROOT, 'cases', caseId, 'documents');
}

function citationsDir(): Directory {
  return new Directory(Paths.document, ROOT, 'citations');
}

/** Stores DB-relative paths (not absolute), so a device/OS path change never breaks references. */
export function relativeDocumentPath(caseId: string, documentId: string, ext: string): string {
  return `${ROOT}/cases/${caseId}/documents/${documentId}.${ext}`;
}

export function relativeCitationPath(citationId: string): string {
  return `${ROOT}/citations/${citationId}.pdf`;
}

export function resolveUri(relativePath: string): string {
  return new File(Paths.document, relativePath).uri;
}

export async function saveIncomingDocument(
  sourceUri: string,
  caseId: string,
  documentId: string,
  ext: string
): Promise<{ relativePath: string; sizeBytes: number }> {
  const dir = caseDocumentsDir(caseId);
  dir.create({ intermediates: true, idempotent: true });

  const relativePath = relativeDocumentPath(caseId, documentId, ext);
  const destination = new File(Paths.document, relativePath);
  const source = new File(sourceUri);
  source.copy(destination);

  return { relativePath, sizeBytes: destination.size ?? 0 };
}

export async function saveDownloadedCitation(sourceLocalUri: string, citationId: string): Promise<string> {
  const dir = citationsDir();
  dir.create({ intermediates: true, idempotent: true });

  const relativePath = relativeCitationPath(citationId);
  const destination = new File(Paths.document, relativePath);
  const source = new File(sourceLocalUri);
  source.copy(destination);

  return relativePath;
}

export function deleteFile(relativePath: string): void {
  const file = new File(Paths.document, relativePath);
  if (file.exists) file.delete();
}

function sizeOf(entry: File | Directory): number {
  if (entry instanceof File) return entry.size ?? 0;
  return entry.list().reduce((total, child) => total + sizeOf(child), 0);
}

export function getStorageUsageBytes(): number {
  const root = new Directory(Paths.document, ROOT);
  if (!root.exists) return 0;
  return sizeOf(root);
}
