import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Dashboard: undefined;
  Cases: undefined;
  Calendar: undefined;
  Guidance: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CaseDetail: { caseId: string };
  CaseForm: { caseId?: string };
  ClientList: undefined;
  ClientForm: { clientId?: string };
  OpponentList: undefined;
  OpponentForm: { opponentId?: string };
  HearingForm: { caseId: string; hearingId?: string };
  DocumentUpload: { caseId: string };
  DocumentViewer: { documentId: string };
  GuidanceDetail: { analysisId: string };
  ECourtsImport: { caseId?: string };
  ECourtsReviewImport: { payload: string };
  CitationSearch: { caseId?: string };
  CitationDetail: { tid: string; caseId?: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
