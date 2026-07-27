import { File } from 'expo-file-system';
// The default "full" exifr build contains a webpack-only dynamic import() (for optional
// XMP/ICC zip decompression) that Hermes cannot compile. We only need TIFF/EXIF/GPS tags,
// so the "lite" build (no XMP/ICC/IPTC, no dynamic import) is used instead.
import { parse as parseExif } from 'exifr/dist/lite.esm.mjs';

export interface ExifData {
  takenAt: number | null;
  gpsLat: number | null;
  gpsLng: number | null;
  cameraModel: string | null;
}

export async function extractExif(fileUri: string): Promise<ExifData | null> {
  try {
    const bytes = await new File(fileUri).bytes();
    const tags = await parseExif(bytes.buffer as ArrayBuffer, { gps: true, tiff: true, exif: true });
    if (!tags) return null;

    return {
      takenAt: tags.DateTimeOriginal ? new Date(tags.DateTimeOriginal).getTime() : null,
      gpsLat: typeof tags.latitude === 'number' ? tags.latitude : null,
      gpsLng: typeof tags.longitude === 'number' ? tags.longitude : null,
      cameraModel: tags.Model ?? null,
    };
  } catch {
    return null;
  }
}

/** Normalizes the EXIF object expo-image-picker returns inline (when `exif: true` is passed). */
export function exifFromPickerResult(exif: Record<string, unknown> | null | undefined): ExifData | null {
  if (!exif) return null;

  const dateStr = (exif.DateTimeOriginal ?? exif['{Exif}']) as string | undefined;
  const gps = exif.GPS as Record<string, number> | undefined;

  return {
    takenAt: typeof dateStr === 'string' ? Date.parse(dateStr.replace(/^(\d{4}):(\d{2}):/, '$1-$2-')) || null : null,
    gpsLat: gps && typeof gps.Latitude === 'number' ? gps.Latitude : null,
    gpsLng: gps && typeof gps.Longitude === 'number' ? gps.Longitude : null,
    cameraModel: typeof exif.Model === 'string' ? exif.Model : null,
  };
}
