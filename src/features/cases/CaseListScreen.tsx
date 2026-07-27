import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { caseRepository } from '@/db/repositories/caseRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { MainTabScreenProps } from '@/navigation/types';

type Props = MainTabScreenProps<'Cases'>;

export function CaseListScreen({ navigation }: Props) {
  const { data: cases, loading } = useFocusRefresh(() => caseRepository.list());
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!cases) return [];
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.forumName ?? '').toLowerCase().includes(q) ||
        (c.cnrNumber ?? '').toLowerCase().includes(q)
    );
  }, [cases, query]);

  return (
    <Screen>
      <View style={styles.header}>
        <TextField label="Search" value={query} onChangeText={setQuery} placeholder="Search by title, forum, CNR" />
        <Button label="Add Case" onPress={() => navigation.navigate('CaseForm', {})} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.title}
            subtitle={[item.caseType, item.forumName].filter(Boolean).join(' · ') || undefined}
            meta={item.nextHearingDate ? format(new Date(item.nextHearingDate), 'dd MMM') : item.caseStatus}
            onPress={() => navigation.navigate('CaseDetail', { caseId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading ? <EmptyState title="No cases yet" message="Add your first case to start tracking it." /> : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingBottom: 0,
  },
});
