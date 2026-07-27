import type { LegalReference, RecommendationItem } from '@/db/schema';

export interface AnalyzeDocumentInput {
  fileBase64?: string;
  mimeType?: string | null;
  documentText?: string;
  fileName: string;
  legalReferences: LegalReference[];
  priorClarifyingQuestions?: string[];
  userAnswers?: Record<string, string>;
}

export interface AnalysisResult {
  issueSummary: string;
  recommendedDepartments: RecommendationItem[];
  recommendedMechanisms: RecommendationItem[];
  recommendedForums: RecommendationItem[];
  clarifyingQuestions: string[];
  nextSteps: string[];
  rawResponse: string;
}

export const GUIDANCE_DISCLAIMER =
  'AI-generated suggestion — verify independently. This is not legal advice.';

function buildGroundingContext(legalReferences: LegalReference[]): string {
  if (legalReferences.length === 0) return 'No local reference data available.';
  return legalReferences.map((ref) => `- [${ref.category}] ${ref.name}: ${ref.description ?? ''}`).join('\n');
}

export function buildPrompt(input: AnalyzeDocumentInput): string {
  const grounding = buildGroundingContext(input.legalReferences);
  const clarificationContext =
    input.priorClarifyingQuestions && input.priorClarifyingQuestions.length > 0
      ? `\n\nPreviously asked clarifying questions and the user's answers:\n${input.priorClarifyingQuestions
          .map((q) => `Q: ${q}\nA: ${input.userAnswers?.[q] ?? '(not answered)'}`)
          .join('\n')}`
      : '';

  return `You are assisting an Indian lawyer's case-management app. A document has been uploaded (it could be a receipt, application, order, bill, notice, or any legal/administrative paper). Based on its content${input.documentText ? '' : ' (attached as an image/PDF)'}, identify the underlying issue and recommend how to proceed.

Reference list of departments/mechanisms/forums you may draw on (prefer these when relevant, but you are not limited to them):
${grounding}

File name: ${input.fileName}
${input.documentText ? `Extracted text:\n${input.documentText}` : ''}${clarificationContext}

Respond with ONLY a JSON object matching this shape, no prose outside the JSON:
{
  "issueSummary": string,
  "recommendedDepartments": [{ "name": string, "reason": string }],
  "recommendedMechanisms": [{ "name": string, "reason": string }],
  "recommendedForums": [{ "name": string, "reason": string }],
  "clarifyingQuestions": string[],
  "nextSteps": string[]
}

If you need more information from the user before giving a confident recommendation, put your questions in "clarifyingQuestions" and leave the recommendation arrays empty or partial. Once you have enough information (including after clarifying answers above), leave "clarifyingQuestions" empty and fill in full recommendations with concrete "nextSteps".`;
}

export function parseAnalysisResponse(text: string): AnalysisResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return emptyResult(text);
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      issueSummary: parsed.issueSummary ?? '',
      recommendedDepartments: parsed.recommendedDepartments ?? [],
      recommendedMechanisms: parsed.recommendedMechanisms ?? [],
      recommendedForums: parsed.recommendedForums ?? [],
      clarifyingQuestions: parsed.clarifyingQuestions ?? [],
      nextSteps: parsed.nextSteps ?? [],
      rawResponse: text,
    };
  } catch {
    return emptyResult(text);
  }
}

function emptyResult(text: string): AnalysisResult {
  return {
    issueSummary: text.slice(0, 500),
    recommendedDepartments: [],
    recommendedMechanisms: [],
    recommendedForums: [],
    clarifyingQuestions: [],
    nextSteps: [],
    rawResponse: text,
  };
}
