import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/** Re-runs `loader` every time the screen regains focus; exposes a manual `reload`. */
export function useFocusRefresh<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    loader()
      .then(setData)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useFocusEffect(
    useCallback(() => {
      reload();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload])
  );

  return { data, loading, reload };
}
