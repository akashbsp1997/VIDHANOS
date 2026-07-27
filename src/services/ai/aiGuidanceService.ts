import { documentAnalysesRepo } from '@/db/repositories/documentAnalysesRepo';
import { legalReferencesRepo } from '@/db/repositories/legalReferencesRepo';
import { settingsRepo } from '@/db/repositories/settingsRepo';
import type { DocumentAnalysis } from '@/db/schema';
import { analyzeDocumentWithGemini } from './geminiClient';
import type { AnalyzeDocumentInput } from './guidancePrompt';

export async function isGuidanceAvailable(isOnline: boolean): Promise<boolean> {
  if (!isOnline) return false;
  const key = await settingsRepo.getGeminiApiKey();
  return !!key;
}

interface RunAnalysisArgs {
  documentId: string;
  caseId: string;
  fileName: string;
  fileBase64?: string;
  mimeType?: string | null;
  documentText?: string;
  priorAnalysisId?: string;
  userAnswers?: Record<string, string>;
}

/**
 * Creates or continues a documentAnalyses row. If the model still needs more information,
 * status is 'needs_clarification' and the caller should collect answers and call again with
 * priorAnalysisId set.
 */
export async function runDocumentAnalysis(args: RunAnalysisArgs): Promise<DocumentAnalysis> {
  const legalReferences = await legalReferencesRepo.findRelevant(`${args.fileName} ${args.documentText ?? ''}`);

  const input: AnalyzeDocumentInput = {
    fileBase64: args.fileBase64,
    mimeType: args.mimeType,
    documentText: args.documentText,
    fileName: args.fileName,
    legalReferences,
  };

  if (args.priorAnalysisId) {
    const prior = await documentAnalysesRepo.get(args.priorAnalysisId);
    if (prior?.clarifyingQuestions) {
      input.priorClarifyingQuestions = prior.clarifyingQuestions;
      input.userAnswers = args.userAnswers;
    }
  }

  const result = await analyzeDocumentWithGemini(input);
  const status: DocumentAnalysis['status'] =
    result.clarifyingQuestions.length > 0 ? 'needs_clarification' : 'complete';

  const payload = {
    documentId: args.documentId,
    caseId: args.caseId,
    provider: 'gemini' as const,
    status,
    issueSummary: result.issueSummary,
    recommendedDepartments: result.recommendedDepartments,
    recommendedMechanisms: result.recommendedMechanisms,
    recommendedForums: result.recommendedForums,
    clarifyingQuestions: result.clarifyingQuestions,
    userAnswers: args.userAnswers,
    nextSteps: result.nextSteps,
    rawResponse: result.rawResponse,
  };

  if (args.priorAnalysisId) {
    await documentAnalysesRepo.update(args.priorAnalysisId, payload);
    const updated = await documentAnalysesRepo.get(args.priorAnalysisId);
    if (!updated) throw new Error('Failed to load updated analysis.');
    return updated;
  }

  return documentAnalysesRepo.create(payload);
}
