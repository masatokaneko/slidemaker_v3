
import type { 
    ApiResponse, 
    ImagePart, 
    PersonalizationPreferences, 
    AISuggestion, 
    ContentAnalysisResult 
} from '../../types';
import { geminiService } from '../geminiService';
import { MultimodalProcessor } from './MultimodalProcessor';
import { PromptEngineer } from './PromptEngineer';

export const ContentAnalyzer = {
  /**
   * Gets an AI-powered critique for the given text content.
   * @param textContent The text to be critiqued.
   * @param personalization Optional user personalization preferences.
   * @returns A promise resolving to an ApiResponse containing the critique.
   */
  critiqueContent: async (
    textContent: string,
    personalization?: PersonalizationPreferences
  ): Promise<ApiResponse<string>> => { // Returns raw critique string, parsing into AISuggestion is an advanced step
    if (!textContent.trim()) {
      return { success: false, error: { message: "Content is empty.", userMessage: "Cannot critique empty content." } };
    }
    const { userPrompt, systemInstruction } = PromptEngineer.createContentCritiquePrompt(textContent, personalization);
    return geminiService.generateContent(userPrompt, systemInstruction);
  },

  /**
   * Generates alt text for a given image.
   * @param imagePart The processed ImagePart.
   * @returns A promise resolving to an ApiResponse containing the generated alt text.
   */
  generateAltTextForImage: async (
    imagePart: ImagePart
  ): Promise<ApiResponse<string>> => {
    const { systemInstruction } = PromptEngineer.createAltTextGenerationPrompt();
    // The imagePart itself is the primary content for the multimodal prompt.
    // No additional text part is strictly necessary unless a prefix like "Generate alt text for this:" is desired.
    return MultimodalProcessor.generateContentFromMultimodalInput([imagePart], systemInstruction);
  },

  /**
   * Placeholder for more advanced content analysis.
   * Could involve parsing Gemini's critique into structured AISuggestion objects.
   * Could perform client-side readability checks if a library is used.
   */
  analyzeTextForSuggestions: async (
    textContent: string,
    personalization?: PersonalizationPreferences
  ): Promise<ContentAnalysisResult> => {
    const critiqueResponse = await ContentAnalyzer.critiqueContent(textContent, personalization);
    const suggestions: AISuggestion[] = [];
    if (critiqueResponse.success && critiqueResponse.data) {
      // Basic parsing: Assume critique might contain actionable points.
      // This is a simplified approach. A more robust solution would involve
      // instructing Gemini to format critique in a parsable way (e.g., JSON).
      suggestions.push({
        id: `critique-${Date.now()}`,
        type: 'content_improvement',
        description: `AI Critique: ${critiqueResponse.data.substring(0, 200)}${critiqueResponse.data.length > 200 ? '...' : ''}`, // Truncate for display
        suggestedText: critiqueResponse.data, // The full critique as a "suggestion"
      });
    }
    
    // Placeholder for readability score, etc.
    return {
      critique: critiqueResponse.success ? critiqueResponse.data : critiqueResponse.error?.userMessage,
      suggestions,
      // readabilityScore: calculateReadability(textContent), // If implemented
    };
  },

  // Placeholder for fact-checking - this would typically require a specialized API or a very carefully crafted prompt.
  // verifyFacts: async (text: string): Promise<ApiResponse<FactCheckResult>> => { ... }
};
