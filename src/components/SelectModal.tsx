import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/theme/colors';

export interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedIds: string[];
  multi?: boolean;
  onToggle: (id: string) => void;
  onClose: () => void;
  emptyMessage?: string;
}

export function SelectModal({
  visible,
  title,
  options,
  selectedIds,
  multi,
  onToggle,
  onClose,
  emptyMessage,
}: SelectModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.done}>{multi ? 'Done' : 'Close'}</Text>
          </Pressable>
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const selected = selectedIds.includes(item.id);
            return (
              <Pressable
                onPress={() => {
                  onToggle(item.id);
                  if (!multi) onClose();
                }}
                style={[styles.row, selected && styles.rowSelected]}
              >
                <View>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.sublabel ? <Text style={styles.rowSublabel}>{item.sublabel}</Text> : null}
                </View>
                {selected ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            );
          }}
          ListEmptyComponent={<EmptyState title="Nothing here yet" message={emptyMessage} />}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  done: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowSelected: {
    backgroundColor: '#EAF0FB',
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  rowSublabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  check: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
