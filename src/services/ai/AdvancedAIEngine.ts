
import type { 
    ApiResponse, 
    PresentationData, 
    ImagePart, 
    PersonalizationPreferences, 
    AISuggestion,
    MultimodalContentPart,
    TextPart,
    SlideContent
} from '../../types';
import { MultimodalProcessor } from './MultimodalProcessor';
import { PromptEngineer } from './PromptEngineer';
import { ContentAnalyzer } from './ContentAnalyzer';
import { PersonalizationEngine } from './PersonalizationEngine';
import { yamlGeneratorService } from '../yamlGeneratorService'; // For parsing YAML from image generation
import { validateAndParseYaml } from '../../utils/validation';

export const AdvancedAIEngine = {
  /**
   * Generates a full presentation slide (YAML structure) based on an image and a user objective.
   * @param imageFile The image file object.
   * @param userObjective A string describing what the user wants to achieve with this slide.
   * @returns A promise resolving to an ApiResponse containing PresentationData.
   */
  generateSlideFromImageAndObjective: async (
    imageFile: File,
    userObjective: string
  ): Promise<ApiResponse<PresentationData>> => {
    const imageProcessResult = await MultimodalProcessor.processImageFile(imageFile);
    if (typeof imageProcessResult === 'string') { // Error message
      return { success: false, error: { message: imageProcessResult, userMessage: imageProcessResult } };
    }
    const imagePart: ImagePart = imageProcessResult;

    const personalization = PersonalizationEngine.loadPreferences();
    const { systemInstruction } = PromptEngineer.createSlideGenerationFromImagePrompt(userObjective, personalization);
    
    // The prompt for the model is the image itself + any textual instructions (if any)
    // The systemInstruction guides the overall task.
    const textPart: TextPart = { text: `Objective: ${userObjective}. Generate a slide based on the provided image.` };
    const parts: MultimodalContentPart[] = [imagePart, textPart];

    const geminiResponse = await MultimodalProcessor.generateContentFromMultimodalInput(parts, systemInstruction);

    if (!geminiResponse.success || !geminiResponse.data) {
      return { 
        success: false, 
        error: geminiResponse.error || { message: "Failed to generate content from image.", userMessage: "Could not generate slide from image." },
        usage: geminiResponse.usage 
      };
    }

    // The response is expected to be YAML, parse and validate it.
    const rawYamlFromGemini = geminiResponse.data;
    const validationResult = validateAndParseYaml(rawYamlFromGemini);

    if (!validationResult.isValid || !validationResult.data) {
      const errorDetail = validationResult.errors 
        ? validationResult.errors.map(e => `${e.instancePath || 'general'}: ${e.message}`).join('; ')
        : "No specific error details.";
      return { 
        success: false, 
        error: { 
          message: `Generated YAML from image is invalid. Details: ${errorDetail}`, 
          userMessage: `The AI generated an invalid slide structure from the image. (Details: ${validationResult.errors?.[0]?.message || 'schema validation failed'})`
        }, 
        usage: geminiResponse.usage,
        rawYaml: validationResult.rawYaml
      };
    }
    
    return {
      success: true,
      data: validationResult.data as PresentationData,
      usage: geminiResponse.usage,
      rawYaml: validationResult.rawYaml
    };
  },

  /**
   * Provides AI-powered suggestions for improving given text content.
   * @param textContent The text content to get suggestions for.
   * @returns A promise resolving to an ApiResponse containing an array of AISuggestion objects.
   */
  getSuggestionsForContent: async (
    textContent: string
  ): Promise<ApiResponse<AISuggestion[]>> => {
    if (!textContent.trim()) {
      return { success: true, data: [] }; // No suggestions for empty content
    }
    const personalization = PersonalizationEngine.loadPreferences();
    const analysisResult = await ContentAnalyzer.analyzeTextForSuggestions(textContent, personalization);

    if (analysisResult.suggestions && analysisResult.suggestions.length > 0) {
      return { success: true, data: analysisResult.suggestions };
    } else if (analysisResult.critique && !analysisResult.suggestions?.length) {
      // If critique exists but no formal suggestions, treat critique itself as a suggestion
      return { success: true, data: [{
          id: `critique-suggestion-${Date.now()}`,
          type: 'content_improvement',
          description: analysisResult.critique,
          suggestedText: analysisResult.critique, // The full critique as "suggested text"
      }]};
    }
    
    return { success: false, error: { message: "Failed to get suggestions.", userMessage: "Could not retrieve suggestions for the content." }};
  },

  /**
   * Generates alt text for a given image file.
   * @param imageFile The image file to generate alt text for.
   * @returns A promise resolving to an ApiResponse containing the alt text string.
   */
  generateAltText: async (imageFile: File): Promise<ApiResponse<string>> => {
    const imageProcessResult = await MultimodalProcessor.processImageFile(imageFile);
    if (typeof imageProcessResult === 'string') { // Error message
      return { success: false, error: { message: imageProcessResult, userMessage: imageProcessResult } };
    }
    const imagePart: ImagePart = imageProcessResult;
    return ContentAnalyzer.generateAltTextForImage(imagePart);
  },

  // Placeholder for more advanced features
  // enhanceSlideContentWithAI: async (slideContent: SlideContent, objective: string): Promise<ApiResponse<SlideContent>> => {...}
  // getContextualImageSuggestions: async (slideText: string): Promise<ApiResponse<ImageSuggestion[]>> => {...}
};
