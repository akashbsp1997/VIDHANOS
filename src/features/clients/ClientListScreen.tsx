import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { clientRepository } from '@/db/repositories/clientRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientList'>;

export function ClientListScreen({ navigation }: Props) {
  const { data: clients, loading } = useFocusRefresh(() => clientRepository.list());

  return (
    <Screen>
      <View style={styles.header}>
        <Button label="Add Client" onPress={() => navigation.navigate('ClientForm', {})} />
      </View>
      <FlatList
        data={clients ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.name}
            subtitle={item.phone ?? item.email ?? undefined}
            onPress={() => navigation.navigate('ClientForm', { clientId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading ? <EmptyState title="No clients yet" message="Add your first client to get started." /> : null
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
