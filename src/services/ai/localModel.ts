import { Directory, File, Paths } from 'expo-file-system';

const MODEL_DIR_SEGMENTS = ['vidhanos', 'models'] as const;
const MODEL_FILE_NAME = 'local-guidance-model.gguf';

/**
 * Small instruct GGUF model used as the offline fallback for AI guidance. Text-only —
 * good enough to reason over OCR'd/typed text, not to read images directly. Users can
 * point Settings at a different URL if they prefer a different model.
 */
export const DEFAULT_LOCAL_MODEL_URL =
  'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf';

function modelFile(): File {
  return new File(Paths.document, ...MODEL_DIR_SEGMENTS, MODEL_FILE_NAME);
}

export function isLocalModelDownloaded(): boolean {
  return modelFile().exists;
}

export function getLocalModelPath(): string | null {
  const file = modelFile();
  return file.exists ? file.uri : null;
}

export function getLocalModelSizeBytes(): number {
  const file = modelFile();
  return file.exists ? (file.size ?? 0) : 0;
}

export async function downloadLocalModel(
  url: string = DEFAULT_LOCAL_MODEL_URL,
  onProgress?: (fraction: number) => void
): Promise<void> {
  const dir = new Directory(Paths.document, ...MODEL_DIR_SEGMENTS);
  dir.create({ intermediates: true, idempotent: true });

  const destination = modelFile();
  const task = File.createDownloadTask(url, destination, {
    onProgress: ({ bytesWritten, totalBytes }) => {
      if (totalBytes > 0) onProgress?.(bytesWritten / totalBytes);
    },
  });

  await task.downloadAsync();
}

export function deleteLocalModel(): void {
  const file = modelFile();
  if (file.exists) file.delete();
}
