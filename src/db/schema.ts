import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export interface RecommendationItem {
  name: string;
  reason: string;
}

const timestamps = {
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s','now') * 1000)`),
  updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s','now') * 1000)`),
};

export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  ...timestamps,
});

export const opponents = sqliteTable('opponents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  ...timestamps,
});

export const cases = sqliteTable(
  'cases',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    cnrNumber: text('cnr_number'),
    caseType: text('case_type'),
    filingNumber: text('filing_number'),
    filingDate: integer('filing_date'),
    registrationNumber: text('registration_number'),
    forumName: text('forum_name'),
    courtState: text('court_state'),
    courtDistrict: text('court_district'),
    courtComplex: text('court_complex'),
    judgeName: text('judge_name'),
    caseStatus: text('case_status').notNull().default('pending'),
    stage: text('stage'),
    clientId: text('client_id')
      .notNull()
      .references(() => clients.id),
    nextHearingDate: integer('next_hearing_date'),
    priority: text('priority').notNull().default('normal'),
    source: text('source').notNull().default('manual'),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    index('cases_next_hearing_date_idx').on(table.nextHearingDate),
    index('cases_client_id_idx').on(table.clientId),
  ]
);

export const caseOpponents = sqliteTable(
  'case_opponents',
  {
    id: text('id').primaryKey(),
    caseId: text('case_id')
      .notNull()
      .references(() => cases.id),
    opponentId: text('opponent_id')
      .notNull()
      .references(() => opponents.id),
    role: text('role'),
  },
  (table) => [unique('case_opponents_case_opponent_unique').on(table.caseId, table.opponentId)]
);

export const hearings = sqliteTable(
  'hearings',
  {
    id: text('id').primaryKey(),
    caseId: text('case_id')
      .notNull()
      .references(() => cases.id),
    hearingDate: integer('hearing_date').notNull(),
    purpose: text('purpose'),
    judgeName: text('judge_name'),
    orderSummary: text('order_summary'),
    orderType: text('order_type').notNull().default('hearing'),
    nextHearingDate: integer('next_hearing_date'),
    isDeadline: integer('is_deadline').notNull().default(0),
    reminderOffsetMinutes: integer('reminder_offset_minutes').notNull().default(1440),
    notificationId: text('notification_id'),
    source: text('source').notNull().default('manual'),
    ...timestamps,
  },
  (table) => [
    index('hearings_case_id_idx').on(table.caseId),
    index('hearings_hearing_date_idx').on(table.hearingDate),
  ]
);

export const documents = sqliteTable(
  'documents',
  {
    id: text('id').primaryKey(),
    caseId: text('case_id')
      .notNull()
      .references(() => cases.id),
    hearingId: text('hearing_id').references(() => hearings.id),
    fileName: text('file_name').notNull(),
    fileUri: text('file_uri').notNull(),
    thumbnailUri: text('thumbnail_uri'),
    fileType: text('file_type').notNull(),
    mimeType: text('mime_type'),
    fileSizeBytes: integer('file_size_bytes'),
    pageCount: integer('page_count'),
    pdfTitle: text('pdf_title'),
    pdfAuthor: text('pdf_author'),
    pdfCreatedAt: integer('pdf_created_at'),
    pdfModifiedAt: integer('pdf_modified_at'),
    exifTakenAt: integer('exif_taken_at'),
    exifGpsLat: real('exif_gps_lat'),
    exifGpsLng: real('exif_gps_lng'),
    exifCameraModel: text('exif_camera_model'),
    ocrText: text('ocr_text'),
    ocrStatus: text('ocr_status').notNull().default('not_applicable'),
    source: text('source').notNull().default('manual'),
    ...timestamps,
  },
  (table) => [index('documents_case_id_idx').on(table.caseId)]
);

export const citations = sqliteTable(
  'citations',
  {
    id: text('id').primaryKey(),
    caseId: text('case_id').references(() => cases.id),
    indianKanoonDocId: text('indiankanoon_doc_id'),
    title: text('title').notNull(),
    court: text('court'),
    citationText: text('citation_text'),
    dateOfJudgment: integer('date_of_judgment'),
    snippet: text('snippet'),
    sourceUrl: text('source_url'),
    localFileUri: text('local_file_uri'),
    tags: text('tags', { mode: 'json' }).$type<string[]>(),
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s','now') * 1000)`),
  },
  (table) => [index('citations_case_id_idx').on(table.caseId)]
);

export const legalReferences = sqliteTable('legal_references', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  appliesToKeywords: text('applies_to_keywords'),
  jurisdictionLevel: text('jurisdiction_level'),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s','now') * 1000)`),
});

export const documentAnalyses = sqliteTable(
  'document_analyses',
  {
    id: text('id').primaryKey(),
    documentId: text('document_id')
      .notNull()
      .references(() => documents.id),
    caseId: text('case_id')
      .notNull()
      .references(() => cases.id),
    provider: text('provider').notNull(),
    status: text('status').notNull().default('pending'),
    issueSummary: text('issue_summary'),
    recommendedDepartments: text('recommended_departments', { mode: 'json' }).$type<
      RecommendationItem[]
    >(),
    recommendedMechanisms: text('recommended_mechanisms', { mode: 'json' }).$type<
      RecommendationItem[]
    >(),
    recommendedForums: text('recommended_forums', { mode: 'json' }).$type<RecommendationItem[]>(),
    clarifyingQuestions: text('clarifying_questions', { mode: 'json' }).$type<string[]>(),
    userAnswers: text('user_answers', { mode: 'json' }).$type<Record<string, string>>(),
    nextSteps: text('next_steps', { mode: 'json' }).$type<string[]>(),
    rawResponse: text('raw_response'),
    ...timestamps,
  },
  (table) => [
    index('document_analyses_document_id_idx').on(table.documentId),
    index('document_analyses_case_id_idx').on(table.caseId),
  ]
);
