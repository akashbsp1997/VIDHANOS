import { createBrowserRouter } from 'react-router';

import { App } from './App';
import { CaseDetailScreen } from '@/features/cases/CaseDetailScreen';
import { CaseFormScreen } from '@/features/cases/CaseFormScreen';
import { CaseListScreen } from '@/features/cases/CaseListScreen';
import { ClientFormScreen } from '@/features/clients/ClientFormScreen';
import { ClientListScreen } from '@/features/clients/ClientListScreen';
import { CalendarScreen } from '@/features/calendar/CalendarScreen';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { GuidanceListScreen } from '@/features/guidance/GuidanceListScreen';
import { HearingFormScreen } from '@/features/hearings/HearingFormScreen';
import { NotFoundScreen } from '@/features/NotFoundScreen';
import { OpponentFormScreen } from '@/features/opponents/OpponentFormScreen';
import { OpponentListScreen } from '@/features/opponents/OpponentListScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <DashboardScreen /> },
      { path: '/cases', element: <CaseListScreen /> },
      { path: '/cases/new', element: <CaseFormScreen /> },
      { path: '/cases/:caseId', element: <CaseDetailScreen /> },
      { path: '/cases/:caseId/edit', element: <CaseFormScreen /> },
      { path: '/cases/:caseId/hearings/new', element: <HearingFormScreen /> },
      { path: '/cases/:caseId/hearings/:hearingId/edit', element: <HearingFormScreen /> },
      {
        path: '/cases/:caseId/documents/upload',
        lazy: async () => {
          const { DocumentUploadScreen } = await import('@/features/documents/DocumentUploadScreen');
          return { Component: DocumentUploadScreen };
        },
      },
      {
        path: '/cases/:caseId/documents/:documentId',
        lazy: async () => {
          const { DocumentViewerScreen } = await import('@/features/documents/DocumentViewerScreen');
          return { Component: DocumentViewerScreen };
        },
      },
      { path: '/clients', element: <ClientListScreen /> },
      { path: '/clients/new', element: <ClientFormScreen /> },
      { path: '/clients/:clientId/edit', element: <ClientFormScreen /> },
      { path: '/opponents', element: <OpponentListScreen /> },
      { path: '/opponents/new', element: <OpponentFormScreen /> },
      { path: '/opponents/:opponentId/edit', element: <OpponentFormScreen /> },
      { path: '/calendar', element: <CalendarScreen /> },
      { path: '/guidance', element: <GuidanceListScreen /> },
      {
        path: '/guidance/:analysisId',
        lazy: async () => {
          const { GuidanceDetailScreen } = await import('@/features/guidance/GuidanceDetailScreen');
          return { Component: GuidanceDetailScreen };
        },
      },
      {
        path: '/citations',
        lazy: async () => {
          const { CitationSearchScreen } = await import('@/features/citations/CitationSearchScreen');
          return { Component: CitationSearchScreen };
        },
      },
      { path: '/settings', element: <SettingsScreen /> },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
], { basename: import.meta.env.BASE_URL });
