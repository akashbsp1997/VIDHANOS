import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { generateId } from '@/lib/ids';
import { documentsRepo } from '@/db/repositories/documentsRepo';
import { extractExif, type ExifData } from '@/services/fileMetadata/exifMeta';
import { extractPdfMetadata, type PdfMetadata } from '@/services/fileMetadata/pdfMeta';
import { generateImageThumbnail } from '@/services/fileMetadata/thumbnail';
import { extractDocumentText } from '@/services/ocr';

interface PendingDocument {
  file: File;
  fileType: 'image' | 'pdf';
  pdfMeta: PdfMetadata | null;
  exifMeta: ExifData | null;
  previewUrl: string | null;
  extractedText: string | null;
  ocrConfidence: number | null;
}

export function DocumentUploadScreen() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setProcessing(true);

    const fileType: 'image' | 'pdf' = file.type === 'application/pdf' ? 'pdf' : 'image';
    const pdfMeta = fileType === 'pdf' ? await extractPdfMetadata(file) : null;
    const exifMeta = fileType === 'image' ? await extractExif(file) : null;
    const previewUrl = fileType === 'image' ? URL.createObjectURL(file) : null;
    const ocrResult = await extractDocumentText(file, fileType);

    setPending({
      file,
      fileType,
      pdfMeta,
      exifMeta,
      previewUrl,
      extractedText: ocrResult?.text || null,
      ocrConfidence: ocrResult?.confidence ?? null,
    });
    setProcessing(false);
  };

  const onSave = async () => {
    if (!pending || !caseId) return;
    setSaving(true);

    const thumbnailBlob = pending.fileType === 'image' ? await generateImageThumbnail(pending.file) : undefined;

    await documentsRepo.create({
      id: generateId(),
      caseId,
      fileName: pending.file.name || (pending.fileType === 'pdf' ? 'document.pdf' : 'photo.jpg'),
      fileBlob: pending.file,
      thumbnailBlob,
      fileType: pending.fileType,
      mimeType: pending.file.type,
      fileSizeBytes: pending.file.size,
      pageCount: pending.pdfMeta?.pageCount,
      pdfTitle: pending.pdfMeta?.title ?? undefined,
      pdfAuthor: pending.pdfMeta?.author ?? undefined,
      pdfCreatedAt: pending.pdfMeta?.createdAt ?? undefined,
      pdfModifiedAt: pending.pdfMeta?.modifiedAt ?? undefined,
      exifTakenAt: pending.exifMeta?.takenAt ?? undefined,
      exifGpsLat: pending.exifMeta?.gpsLat ?? undefined,
      exifGpsLng: pending.exifMeta?.gpsLng ?? undefined,
      exifCameraModel: pending.exifMeta?.cameraModel ?? undefined,
      extractedText: pending.extractedText ?? undefined,
      ocrConfidence: pending.ocrConfidence ?? undefined,
    });

    if (pending.previewUrl) URL.revokeObjectURL(pending.previewUrl);
    setSaving(false);
    navigate(`/cases/${caseId}`);
  };

  const onDiscard = () => {
    if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
  };

  return (
    <Screen>
      <div className="screen-header">
        <div className="btn-row" style={{ flexDirection: 'column' }}>
          <Button label="Take Photo" onClick={() => cameraInputRef.current?.click()} />
          <Button label="Choose File (image or PDF)" variant="secondary" onClick={() => fileInputRef.current?.click()} />
        </div>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {processing ? <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Reading file metadata and text…</p> : null}

        {pending ? (
          <div className="card" style={{ marginTop: 16 }}>
            {pending.previewUrl ? (
              <img src={pending.previewUrl} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 10 }} />
            ) : null}
            <p style={{ fontWeight: 700, margin: '0 0 2px' }}>{pending.file.name || 'Untitled'}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 10px' }}>
              {pending.fileType === 'pdf' ? 'PDF document' : 'Image'}
            </p>

            {pending.pdfMeta ? (
              <>
                <MetaRow label="Pages" value={String(pending.pdfMeta.pageCount)} />
                {pending.pdfMeta.title ? <MetaRow label="Title" value={pending.pdfMeta.title} /> : null}
                {pending.pdfMeta.author ? <MetaRow label="Author" value={pending.pdfMeta.author} /> : null}
              </>
            ) : null}

            {pending.exifMeta ? (
              <>
                {pending.exifMeta.takenAt ? (
                  <MetaRow label="Taken at" value={new Date(pending.exifMeta.takenAt).toLocaleString()} />
                ) : null}
                {pending.exifMeta.cameraModel ? <MetaRow label="Camera" value={pending.exifMeta.cameraModel} /> : null}
                {pending.exifMeta.gpsLat && pending.exifMeta.gpsLng ? (
                  <MetaRow label="Location" value={`${pending.exifMeta.gpsLat.toFixed(4)}, ${pending.exifMeta.gpsLng.toFixed(4)}`} />
                ) : null}
              </>
            ) : null}

            {pending.extractedText ? (
              <MetaRow
                label="Text extracted"
                value={`${pending.extractedText.length} chars${pending.ocrConfidence != null ? ` · OCR confidence ${Math.round(pending.ocrConfidence)}%` : ''}`}
              />
            ) : null}

            <div className="btn-row" style={{ flexDirection: 'column', marginTop: 12 }}>
              <Button label="Save to Case" onClick={onSave} loading={saving} />
              <Button label="Discard" variant="secondary" onClick={onDiscard} />
            </div>
          </div>
        ) : null}
      </div>
    </Screen>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
      <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
