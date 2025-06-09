
import { geminiService } from './geminiService';
import { YAML_GENERATION_SYSTEM_PROMPT } from '../constants';
import type { PresentationData, ApiResponse, ApiError } from '../types';
import { validateAndParseYaml } from '../utils/validation';

export const yamlGeneratorService = {
  generatePresentationYaml: async (
    naturalLanguageInput: string
  ): Promise<ApiResponse<PresentationData>> => {
    
    const geminiResponse = await geminiService.generateContent(
      naturalLanguageInput,
      YAML_GENERATION_SYSTEM_PROMPT,
      true // Enable thinking for higher quality YAML structure
    );

    if (!geminiResponse.success || !geminiResponse.data) {
      return {
        success: false,
        error: geminiResponse.error || { message: "Unknown error from Gemini Service", userMessage: "Failed to generate content." },
        usage: geminiResponse.usage,
        rawYaml: (geminiResponse as any).rawYaml // Pass through rawYaml if available
      };
    }

    const rawYamlFromGemini = geminiResponse.data;
    const validationResult = validateAndParseYaml(rawYamlFromGemini);

    if (!validationResult.isValid || !validationResult.data) {
      const errorDetail = validationResult.errors 
        ? validationResult.errors.map(e => `${e.instancePath || 'general'}: ${e.message}`).join('; ')
        : "No specific error details.";
      const apiError: ApiError = {
        message: `Generated YAML is invalid or does not match schema. Details: ${errorDetail}`,
        userMessage: `The AI generated an invalid structure. Please try rephrasing or try again. (Details: ${validationResult.errors?.[0]?.message || 'schema validation failed'})`,
      };
      // Pass rawYaml from validation (which includes cleaning)
      return { success: false, error: apiError, usage: geminiResponse.usage, rawYaml: validationResult.rawYaml };
    }
    
    return {
      success: true,
      data: validationResult.data as PresentationData, // Type assertion after validation
      usage: geminiResponse.usage,
      rawYaml: validationResult.rawYaml // Pass validated/cleaned YAML
    };
  },
};
