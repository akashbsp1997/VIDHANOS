import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { zipSync } from 'fflate';

import { sqliteDb } from '@/db/client';

function collectFiles(dir: Directory, prefix: string, out: Record<string, Uint8Array>): void {
  if (!dir.exists) return;
  for (const entry of dir.list()) {
    if (entry instanceof Directory) {
      collectFiles(entry, `${prefix}${entry.name}/`, out);
    } else if (entry instanceof File) {
      out[`${prefix}${entry.name}`] = entry.bytesSync();
    }
  }
}

/**
 * Zips the SQLite database plus all case/citation files (not the downloaded local AI model,
 * which is large and re-downloadable) and opens the OS share sheet so the user can save it
 * somewhere safe. This is the only safety net against data loss, since there is no cloud sync.
 */
export async function exportBackup(): Promise<void> {
  const files: Record<string, Uint8Array> = {};

  files['vidhanos.db'] = new File(sqliteDb.databasePath).bytesSync();

  const casesDir = new Directory(Paths.document, 'vidhanos', 'cases');
  collectFiles(casesDir, 'cases/', files);

  const citationsDir = new Directory(Paths.document, 'vidhanos', 'citations');
  collectFiles(citationsDir, 'citations/', files);

  const zipped = zipSync(files, { level: 6 });

  const backupFile = new File(Paths.cache, `vidhanos-backup-${Date.now()}.zip`);
  backupFile.write(zipped);

  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(backupFile.uri, { mimeType: 'application/zip', dialogTitle: 'Save VIDHANOS backup' });
  }
}
