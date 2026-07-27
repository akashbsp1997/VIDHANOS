import { unzipSync, zipSync } from 'fflate';

import { db } from '@/db/schema';

const DB_ENTRY = 'database.json';

interface BackupDatabase {
  clients: unknown[];
  opponents: unknown[];
  cases: unknown[];
  caseOpponents: unknown[];
  hearings: unknown[];
  documentsMeta: unknown[];
  citations: unknown[];
  legalReferences: unknown[];
  documentAnalyses: unknown[];
  settings: unknown[];
}

export async function exportBackup(): Promise<void> {
  const [clients, opponents, cases, caseOpponents, hearings, documents, citations, legalReferences, documentAnalyses, settings] =
    await Promise.all([
      db.clients.toArray(),
      db.opponents.toArray(),
      db.cases.toArray(),
      db.caseOpponents.toArray(),
      db.hearings.toArray(),
      db.documents.toArray(),
      db.citations.toArray(),
      db.legalReferences.toArray(),
      db.documentAnalyses.toArray(),
      db.settings.toArray(),
    ]);

  const files: Record<string, Uint8Array> = {};
  const documentsMeta = [];

  for (const doc of documents) {
    const { fileBlob, thumbnailBlob, ...meta } = doc;
    documentsMeta.push(meta);
    files[`files/documents/${doc.id}`] = new Uint8Array(await fileBlob.arrayBuffer());
    if (thumbnailBlob) {
      files[`files/thumbnails/${doc.id}`] = new Uint8Array(await thumbnailBlob.arrayBuffer());
    }
  }

  const database: BackupDatabase = {
    clients,
    opponents,
    cases,
    caseOpponents,
    hearings,
    documentsMeta,
    citations,
    legalReferences,
    documentAnalyses,
    settings,
  };

  files[DB_ENTRY] = new TextEncoder().encode(JSON.stringify(database));

  const zipped = zipSync(files, { level: 6 });
  const blob = new Blob([new Uint8Array(zipped)], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `vidhanos-backup-${new Date().toISOString().slice(0, 10)}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<void> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const files = unzipSync(bytes);

  const dbJson = files[DB_ENTRY];
  if (!dbJson) throw new Error('Not a valid VIDHANOS backup file.');
  const database = JSON.parse(new TextDecoder().decode(dbJson)) as BackupDatabase;

  await db.transaction(
    'rw',
    [db.clients, db.opponents, db.cases, db.caseOpponents, db.hearings, db.documents, db.citations, db.legalReferences, db.documentAnalyses, db.settings],
    async () => {
      await Promise.all([
        db.clients.bulkPut(database.clients as never[]),
        db.opponents.bulkPut(database.opponents as never[]),
        db.cases.bulkPut(database.cases as never[]),
        db.caseOpponents.bulkPut(database.caseOpponents as never[]),
        db.hearings.bulkPut(database.hearings as never[]),
        db.citations.bulkPut(database.citations as never[]),
        db.legalReferences.bulkPut(database.legalReferences as never[]),
        db.documentAnalyses.bulkPut(database.documentAnalyses as never[]),
        db.settings.bulkPut(database.settings as never[]),
      ]);

      const documentRows = (database.documentsMeta as Array<{ id: string; mimeType?: string }>).map((meta) => {
        const fileBytes = files[`files/documents/${meta.id}`];
        const thumbBytes = files[`files/thumbnails/${meta.id}`];
        return {
          ...meta,
          fileBlob: new Blob([fileBytes], { type: meta.mimeType || 'application/octet-stream' }),
          thumbnailBlob: thumbBytes ? new Blob([thumbBytes], { type: 'image/jpeg' }) : undefined,
        };
      });
      await db.documents.bulkPut(documentRows as never[]);
    }
  );
}

export async function getStorageEstimate(): Promise<{ usageBytes: number; quotaBytes: number } | null> {
  if (!navigator.storage?.estimate) return null;
  const estimate = await navigator.storage.estimate();
  return { usageBytes: estimate.usage ?? 0, quotaBytes: estimate.quota ?? 0 };
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persist();
}

export async function isStoragePersisted(): Promise<boolean> {
  if (!navigator.storage?.persisted) return false;
  return navigator.storage.persisted();
}
