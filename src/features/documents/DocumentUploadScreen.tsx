import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { generateId } from '@/db/id';
import { documentRepository } from '@/db/repositories/documentRepository';
import type { RootStackScreenProps } from '@/navigation/types';
import { exifFromPickerResult, extractExif, type ExifData } from '@/services/exif';
import { saveIncomingDocument } from '@/services/fileStorage';
import { extractPdfMetadata, type PdfMetadata } from '@/services/pdfMetadata';
import { colors } from '@/theme/colors';

type Props = RootStackScreenProps<'DocumentUpload'>;

interface PendingDocument {
  uri: string;
  fileName: string;
  mimeType: string | null;
  fileType: 'image' | 'pdf';
  pdfMeta: PdfMetadata | null;
  exifMeta: ExifData | null;
}

function extensionFor(fileName: string, fallback: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName);
  return match ? match[1].toLowerCase() : fallback;
}

export function DocumentUploadScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const [pending, setPending] = useState<PendingDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    setProcessing(true);
    const exifMeta = exifFromPickerResult(asset.exif) ?? (await extractExif(asset.uri));
    setPending({
      uri: asset.uri,
      fileName: asset.fileName ?? `photo-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
      fileType: 'image',
      pdfMeta: null,
      exifMeta,
    });
    setProcessing(false);
  };

  const onTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ exif: true, quality: 0.9 });
    await handleImageResult(result);
  };

  const onChooseFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], exif: true, quality: 0.9 });
    await handleImageResult(result);
  };

  const onChoosePdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf'], copyToCacheDirectory: true });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    setProcessing(true);
    const pdfMeta = await extractPdfMetadata(asset.uri);
    setPending({
      uri: asset.uri,
      fileName: asset.name,
      mimeType: asset.mimeType ?? 'application/pdf',
      fileType: 'pdf',
      pdfMeta,
      exifMeta: null,
    });
    setProcessing(false);
  };

  const onSave = async () => {
    if (!pending) return;
    setSaving(true);
    const documentId = generateId();
    const ext = extensionFor(pending.fileName, pending.fileType === 'pdf' ? 'pdf' : 'jpg');
    const { relativePath, sizeBytes } = await saveIncomingDocument(pending.uri, caseId, documentId, ext);

    await documentRepository.create({
      id: documentId,
      caseId,
      fileName: pending.fileName,
      fileUri: relativePath,
      fileType: pending.fileType,
      mimeType: pending.mimeType,
      fileSizeBytes: sizeBytes,
      pageCount: pending.pdfMeta?.pageCount ?? null,
      pdfTitle: pending.pdfMeta?.title ?? null,
      pdfAuthor: pending.pdfMeta?.author ?? null,
      pdfCreatedAt: pending.pdfMeta?.createdAt ?? null,
      pdfModifiedAt: pending.pdfMeta?.modifiedAt ?? null,
      exifTakenAt: pending.exifMeta?.takenAt ?? null,
      exifGpsLat: pending.exifMeta?.gpsLat ?? null,
      exifGpsLng: pending.exifMeta?.gpsLng ?? null,
      exifCameraModel: pending.exifMeta?.cameraModel ?? null,
    });

    setSaving(false);
    navigation.goBack();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.pickerRow}>
          <Button label="Take Photo" onPress={onTakePhoto} />
          <Button label="Choose from Gallery" variant="secondary" onPress={onChooseFromGallery} />
          <Button label="Choose PDF" variant="secondary" onPress={onChoosePdf} />
        </View>

        {processing ? <Text style={styles.hint}>Reading file metadata…</Text> : null}

        {pending ? (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{pending.fileName}</Text>
            <Text style={styles.previewMeta}>{pending.fileType === 'pdf' ? 'PDF document' : 'Image'}</Text>

            {pending.pdfMeta ? (
              <View style={styles.metaBlock}>
                <MetaRow label="Pages" value={String(pending.pdfMeta.pageCount)} />
                {pending.pdfMeta.title ? <MetaRow label="Title" value={pending.pdfMeta.title} /> : null}
                {pending.pdfMeta.author ? <MetaRow label="Author" value={pending.pdfMeta.author} /> : null}
              </View>
            ) : null}

            {pending.exifMeta ? (
              <View style={styles.metaBlock}>
                {pending.exifMeta.takenAt ? (
                  <MetaRow label="Taken at" value={new Date(pending.exifMeta.takenAt).toLocaleString()} />
                ) : null}
                {pending.exifMeta.cameraModel ? <MetaRow label="Camera" value={pending.exifMeta.cameraModel} /> : null}
                {pending.exifMeta.gpsLat && pending.exifMeta.gpsLng ? (
                  <MetaRow label="Location" value={`${pending.exifMeta.gpsLat.toFixed(4)}, ${pending.exifMeta.gpsLng.toFixed(4)}`} />
                ) : null}
              </View>
            ) : null}

            <View style={styles.previewActions}>
              <Button label="Save to Case" onPress={onSave} loading={saving} />
              <Button label="Discard" variant="secondary" onPress={() => setPending(null)} />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  pickerRow: {
    gap: 10,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  previewMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
  metaBlock: {
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  previewActions: {
    marginTop: 8,
    gap: 8,
  },
});
