import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { caseRepository } from '@/db/repositories/caseRepository';
import { hearingRepository } from '@/db/repositories/hearingRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { MainTabScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = MainTabScreenProps<'Calendar'>;

function toDateKey(ms: number): string {
  return format(new Date(ms), 'yyyy-MM-dd');
}

export function CalendarScreen({ navigation }: Props) {
  const now = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 3, 0).getTime();

  const { data: hearings } = useFocusRefresh(() => hearingRepository.listInRange(rangeStart, rangeEnd));
  const { data: cases } = useFocusRefresh(() => caseRepository.list());
  const [selectedDate, setSelectedDate] = useState(toDateKey(Date.now()));

  const caseTitleById = useMemo(() => {
    const map = new Map<string, string>();
    (cases ?? []).forEach((c) => map.set(c.id, c.title));
    return map;
  }, [cases]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};
    (hearings ?? []).forEach((hearing) => {
      const key = toDateKey(hearing.hearingDate);
      marks[key] = { marked: true, dotColor: hearing.isDeadline ? colors.warning : colors.primary };
    });
    marks[selectedDate] = { ...(marks[selectedDate] ?? { marked: false, dotColor: colors.primary }), ...{ selected: true, selectedColor: colors.primary } } as any;
    return marks;
  }, [hearings, selectedDate]);

  const dayHearings = (hearings ?? []).filter((hearing) => toDateKey(hearing.hearingDate) === selectedDate);

  return (
    <Screen>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          dotColor: colors.primary,
          arrowColor: colors.primary,
        }}
      />
      <View style={styles.listHeader} />
      <FlatList
        data={dayHearings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.orderSummary || item.purpose || (item.isDeadline ? 'Deadline' : 'Hearing')}
            subtitle={caseTitleById.get(item.caseId)}
            meta={format(new Date(item.hearingDate), 'h:mm a')}
            onPress={() => navigation.navigate('CaseDetail', { caseId: item.caseId })}
          />
        )}
        ListEmptyComponent={<EmptyState title="Nothing scheduled" message="No hearings or deadlines on this day." />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    height: 4,
  },
});
