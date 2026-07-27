import { GoogleGenAI } from '@google/genai';

import { documentAnalysesRepo } from '@/db/repositories/documentAnalysesRepo';
import { legalReferencesRepo } from '@/db/repositories/legalReferencesRepo';
import { settingsRepo } from '@/db/repositories/settingsRepo';
import type { DocumentAnalysis } from '@/db/schema';
import {
  buildIntakeAdvisePrompt,
  buildIntakeReadPrompt,
  parseIntakeAdviseResponse,
  parseIntakeReadResponse,
} from './intakePrompt';

const MODEL = 'gemini-2.5-flash';

async function callGemini(prompt: string, fileBase64?: string, mimeType?: string | null): Promise<string> {
  const apiKey = await settingsRepo.getGeminiApiKey();
  if (!apiKey) {
    throw new Error('No Gemini API key configured. Add one in Settings.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: prompt }];
  if (fileBase64) {
    parts.push({ inlineData: { data: fileBase64, mimeType: mimeType ?? 'application/octet-stream' } });
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts }],
  });

  return response.text ?? '';
}

interface RunInitialArgs {
  documentId: string;
  fileName: string;
  fileBase64?: string;
  mimeType?: string | null;
}

/** Step 1 of intake: read the document and produce an editable incident summary. No case exists yet. */
export async function runInitialIntakeAnalysis(args: RunInitialArgs): Promise<DocumentAnalysis> {
  const text = await callGemini(buildIntakeReadPrompt(args), args.fileBase64, args.mimeType);
  const result = parseIntakeReadResponse(text);

  return documentAnalysesRepo.create({
    documentId: args.documentId,
    caseId: undefined,
    provider: 'gemini',
    status: 'needs_clarification',
    issueSummary: result.issueSummary,
    suggestedCaseType: result.suggestedCaseType,
    rawResponse: result.rawResponse,
  });
}

interface RunFollowUpArgs {
  analysisId: string;
  fileName: string;
  confirmedSummary: string;
  userIntent: string;
}

/** Step 2 of intake: forum/mechanism/department and applicant/opponent suggestions, given the confirmed incident + user's stated goal. */
export async function runIntakeFollowUp(args: RunFollowUpArgs): Promise<DocumentAnalysis> {
  const legalReferences = await legalReferencesRepo.findRelevant(`${args.confirmedSummary} ${args.userIntent}`);
  const prompt = buildIntakeAdvisePrompt({
    fileName: args.fileName,
    confirmedSummary: args.confirmedSummary,
    userIntent: args.userIntent,
    legalReferences,
  });

  const text = await callGemini(prompt);
  const result = parseIntakeAdviseResponse(text);

  await documentAnalysesRepo.update(args.analysisId, {
    status: 'complete',
    issueSummary: args.confirmedSummary,
    userIntent: args.userIntent,
    suggestedCaseTitle: result.suggestedCaseTitle,
    suggestedApplicantName: result.suggestedApplicantName,
    suggestedOpponentNames: result.suggestedOpponentNames,
    recommendedForums: result.recommendedForums,
    recommendedMechanisms: result.recommendedMechanisms,
    recommendedDepartments: result.recommendedDepartments,
    nextSteps: result.nextSteps,
    rawResponse: result.rawResponse,
  });

  const updated = await documentAnalysesRepo.get(args.analysisId);
  if (!updated) throw new Error('Failed to load updated analysis.');
  return updated;
}
