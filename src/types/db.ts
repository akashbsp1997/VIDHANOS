import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type {
  caseOpponents,
  cases,
  citations,
  clients,
  documentAnalyses,
  documents,
  hearings,
  legalReferences,
  opponents,
} from '@/db/schema';

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Opponent = InferSelectModel<typeof opponents>;
export type NewOpponent = InferInsertModel<typeof opponents>;

export type Case = InferSelectModel<typeof cases>;
export type NewCase = InferInsertModel<typeof cases>;

export type CaseOpponent = InferSelectModel<typeof caseOpponents>;
export type NewCaseOpponent = InferInsertModel<typeof caseOpponents>;

export type Hearing = InferSelectModel<typeof hearings>;
export type NewHearing = InferInsertModel<typeof hearings>;

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;

export type Citation = InferSelectModel<typeof citations>;
export type NewCitation = InferInsertModel<typeof citations>;

export type LegalReference = InferSelectModel<typeof legalReferences>;

export type DocumentAnalysis = InferSelectModel<typeof documentAnalyses>;
export type NewDocumentAnalysis = InferInsertModel<typeof documentAnalyses>;

export interface CaseWithRelations extends Case {
  client: Client;
  opponents: Opponent[];
}
