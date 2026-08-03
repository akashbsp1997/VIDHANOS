import { GoogleGenAI } from '@google/genai';

import { settingsRepo } from '@/db/repositories/settingsRepo';
import type { CaseWithRelations } from '@/db/repositories/casesRepo';
import type { DraftInputFacts } from '@/services/drafting/draftTemplates';

const MODEL = 'gemini-2.5-flash';

const DRAFT_STRUCTURE: Record<string, string> = {
  legal_notice:
    'sender/recipient details, statement of facts, the specific grievance, the relief demanded, a time limit to comply, and a statement that legal proceedings will follow if unmet',
  petition: 'cause title, numbered statement of facts, legal grounds, and a prayer clause',
  plaint:
    'cause title, parties with addresses, jurisdiction statement, cause of action with date, valuation, numbered facts, and a prayer clause',
  written_statement:
    "preliminary objections (if any), paragraph-by-paragraph response to the plaint's facts, additional facts/defenses, and a prayer clause",
  affidavit: "deponent's details, numbered statements of fact on personal knowledge or belief, and a verification clause",
  application: 'cause title, the specific request, the grounds for it, and a prayer clause',
  reply: 'point-by-point response to the points raised, and a closing statement of position',
  appeal: "cause title, the impugned order's details, grounds of appeal, and a prayer clause",
  rejoinder: "point-by-point response to the other side's reply, reaffirming the original position, and a closing statement",
  other: 'a clear statement of purpose, the relevant facts, and a closing statement or request',
};

const ANTI_HALLUCINATION_NOTE =
  'Use ONLY the case facts given to you below. Where a needed detail is not among those facts, write a clear placeholder like "[TO BE FILLED: address]" instead of inventing one. Never invent section/act citations or case law you were not given -- write "[CITE APPLICABLE PROVISION]" instead.';

function buildSystem(draftType: string): string {
  return `You are drafting a "${draftType.replace(/_/g, ' ')}" document for a real legal/administrative case, in formal Indian legal drafting style.
Structure to follow: ${DRAFT_STRUCTURE[draftType] || DRAFT_STRUCTURE.other}
${ANTI_HALLUCINATION_NOTE}
Write it complete and properly structured, in plain text with clear paragraph/section breaks (no markdown, no code fences).

Return ONLY a JSON object, no other text, in exactly this shape:
{ "title": "<a short descriptive title>", "content": "<the full drafted document text>" }`;
}

function formatParties(caseData: CaseWithRelations): string {
  const petitioner = `- ${caseData.client.name} (applicant/petitioner)`;
  const respondents = caseData.opponents.map((o) => `- ${o.name} (respondent/opposite party)`);
  return [petitioner, ...respondents].join('\n');
}

function buildUserPrompt(args: {
  caseData: CaseWithRelations;
  facts: DraftInputFacts;
  instructions?: string;
  existingContent?: string;
}): string {
  const { caseData, facts, instructions, existingContent } = args;
  const block = `Case summary: ${facts.description || facts.causeOfAction || '(none given)'}
Forum: ${caseData.forumName || '(not yet chosen)'}
Case number: ${caseData.cnrNumber || '(not yet allotted)'}
Parties:
${formatParties(caseData)}`;

  if (existingContent) {
    return `${block}

Existing draft:
"""
${existingContent}
"""

Requested change: ${instructions || 'General review -- fix any inconsistency with the case facts and tighten the language.'}

Produce the FULL updated document. Return only the JSON object.`;
  }

  return `${block}

Additional drafting instructions: ${instructions || '(none -- draft based on the case facts above alone)'}

Draft the document now. Return only the JSON object.`;
}

function safeParseJson(text: string): { title?: string; content?: string } | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

export interface AiDraftResult {
  title: string;
  content: string;
}

/**
 * Optional online AI rewrite of a draft, grounded ONLY in the case's own stored facts -- same
 * anti-hallucination discipline as the offline templates. Caller must confirm a Gemini key is
 * configured and the device is online before invoking; never auto-triggered.
 */
export async function aiDraft(args: {
  draftType: string;
  caseData: CaseWithRelations;
  facts: DraftInputFacts;
  instructions?: string;
  existingContent?: string;
}): Promise<AiDraftResult> {
  const apiKey = await settingsRepo.getGeminiApiKey();
  if (!apiKey) throw new Error('No Gemini API key configured. Add one in Settings.');

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [{ text: `${buildSystem(args.draftType)}\n\n${buildUserPrompt(args)}` }],
      },
    ],
  });

  const raw = safeParseJson(response.text ?? '');
  const title = typeof raw?.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 200) : `Untitled ${args.draftType.replace(/_/g, ' ')}`;
  const content = typeof raw?.content === 'string' ? raw.content.trim() : '';
  if (!content) throw new Error('The model returned an empty draft.');
  return { title, content };
}
