import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { RequiresNetworkBanner } from '@/components/RequiresNetworkBanner';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import type { RootStackScreenProps } from '@/navigation/types';
import { docSnippet, IndianKanoonAuthError, searchJudgments, type IndianKanoonSearchDoc } from '@/services/indianKanoonApi';
import { useIsOnline } from '@/services/network';
import { colors } from '@/theme/colors';

type Props = RootStackScreenProps<'CitationSearch'>;

export function CitationSearchScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const isOnline = useIsOnline();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IndianKanoonSearchDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await searchJudgments(query.trim());
      setResults(result.docs ?? []);
    } catch (err) {
      if (err instanceof IndianKanoonAuthError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Search failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOnline) {
    return (
      <Screen>
        <RequiresNetworkBanner />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.searchBar}>
        <TextField
          label="Search Indian Kanoon"
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. deficiency of service consumer"
          onSubmitEditing={onSearch}
        />
        <Button label="Search" onPress={onSearch} loading={loading} />
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label="Open Settings" variant="secondary" onPress={() => navigation.navigate('MainTabs')} />
          </View>
        ) : null}
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.tid)}
        renderItem={({ item }) => (
          <ListRow
            title={item.title}
            subtitle={`${item.docsource ?? ''} ${docSnippet(item.headline)}`}
            meta={item.publishdate}
            onPress={() => navigation.navigate('CitationDetail', { tid: String(item.tid), caseId })}
          />
        )}
        ListEmptyComponent={
          !loading ? <EmptyState title="Search for judgments to cite" message="Results from Indian Kanoon will appear here." /> : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    padding: 16,
    paddingBottom: 0,
  },
  errorBox: {
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
});
