
import React from 'react';
import type { PatternType, SlideContent } from '../types';
import type { RendererProps } from '../components/renderers/BaseRenderer';

// Import actual renderer components
import { TwoPaneRenderer } from '../components/renderers/TwoPaneRenderer';
import { ThreePaneRenderer } from '../components/renderers/ThreePaneRenderer';
import { LinearProcessRenderer } from '../components/renderers/LinearProcessRenderer';
import { SUPPORTED_PATTERNS } from '../constants';


// Define a type for the renderer component
type SlideRendererComponent = React.FC<RendererProps<any>>; // Use 'any' for content type here, specific types in renderer files

// Map pattern types to their renderer components
const rendererMap: Record<PatternType, SlideRendererComponent> = {
  '2pane_comparison': TwoPaneRenderer,
  '3pane_parallel': ThreePaneRenderer,
  'linear_process': LinearProcessRenderer,
};

export const patternEngine = {
  /**
   * Gets the renderer component for a given pattern type.
   * @param patternType The type of the pattern.
   * @returns The React functional component for rendering the pattern, or undefined if not found.
   */
  getRenderer: (patternType: PatternType): SlideRendererComponent | undefined => {
    return rendererMap[patternType];
  },

  /**
   * Gets a list of all supported pattern types.
   * @returns An array of PatternType strings.
   */
  getSupportedPatterns: (): PatternType[] => {
    return SUPPORTED_PATTERNS;
  },

  /**
   * Validates if a given pattern type is supported.
   * @param patternType The type of the pattern.
   * @returns True if the pattern type is supported, false otherwise.
   */
  isPatternSupported: (patternType: string): patternType is PatternType => {
    return SUPPORTED_PATTERNS.includes(patternType as PatternType);
  }
};

// The "SlideRenderer" interface from the prompt is conceptually implemented by
// each individual renderer component's props (e.g., React.FC<RendererProps<TwoPaneComparisonContent>>).
// The "RendererFactory" is conceptually what SlidePreview.tsx does when it uses patternEngine.getRenderer().
