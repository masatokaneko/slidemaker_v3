
import type { PersonalizationPreferences, PresentationStylePreference } from '../../types';
import { 
    IMAGE_DESCRIPTION_SYSTEM_PROMPT, 
    CONTENT_CRITIQUE_SYSTEM_PROMPT,
    ALT_TEXT_GENERATION_SYSTEM_PROMPT,
    SLIDE_GENERATION_FROM_IMAGE_PROMPT,
    YAML_GENERATION_SYSTEM_PROMPT
} from '../../constants';

export const PromptEngineer = {
  // --- Prompts for YAML Generation ---
  createYamlGenerationPrompt: (
    naturalLanguageInput: string,
    personalization?: PersonalizationPreferences
  ): { userPrompt: string; systemInstruction: string } => {
    let systemPrompt = YAML_GENERATION_SYSTEM_PROMPT;
    if (personalization?.preferredStyle) {
      // Example of incorporating style - though YAML prompt is more about structure
      // This might be more relevant for the textual content within the YAML
      systemPrompt += `\nEnsure the tone of the generated content is ${personalization.preferredStyle}.`;
    }
    // TODO: Incorporate custom prompts from personalization if relevant to YAML structure
    return {
      userPrompt: naturalLanguageInput,
      systemInstruction: systemPrompt,
    };
  },

  // --- Prompts for Image-based Content ---
  createImageDescriptionPrompt: (
    // No specific user prompt needed, system prompt guides the model
    personalization?: PersonalizationPreferences
  ): { systemInstruction: string } => {
    let systemPrompt = IMAGE_DESCRIPTION_SYSTEM_PROMPT;
    if (personalization?.preferredStyle) {
        systemPrompt += `\nAdopt a ${personalization.preferredStyle} tone for the description.`
    }
    return { systemInstruction: systemPrompt };
  },

  createSlideGenerationFromImagePrompt: (
    userObjective: string,
    personalization?: PersonalizationPreferences
  ): { systemInstruction: string } => {
    let systemPrompt = SLIDE_GENERATION_FROM_IMAGE_PROMPT(userObjective);
     if (personalization?.preferredStyle) {
        systemPrompt += `\nEnsure the slide content's tone is ${personalization.preferredStyle}.`;
    }
    // Note: The image itself will be part of the multimodal input, not in the text prompt.
    return { systemInstruction: systemPrompt };
  },

  // --- Prompts for Content Analysis & Enhancement ---
  createContentCritiquePrompt: (
    textContent: string,
    personalization?: PersonalizationPreferences
  ): { userPrompt: string; systemInstruction: string } => {
    const style = personalization?.preferredStyle || 'professional';
    return {
      userPrompt: textContent,
      systemInstruction: CONTENT_CRITIQUE_SYSTEM_PROMPT(style),
    };
  },

  createAltTextGenerationPrompt: (
    // Image is the primary input, no specific user text needed for the prompt itself
  ): { systemInstruction: string } => {
    // Alt text should be objective, style preference usually not applied.
    return { systemInstruction: ALT_TEXT_GENERATION_SYSTEM_PROMPT };
  },

  // --- Generic Prompt Enhancement (Example) ---
  applyContextualEnhancements: (
    basePrompt: string,
    context?: Record<string, string>, // e.g., { audience: "technical", goal: "inform" }
    personalization?: PersonalizationPreferences
  ): string => {
    let enhancedPrompt = basePrompt;
    if (personalization?.preferredStyle) {
      enhancedPrompt += `\n(Please use a ${personalization.preferredStyle} style for the response.)`;
    }
    if (context?.audience) {
      enhancedPrompt += `\n(Target audience: ${context.audience}.)`;
    }
    if (context?.goal) {
      enhancedPrompt += `\n(The primary goal is to: ${context.goal}.)`;
    }
    // TODO: Add more sophisticated chain-of-thought or few-shot structuring if needed
    return enhancedPrompt;
  },
};
