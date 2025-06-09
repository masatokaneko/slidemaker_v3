
import type { SlideContent, PatternType } from "../../types";

// This file primarily serves to define common types/interfaces for renderer components.
// In a React context, an "abstract base renderer class" is less common than
// shared prop interfaces or Higher Order Components.

/**
 * Base properties expected by any slide renderer component.
 * @template T - The specific type of content object for the pattern.
 */
export interface RendererProps<T extends SlideContent> {
  content: T;
  // patternType: PatternType; // Could be added if renderers need to know their type explicitly
                               // but usually, the correct renderer is chosen beforehand.
}

// Example of how a specific renderer might use it:
// import { RendererProps } from './BaseRenderer';
// import type { TwoPaneComparisonContent } from '../../types';
// const TwoPaneRenderer: React.FC<RendererProps<TwoPaneComparisonContent>> = ({ content }) => { ... };
