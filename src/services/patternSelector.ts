
import { SlidePattern } from '../types';

/**
 * Provides a list of all supported slide patterns.
 * @returns An array of SlidePattern enum values.
 */
export const getSupportedPatterns = (): SlidePattern[] => {
  return Object.values(SlidePattern);
};

/**
 * Placeholder for a function that might analyze user prompt to suggest a pattern.
 * Currently, pattern selection is primarily driven by the AI through the system prompt.
 * @param userPrompt - The user's input string.
 * @returns A suggested SlidePattern or a default.
 */
export const analyzeContentForPatternSuggestion = (userPrompt: string): SlidePattern => {
  // Basic heuristic, could be expanded. For now, defaults or simple keyword check.
  // This is NOT used for generation pattern selection, which is AI-driven.
  if (userPrompt.includes("比較") || userPrompt.includes("対比")) {
    return SlidePattern.TwoPaneComparison;
  }
  // Add more heuristics if needed for UI hints or other features
  return SlidePattern.TwoPaneComparison; // Default suggestion
};

/**
 * Validates if a chosen pattern is appropriate for given content structure.
 * (This would be more useful if content was generated independent of pattern,
 * or for validating manually constructed content against a pattern.)
 * @param pattern - The SlidePattern to validate against.
 * @param content - The slide content data.
 * @returns True if the pattern is valid for the content, false otherwise.
 */
export const validatePatternChoice = (pattern: SlidePattern, content: any): boolean => {
  // This would require specific validation logic per pattern.
  // Schema validation largely handles this if AI produces correct pattern_type.
  // For example:
  // if (pattern === SlidePattern.TwoPaneComparison) {
  //   return 'left_pane' in content && 'right_pane' in content;
  // }
  // console.warn("Pattern choice validation not fully implemented. Relies on schema validation.");
  return true; // Placeholder
};