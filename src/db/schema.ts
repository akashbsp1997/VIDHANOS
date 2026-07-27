import Dexie, { type EntityTable } from 'dexie';

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Opponent {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Case {
  id: string;
  title: string;
  cnrNumber?: string;
  caseType?: string;
  filingNumber?: string;
  filingDate?: number;
  registrationNumber?: string;
  forumName?: string;
  courtState?: string;
  courtDistrict?: string;
  courtComplex?: string;
  judgeName?: string;
  caseStatus: string;
  stage?: string;
  clientId: string;
  nextHearingDate?: number;
  priority: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CaseOpponent {
  id: string;
  caseId: string;
  opponentId: string;
  role?: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  hearingDate: number;
  purpose?: string;
  judgeName?: string;
  orderSummary?: string;
  orderType: string;
  nextHearingDate?: number;
  isDeadline: 0 | 1;
  reminderOffsetMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentRecord {
  id: string;
  /** Undefined while the document is attached to an in-progress New Matter wizard, before a case exists. */
  caseId?: string;
  hearingId?: string;
  fileName: string;
  fileBlob: Blob;
  thumbnailBlob?: Blob;
  fileType: 'image' | 'pdf';
  mimeType?: string;
  fileSizeBytes?: number;
  pageCount?: number;
  pdfTitle?: string;
  pdfAuthor?: string;
  pdfCreatedAt?: number;
  pdfModifiedAt?: number;
  exifTakenAt?: number;
  exifGpsLat?: number;
  exifGpsLng?: number;
  exifCameraModel?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RecommendationItem {
  name: string;
  reason: string;
}

export interface Citation {
  id: string;
  caseId?: string;
  indianKanoonDocId?: string;
  title: string;
  court?: string;
  citationText?: string;
  dateOfJudgment?: number;
  snippet?: string;
  sourceUrl?: string;
  tags?: string[];
  addedManually: 0 | 1;
  createdAt: number;
}

export interface LegalReference {
  id: string;
  category: 'department' | 'mechanism' | 'forum';
  name: string;
  description?: string;
  appliesToKeywords?: string;
  jurisdictionLevel?: string;
  createdAt: number;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  /** Undefined while the document is attached to an in-progress New Matter wizard, before a case exists. */
  caseId?: string;
  provider: 'gemini';
  status: 'pending' | 'needs_clarification' | 'complete' | 'failed';
  issueSummary?: string;
  recommendedDepartments?: RecommendationItem[];
  recommendedMechanisms?: RecommendationItem[];
  recommendedForums?: RecommendationItem[];
  clarifyingQuestions?: string[];
  userAnswers?: Record<string, string>;
  nextSteps?: string[];
  rawResponse?: string;
  /** New Matter intake suggestions (only set when this analysis came from the wizard). */
  suggestedCaseTitle?: string;
  suggestedCaseType?: string;
  suggestedApplicantName?: string;
  suggestedOpponentNames?: string[];
  /** The user's answer to "what do you want to do about it" during intake. */
  userIntent?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SettingsEntry {
  key: string;
  value: string;
}

export const db = new Dexie('vidhanos') as Dexie & {
  clients: EntityTable<Client, 'id'>;
  opponents: EntityTable<Opponent, 'id'>;
  cases: EntityTable<Case, 'id'>;
  caseOpponents: EntityTable<CaseOpponent, 'id'>;
  hearings: EntityTable<Hearing, 'id'>;
  documents: EntityTable<DocumentRecord, 'id'>;
  citations: EntityTable<Citation, 'id'>;
  legalReferences: EntityTable<LegalReference, 'id'>;
  documentAnalyses: EntityTable<DocumentAnalysis, 'id'>;
  settings: EntityTable<SettingsEntry, 'key'>;
};

db.version(1).stores({
  clients: 'id, name',
  opponents: 'id, name',
  cases: 'id, clientId, nextHearingDate, caseStatus, [caseStatus+nextHearingDate]',
  caseOpponents: 'id, caseId, opponentId, [caseId+opponentId]',
  hearings: 'id, caseId, hearingDate, isDeadline, [caseId+hearingDate]',
  documents: 'id, caseId, hearingId',
  citations: 'id, caseId, indianKanoonDocId',
  legalReferences: 'id, category',
  documentAnalyses: 'id, documentId, caseId',
  settings: 'key',
});
