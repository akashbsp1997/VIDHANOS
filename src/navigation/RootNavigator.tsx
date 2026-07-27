import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CaseDetailScreen } from '@/features/cases/CaseDetailScreen';
import { CaseFormScreen } from '@/features/cases/CaseFormScreen';
import { CitationDetailScreen } from '@/features/citations/CitationDetailScreen';
import { CitationSearchScreen } from '@/features/citations/CitationSearchScreen';
import { ClientFormScreen } from '@/features/clients/ClientFormScreen';
import { ClientListScreen } from '@/features/clients/ClientListScreen';
import { DocumentUploadScreen } from '@/features/documents/DocumentUploadScreen';
import { DocumentViewerScreen } from '@/features/documents/DocumentViewerScreen';
import { ECourtsImportScreen } from '@/features/ecourts/ECourtsImportScreen';
import { ECourtsReviewImportScreen } from '@/features/ecourts/ECourtsReviewImportScreen';
import { GuidanceDetailScreen } from '@/features/guidance/GuidanceDetailScreen';
import { HearingFormScreen } from '@/features/hearings/HearingFormScreen';
import { OpponentFormScreen } from '@/features/opponents/OpponentFormScreen';
import { OpponentListScreen } from '@/features/opponents/OpponentListScreen';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="CaseDetail" component={CaseDetailScreen} options={{ title: 'Case' }} />
      <Stack.Screen name="CaseForm" component={CaseFormScreen} options={{ title: 'Case' }} />
      <Stack.Screen name="ClientList" component={ClientListScreen} options={{ title: 'Clients' }} />
      <Stack.Screen name="ClientForm" component={ClientFormScreen} options={{ title: 'Client' }} />
      <Stack.Screen name="OpponentList" component={OpponentListScreen} options={{ title: 'Opponents' }} />
      <Stack.Screen name="OpponentForm" component={OpponentFormScreen} options={{ title: 'Opponent' }} />
      <Stack.Screen name="HearingForm" component={HearingFormScreen} options={{ title: 'Hearing / Order' }} />
      <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} options={{ title: 'Upload Document' }} />
      <Stack.Screen name="DocumentViewer" component={DocumentViewerScreen} options={{ title: 'Document' }} />
      <Stack.Screen name="GuidanceDetail" component={GuidanceDetailScreen} options={{ title: 'AI Guidance' }} />
      <Stack.Screen name="ECourtsImport" component={ECourtsImportScreen} options={{ title: 'Import from eCourts' }} />
      <Stack.Screen
        name="ECourtsReviewImport"
        component={ECourtsReviewImportScreen}
        options={{ title: 'Review Import' }}
      />
      <Stack.Screen name="CitationSearch" component={CitationSearchScreen} options={{ title: 'Citations' }} />
      <Stack.Screen name="CitationDetail" component={CitationDetailScreen} options={{ title: 'Citation' }} />
    </Stack.Navigator>
  );
}
