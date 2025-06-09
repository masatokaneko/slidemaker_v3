
import type { PatternType } from '../types';
import { SUPPORTED_PATTERNS } from '../constants';

/**
 * Represents the result of a pattern analysis or suggestion.
 */
export interface PatternAnalysisResult {
  suggestedPattern: PatternType;
  confidence?: number; // Optional confidence score (0-1)
  justification?: string; // Optional reason for suggestion
}

export const patternSelector = {
  /**
   * Analyzes user prompt text to suggest a pattern.
   * NOTE: Currently, the primary pattern selection is handled by the Gemini API via an enhanced system prompt.
   * This function serves as a placeholder for potential future client-side enhancements or fallbacks.
   * @param userPrompt The natural language input from the user.
   * @returns A PatternAnalysisResult object.
   */
  analyzeContentForPattern: (userPrompt: string): PatternAnalysisResult => {
    // Placeholder logic: For now, could default to a common pattern or return a list.
    // In a more advanced client-side version, this might involve keyword matching,
    // simple NLP, or heuristics.
    console.warn("patternSelector.analyzeContentForPattern is a placeholder. Gemini API currently handles primary pattern selection.");
    
    // Default suggestion or very basic heuristic
    if (userPrompt.toLowerCase().includes("比較") || userPrompt.toLowerCase().includes("vs")) {
        return { suggestedPattern: '2pane_comparison', justification: "Keyword '比較' or 'vs' found." };
    }
    // For this phase, we rely on Gemini.
    return { suggestedPattern: '2pane_comparison' }; // Default fallback
  },

  /**
   * Suggests a pattern based on already structured content (e.g., if a user pastes YAML).
   * @param content The structured content (e.g., PresentationData object).
   * @returns A PatternAnalysisResult object.
   */
  suggestPatternFromStructuredContent: (content: any): PatternAnalysisResult => {
    // Placeholder for logic that inspects structured data to infer a pattern.
    console.warn("patternSelector.suggestPatternFromStructuredContent is a placeholder.");
    if (content && content.left_pane && content.right_pane) {
        return { suggestedPattern: '2pane_comparison' };
    }
    return { suggestedPattern: '2pane_comparison' }; // Default fallback
  },

  /**
   * Validates if a chosen pattern is appropriate for given content (or if content matches pattern).
   * @param pattern The pattern type to validate against.
   * @param content The content (either natural language or structured).
   * @returns True if the choice is considered valid, false otherwise.
   */
  validatePatternChoice: (pattern: PatternType, content: any): boolean => {
    // Placeholder for more complex validation logic.
    // Could involve checking if required fields for a pattern can be reasonably extracted from content.
    console.warn("patternSelector.validatePatternChoice is a placeholder.");
    return SUPPORTED_PATTERNS.includes(pattern); // Basic check: is the pattern known?
  },

  /**
   * Returns the list of all officially supported pattern types.
   * @returns Array of PatternType strings.
   */
  getSupportedPatterns: (): PatternType[] => {
    return [...SUPPORTED_PATTERNS];
  }
};
