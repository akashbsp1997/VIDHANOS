import { initLlama, type LlamaContext } from 'llama.rn';

import { getLocalModelPath } from './localModel';
import type { AiProvider, AnalyzeDocumentInput, AnalysisResult } from './aiProvider';
import { buildPrompt, parseAnalysisResponse } from './aiProvider';

let cachedContext: LlamaContext | null = null;
let cachedModelPath: string | null = null;

async function getContext(): Promise<LlamaContext> {
  const modelPath = getLocalModelPath();
  if (!modelPath) {
    throw new Error('No local model downloaded. Download one from Settings to use offline AI guidance.');
  }

  if (cachedContext && cachedModelPath === modelPath) {
    return cachedContext;
  }

  cachedContext = await initLlama({ model: modelPath, n_ctx: 4096, n_gpu_layers: 0 });
  cachedModelPath = modelPath;
  return cachedContext;
}

export const localModelProvider: AiProvider = {
  id: 'local',

  async analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalysisResult> {
    if (!input.documentText) {
      throw new Error(
        'The offline model can only reason over text, not images/PDFs directly. Add a short description of the document to analyze it offline.'
      );
    }

    const context = await getContext();
    const prompt = buildPrompt(input);

    const result = await context.completion({
      prompt: `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`,
      n_predict: 700,
      stop: ['<|im_end|>'],
      temperature: 0.2,
    });

    return parseAnalysisResponse(result.text ?? '');
  },
};
