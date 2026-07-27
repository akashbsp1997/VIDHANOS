import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function RequiresNetworkBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You're offline — connect to the internet to use this feature. Manual entry is always available.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF4E5',
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    margin: 16,
  },
  text: {
    color: colors.warning,
    fontSize: 13,
  },
});
