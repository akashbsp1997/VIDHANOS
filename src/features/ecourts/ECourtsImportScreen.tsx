import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';

import { Button } from '@/components/Button';
import { RequiresNetworkBanner } from '@/components/RequiresNetworkBanner';
import { Screen } from '@/components/Screen';
import type { RootStackScreenProps } from '@/navigation/types';
import { useIsOnline } from '@/services/network';
import { colors } from '@/theme/colors';
import { ECOURTS_SCRAPER_SCRIPT } from './ecourtsScraperScript';
import type { EcourtsScraperMessage } from './parseEcourtsPayload';

type Props = RootStackScreenProps<'ECourtsImport'>;

const ECOURTS_URL = 'https://services.ecourts.gov.in/ecourtindia_v6/';

export function ECourtsImportScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const isOnline = useIsOnline();
  const webViewRef = useRef<WebView>(null);
  const [status, setStatus] = useState<string | null>(null);

  const onImportPress = () => {
    setStatus(null);
    webViewRef.current?.injectJavaScript(ECOURTS_SCRAPER_SCRIPT);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    let message: EcourtsScraperMessage;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      setStatus("Could not read this page — please enter the case details manually.");
      return;
    }

    if (!message.ok || !message.data) {
      setStatus("Could not read case details from this page — please enter them manually.");
      return;
    }

    navigation.navigate('ECourtsReviewImport', {
      payload: JSON.stringify({ caseId, raw: message.data }),
    });
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
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Search for the case on the eCourts site below (choose state/district/court, enter CNR or case
          number, and solve the CAPTCHA yourself). Once the case details are shown, tap "Import this case".
        </Text>
      </View>
      <WebView ref={webViewRef} source={{ uri: ECOURTS_URL }} onMessage={onMessage} style={styles.webview} />
      <View style={styles.actionBar}>
        {status ? <Text style={styles.status}>{status}</Text> : null}
        <Button label="Import this case" onPress={onImportPress} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  instructions: {
    padding: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  instructionsText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  webview: {
    flex: 1,
  },
  actionBar: {
    padding: 16,
  },
  status: {
    fontSize: 12,
    color: colors.warning,
    marginBottom: 8,
  },
});
