import { GoogleGenAI } from '@google/genai';

import { settingsRepo } from '@/db/repositories/settingsRepo';
import { buildPrompt, parseAnalysisResponse, type AnalysisResult, type AnalyzeDocumentInput } from './guidancePrompt';

const MODEL = 'gemini-2.5-flash';

export async function analyzeDocumentWithGemini(input: AnalyzeDocumentInput): Promise<AnalysisResult> {
  const apiKey = await settingsRepo.getGeminiApiKey();
  if (!apiKey) {
    throw new Error('No Gemini API key configured. Add one in Settings.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(input);

  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: prompt }];
  if (input.fileBase64) {
    parts.push({ inlineData: { data: input.fileBase64, mimeType: input.mimeType ?? 'application/octet-stream' } });
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts }],
  });

  return parseAnalysisResponse(response.text ?? '');
}
