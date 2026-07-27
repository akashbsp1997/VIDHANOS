const MAX_DIMENSION = 400;

export async function generateImageThumbnail(file: File): Promise<Blob | undefined> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.drawImage(bitmap, 0, 0, width, height);

    return await new Promise<Blob | undefined>((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/jpeg', 0.8);
    });
  } catch {
    return undefined;
  }
}
