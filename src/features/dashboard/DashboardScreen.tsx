import { format } from 'date-fns';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { caseRepository } from '@/db/repositories/caseRepository';
import { hearingRepository } from '@/db/repositories/hearingRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { MainTabScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = MainTabScreenProps<'Dashboard'>;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function DashboardScreen({ navigation }: Props) {
  const { data: upcoming } = useFocusRefresh(() =>
    hearingRepository.listInRange(Date.now(), Date.now() + THIRTY_DAYS_MS)
  );
  const { data: cases } = useFocusRefresh(() => caseRepository.list());

  const caseTitleById = useMemo(() => {
    const map = new Map<string, string>();
    (cases ?? []).forEach((c) => map.set(c.id, c.title));
    return map;
  }, [cases]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>VIDHANOS</Text>
        <Text style={styles.subtitle}>{(cases ?? []).length} active cases</Text>
        <View style={styles.quickActions}>
          <Button label="Add Case" onPress={() => navigation.navigate('CaseForm', {})} />
        </View>
      </View>
      <Text style={styles.sectionTitle}>Next 30 days</Text>
      <FlatList
        data={upcoming ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.orderSummary || item.purpose || (item.isDeadline ? 'Deadline' : 'Hearing')}
            subtitle={caseTitleById.get(item.caseId)}
            meta={format(new Date(item.hearingDate), 'dd MMM')}
            onPress={() => navigation.navigate('CaseDetail', { caseId: item.caseId })}
          />
        )}
        ListEmptyComponent={<EmptyState title="Nothing coming up" message="Hearings and deadlines in the next 30 days will show here." />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginHorizontal: 16,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
});
