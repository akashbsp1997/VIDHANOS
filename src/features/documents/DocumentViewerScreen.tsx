import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { documentsRepo } from '@/db/repositories/documentsRepo';

export function DocumentViewerScreen() {
  const { caseId, documentId } = useParams<{ caseId: string; documentId: string }>();
  const navigate = useNavigate();
  const document = useLiveQuery(() => (documentId ? documentsRepo.get(documentId) : undefined), [documentId]);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!document) return;
    const url = URL.createObjectURL(document.fileBlob);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [document]);

  if (!document || !documentId) return <Screen>{null}</Screen>;

  const onDelete = async () => {
    if (!confirm('Delete this document? This removes the file from device storage.')) return;
    await documentsRepo.remove(documentId);
    navigate(`/cases/${caseId}`);
  };

  return (
    <Screen>
      <div className="screen-header">
        {document.fileType === 'image' && objectUrl ? (
          <img src={objectUrl} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />
        ) : document.fileType === 'pdf' && objectUrl ? (
          <embed src={objectUrl} type="application/pdf" style={{ width: '100%', height: 400, borderRadius: 12, marginBottom: 12 }} />
        ) : null}

        <p style={{ fontWeight: 700, fontSize: 17, margin: '0 0 2px' }}>{document.fileName}</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
          Added {format(new Date(document.createdAt), 'dd MMM yyyy')}
        </p>

        {document.pageCount ? <MetaRow label="Pages" value={String(document.pageCount)} /> : null}
        {document.pdfTitle ? <MetaRow label="PDF Title" value={document.pdfTitle} /> : null}
        {document.pdfAuthor ? <MetaRow label="PDF Author" value={document.pdfAuthor} /> : null}
        {document.exifTakenAt ? (
          <MetaRow label="Taken at" value={format(new Date(document.exifTakenAt), 'dd MMM yyyy, h:mm a')} />
        ) : null}
        {document.exifCameraModel ? <MetaRow label="Camera" value={document.exifCameraModel} /> : null}
        {document.fileSizeBytes ? <MetaRow label="Size" value={`${(document.fileSizeBytes / 1024).toFixed(0)} KB`} /> : null}

        <div className="btn-row" style={{ flexDirection: 'column', marginTop: 20 }}>
          {objectUrl ? (
            <a href={objectUrl} download={document.fileName}>
              <Button label="Download" />
            </a>
          ) : null}
          <Button
            label="Analyze with AI"
            variant="secondary"
            onClick={() => navigate(`/guidance/new:${documentId}`)}
          />
          <Button label="Delete" variant="danger" onClick={onDelete} />
        </div>
      </div>
    </Screen>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>{value}</span>
    </div>
  );
}
