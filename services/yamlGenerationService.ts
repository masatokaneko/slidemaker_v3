
import { generateGeminiContent, validateApiKey } from './geminiService';
import { MAX_INPUT_LENGTH } from '../utils/constants';
import { YAML_GENERATION_SYSTEM_PROMPT_V2 } from '../utils/enhancedPromptEngineering';
import { ApiError, YamlOutput, GenerateContentResponseWithGrounding } from '../types';

// Sanitizes user input: basic length check. More complex PII removal could be added.
const sanitizeInput = (text: string): string => {
  if (text.length > MAX_INPUT_LENGTH) {
    return text.substring(0, MAX_INPUT_LENGTH);
  }
  return text;
};

// Generates YAML string for a presentation based on user input
export const generatePresentationYaml = async (
  userInput: string
): Promise<{ yaml?: YamlOutput; groundingMetadata?: GenerateContentResponseWithGrounding['candidates']; error?: ApiError }> => {
  if (!validateApiKey()) {
    return { error: { message: "API Key is not configured. Please check setup." } };
  }

  const sanitizedInput = sanitizeInput(userInput);
  if (!sanitizedInput.trim()) {
    return { error: { message: "Input cannot be empty." } };
  }

  const fullPrompt = `ユーザー入力:\n${sanitizedInput}\n\n上記入力に基づいて、最適なパターンスタイルを選択し、そのパターンのYAMLを作成してください。`;

  // Using the new system prompt that instructs AI to select a pattern
  const result = await generateGeminiContent(fullPrompt, YAML_GENERATION_SYSTEM_PROMPT_V2);

  if (result.error) {
    return { error: result.error };
  }

  if (result.data && result.data.text) {
    return { yaml: result.data.text, groundingMetadata: result.data.candidates };
  }

  return { error: { message: "Failed to generate YAML content. Empty response from AI." } };
};
