import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface DateFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  mode?: 'date' | 'datetime';
}

export function DateField({ label, value, onChange, placeholder = 'Select date', mode = 'date' }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setShowPicker(true)} style={styles.field}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? format(new Date(value), mode === 'datetime' ? 'dd MMM yyyy, h:mm a' : 'dd MMM yyyy') : placeholder}
        </Text>
      </Pressable>
      {value ? (
        <Pressable onPress={() => onChange(null)} hitSlop={8}>
          <Text style={styles.clear}>Clear date</Text>
        </Pressable>
      ) : null}
      {showPicker ? (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (event.type === 'dismissed') {
              setShowPicker(false);
              return;
            }
            if (selectedDate) {
              onChange(selectedDate.getTime());
            }
            if (Platform.OS === 'android') setShowPicker(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  value: {
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    fontSize: 15,
    color: colors.textMuted,
  },
  clear: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
});
