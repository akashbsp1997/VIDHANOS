import { format } from 'date-fns';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { documentAnalysisRepository } from '@/db/repositories/documentAnalysisRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { MainTabScreenProps } from '@/navigation/types';

type Props = MainTabScreenProps<'Guidance'>;

export function GuidanceScreen({ navigation }: Props) {
  const { data: analyses, loading } = useFocusRefresh(() => documentAnalysisRepository.listRecent());

  return (
    <Screen>
      <FlatList
        data={analyses ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.issueSummary || 'Analysis in progress'}
            subtitle={item.status === 'needs_clarification' ? 'Needs your input' : item.provider}
            meta={format(new Date(item.createdAt), 'dd MMM')}
            onPress={() => navigation.navigate('GuidanceDetail', { analysisId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="AI Guidance"
              message="Open a document inside a case and tap 'Analyze with AI' to get department, forum, and next-step recommendations here."
            />
          ) : null
        }
      />
    </Screen>
  );
}
