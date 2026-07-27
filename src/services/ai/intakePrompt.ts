import type { LegalReference, RecommendationItem } from '@/db/schema';

export interface IntakeReadInput {
  fileBase64?: string;
  mimeType?: string | null;
  fileName: string;
}

export interface IntakeReadResult {
  issueSummary: string;
  suggestedCaseType: string;
  rawResponse: string;
}

export function buildIntakeReadPrompt(input: IntakeReadInput): string {
  return `You are assisting an Indian lawyer's case-management app. A document has just been uploaded (it could be a receipt, application, order, bill, notice, or any legal/administrative paper). Read it${input.fileBase64 ? '' : ' (no file content was provided — respond with an empty issueSummary)'} and describe, in plain language a client could understand, what incident or issue it appears to concern. Do not recommend anything yet — just describe what you see.

File name: ${input.fileName}

Respond with ONLY a JSON object, no prose outside it:
{
  "issueSummary": string,
  "suggestedCaseType": string
}`;
}

export function parseIntakeReadResponse(text: string): IntakeReadResult {
  const parsed = safeParseJson(text) as { issueSummary?: string; suggestedCaseType?: string } | null;
  return {
    issueSummary: parsed?.issueSummary ?? '',
    suggestedCaseType: parsed?.suggestedCaseType ?? '',
    rawResponse: text,
  };
}

export interface IntakeAdviseInput {
  fileName: string;
  confirmedSummary: string;
  userIntent: string;
  legalReferences: LegalReference[];
}

export interface IntakeAdviseResult {
  suggestedCaseTitle: string;
  suggestedApplicantName: string;
  suggestedOpponentNames: string[];
  recommendedForums: RecommendationItem[];
  recommendedMechanisms: RecommendationItem[];
  recommendedDepartments: RecommendationItem[];
  nextSteps: string[];
  rawResponse: string;
}

function buildGroundingContext(legalReferences: LegalReference[]): string {
  if (legalReferences.length === 0) return 'No local reference data available.';
  return legalReferences.map((ref) => `- [${ref.category}] ${ref.name}: ${ref.description ?? ''}`).join('\n');
}

export function buildIntakeAdvisePrompt(input: IntakeAdviseInput): string {
  const grounding = buildGroundingContext(input.legalReferences);

  return `You are assisting an Indian lawyer's case-management app during intake of a new matter. Here is the confirmed incident and what the user wants to do about it:

Incident: ${input.confirmedSummary}
What the user wants to do about it: ${input.userIntent}
Document file name: ${input.fileName}

Reference list of departments/mechanisms/forums you may draw on (prefer these when relevant, but you are not limited to them):
${grounding}

Based on this, suggest: a short case title, the likely applicant/complainant name (the user's own client — if not named in the incident, suggest a generic placeholder like "Applicant"), the likely opponent/respondent name(s) mentioned or implied, the proper forum/authority to approach, relevant legal mechanisms and government departments, and concrete next steps.

Respond with ONLY a JSON object, no prose outside it:
{
  "suggestedCaseTitle": string,
  "suggestedApplicantName": string,
  "suggestedOpponentNames": string[],
  "recommendedForums": [{ "name": string, "reason": string }],
  "recommendedMechanisms": [{ "name": string, "reason": string }],
  "recommendedDepartments": [{ "name": string, "reason": string }],
  "nextSteps": string[]
}`;
}

interface IntakeAdviseJson {
  suggestedCaseTitle?: string;
  suggestedApplicantName?: string;
  suggestedOpponentNames?: string[];
  recommendedForums?: RecommendationItem[];
  recommendedMechanisms?: RecommendationItem[];
  recommendedDepartments?: RecommendationItem[];
  nextSteps?: string[];
}

export function parseIntakeAdviseResponse(text: string): IntakeAdviseResult {
  const parsed = safeParseJson(text) as IntakeAdviseJson | null;
  return {
    suggestedCaseTitle: parsed?.suggestedCaseTitle ?? '',
    suggestedApplicantName: parsed?.suggestedApplicantName ?? '',
    suggestedOpponentNames: parsed?.suggestedOpponentNames ?? [],
    recommendedForums: parsed?.recommendedForums ?? [],
    recommendedMechanisms: parsed?.recommendedMechanisms ?? [],
    recommendedDepartments: parsed?.recommendedDepartments ?? [],
    nextSteps: parsed?.nextSteps ?? [],
    rawResponse: text,
  };
}

function safeParseJson(text: string): unknown {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}
