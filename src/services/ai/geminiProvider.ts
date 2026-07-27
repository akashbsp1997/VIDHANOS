import { GoogleGenAI } from '@google/genai';

import { getGeminiApiKey } from '@/services/secureConfig';
import type { AiProvider, AnalyzeDocumentInput, AnalysisResult } from './aiProvider';
import { buildPrompt, parseAnalysisResponse } from './aiProvider';

const MODEL = 'gemini-2.5-flash';

export const geminiProvider: AiProvider = {
  id: 'gemini',

  async analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalysisResult> {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('No Gemini API key configured. Add one in Settings.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(input);

    const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
      { text: prompt },
    ];
    if (input.fileBase64) {
      parts.push({ inlineData: { data: input.fileBase64, mimeType: input.mimeType ?? 'application/octet-stream' } });
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts }],
    });

    const text = response.text ?? '';
    return parseAnalysisResponse(text);
  },
};
