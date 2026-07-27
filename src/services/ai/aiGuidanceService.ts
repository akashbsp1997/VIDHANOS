import { documentAnalysisRepository } from '@/db/repositories/documentAnalysisRepository';
import { legalReferenceRepository } from '@/db/repositories/legalReferenceRepository';
import { getGeminiApiKey } from '@/services/secureConfig';
import type { DocumentAnalysis } from '@/types/db';
import type { AnalyzeDocumentInput } from './aiProvider';
import { geminiProvider } from './geminiProvider';
import { isLocalModelDownloaded } from './localModel';
import { localModelProvider } from './localModelProvider';

export type AvailableProvider = 'gemini' | 'local' | null;

export async function pickAvailableProvider(isOnline: boolean): Promise<AvailableProvider> {
  if (isOnline) {
    const key = await getGeminiApiKey();
    if (key) return 'gemini';
  }
  if (isLocalModelDownloaded()) return 'local';
  return null;
}

interface RunAnalysisArgs {
  documentId: string;
  caseId: string;
  fileName: string;
  fileBase64?: string;
  mimeType?: string | null;
  documentText?: string;
  isOnline: boolean;
  priorAnalysisId?: string;
  userAnswers?: Record<string, string>;
}

/**
 * Creates or continues a document_analyses row: picks Gemini (online + keyed) over the
 * local model (downloaded, offline-capable), runs one analysis pass, and persists the
 * result. If the provider still needs more information, status is 'needs_clarification'
 * and the caller should collect answers and call this again with priorAnalysisId set.
 */
export async function runDocumentAnalysis(args: RunAnalysisArgs): Promise<DocumentAnalysis> {
  const provider = await pickAvailableProvider(args.isOnline);
  if (!provider) {
    throw new Error(
      args.isOnline
        ? 'No AI provider available. Add a Gemini API key or download the offline model in Settings.'
        : "You're offline and no offline model is downloaded. Connect to the internet or download the offline model in Settings."
    );
  }

  const legalReferences = await legalReferenceRepository.findRelevant(
    `${args.fileName} ${args.documentText ?? ''}`
  );

  const input: AnalyzeDocumentInput = {
    fileBase64: args.fileBase64,
    mimeType: args.mimeType,
    documentText: args.documentText,
    fileName: args.fileName,
    legalReferences,
  };

  let priorQuestions: string[] = [];
  if (args.priorAnalysisId) {
    const prior = await documentAnalysisRepository.get(args.priorAnalysisId);
    if (prior?.clarifyingQuestions) {
      priorQuestions = prior.clarifyingQuestions;
      input.priorClarifyingQuestions = priorQuestions;
      input.userAnswers = args.userAnswers;
    }
  }

  const activeProvider = provider === 'gemini' ? geminiProvider : localModelProvider;
  const result = await activeProvider.analyzeDocument(input);

  const status = result.clarifyingQuestions.length > 0 ? 'needs_clarification' : 'complete';

  const payload = {
    documentId: args.documentId,
    caseId: args.caseId,
    provider,
    status,
    issueSummary: result.issueSummary,
    recommendedDepartments: result.recommendedDepartments,
    recommendedMechanisms: result.recommendedMechanisms,
    recommendedForums: result.recommendedForums,
    clarifyingQuestions: result.clarifyingQuestions,
    userAnswers: args.userAnswers ?? null,
    nextSteps: result.nextSteps,
    rawResponse: result.rawResponse,
  };

  if (args.priorAnalysisId) {
    await documentAnalysisRepository.update(args.priorAnalysisId, payload);
    const updated = await documentAnalysisRepository.get(args.priorAnalysisId);
    if (!updated) throw new Error('Failed to load updated analysis.');
    return updated;
  }

  return documentAnalysisRepository.create(payload);
}
