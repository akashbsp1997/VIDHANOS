import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { opponentRepository } from '@/db/repositories/opponentRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OpponentList'>;

export function OpponentListScreen({ navigation }: Props) {
  const { data: opponents, loading } = useFocusRefresh(() => opponentRepository.list());

  return (
    <Screen>
      <View style={styles.header}>
        <Button label="Add Opponent" onPress={() => navigation.navigate('OpponentForm', {})} />
      </View>
      <FlatList
        data={opponents ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.name}
            subtitle={item.phone ?? item.email ?? undefined}
            onPress={() => navigation.navigate('OpponentForm', { opponentId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading ? <EmptyState title="No opponents yet" message="Add an opponent/respondent to link them to cases." /> : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
});
