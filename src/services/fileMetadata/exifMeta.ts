import exifr from 'exifr';

export interface ExifData {
  takenAt: number | null;
  gpsLat: number | null;
  gpsLng: number | null;
  cameraModel: string | null;
}

export async function extractExif(file: File): Promise<ExifData | null> {
  try {
    const tags = await exifr.parse(file, { gps: true, tiff: true, exif: true });
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
