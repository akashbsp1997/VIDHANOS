import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { db } from './client';
import migrations from './migrations/migrations';
import { seedLegalReferencesIfEmpty } from './seed';

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const { success, error } = useMigrations(db, migrations);
  const [seeded, setSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);

  useEffect(() => {
    if (!success) return;
    seedLegalReferencesIfEmpty()
      .then(() => setSeeded(true))
      .catch((err: Error) => setSeedError(err));
  }, [success]);

  if (error || seedError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Database setup failed</Text>
        <Text style={styles.errorMessage}>{(error ?? seedError)?.message}</Text>
      </View>
    );
  }

  if (!success || !seeded) {
    return (
      <View style={styles.center}>
        <Text>Setting up local database…</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});
