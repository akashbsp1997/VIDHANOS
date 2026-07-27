import { format } from 'date-fns';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { documentRepository } from '@/db/repositories/documentRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { RootStackScreenProps } from '@/navigation/types';
import { deleteFile, resolveUri } from '@/services/fileStorage';
import { colors } from '@/theme/colors';

type Props = RootStackScreenProps<'DocumentViewer'>;

export function DocumentViewerScreen({ route, navigation }: Props) {
  const { documentId } = route.params;
  const { data: document } = useFocusRefresh(() => documentRepository.get(documentId), [documentId]);
  const [busy, setBusy] = useState(false);

  if (!document) return <Screen><></></Screen>;

  const absoluteUri = resolveUri(document.fileUri);

  const onOpen = async () => {
    setBusy(true);
    const available = await Sharing.isAvailableAsync();
    if (available) {
      await Sharing.shareAsync(absoluteUri, { mimeType: document.mimeType ?? undefined });
    }
    setBusy(false);
  };

  const onDelete = () => {
    Alert.alert('Delete document', 'This removes the file from device storage.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          deleteFile(document.fileUri);
          await documentRepository.remove(document.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {document.fileType === 'image' ? (
          <Image source={{ uri: absoluteUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.pdfPlaceholder}>
            <Text style={styles.pdfIcon}>PDF</Text>
          </View>
        )}

        <Text style={styles.fileName}>{document.fileName}</Text>
        <Text style={styles.meta}>Added {format(new Date(document.createdAt), 'dd MMM yyyy')}</Text>
        {document.source !== 'manual' ? (
          <Text style={styles.sourceTag}>Source: {document.source}</Text>
        ) : null}

        {document.pageCount ? <MetaRow label="Pages" value={String(document.pageCount)} /> : null}
        {document.pdfTitle ? <MetaRow label="PDF Title" value={document.pdfTitle} /> : null}
        {document.pdfAuthor ? <MetaRow label="PDF Author" value={document.pdfAuthor} /> : null}
        {document.exifTakenAt ? (
          <MetaRow label="Taken at" value={format(new Date(document.exifTakenAt), 'dd MMM yyyy, h:mm a')} />
        ) : null}
        {document.exifCameraModel ? <MetaRow label="Camera" value={document.exifCameraModel} /> : null}
        {document.fileSizeBytes ? (
          <MetaRow label="Size" value={`${(document.fileSizeBytes / 1024).toFixed(0)} KB`} />
        ) : null}

        <View style={styles.actions}>
          <Button label="Open / Share" onPress={onOpen} loading={busy} />
          <Button
            label="Analyze with AI"
            variant="secondary"
            onPress={() => navigation.navigate('GuidanceDetail', { analysisId: `new:${document.id}` })}
          />
          <Button label="Delete" variant="danger" onPress={onDelete} />
        </View>
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
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  pdfPlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pdfIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMuted,
  },
  fileName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  sourceTag: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginTop: 8,
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
  actions: {
    marginTop: 20,
    gap: 10,
  },
});
