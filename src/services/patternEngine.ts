
import React from 'react';
import { SlidePattern, Slide, TwoPaneComparisonContent, ThreePaneParallelContent, LinearProcessContent } from '../types';
import TwoPaneComparisonRenderer from '../renderers/TwoPaneComparisonRenderer';
import ThreePaneParallelRenderer from '../renderers/ThreePaneParallelRenderer';
import LinearProcessRenderer from '../renderers/LinearProcessRenderer';
import { ISlideRenderer, SlideRendererProps } from '../renderers/BaseRenderer';

// Type mapping specific content types to their renderers
// Using an interface with string literal keys corresponding to SlidePattern enum values
interface TypedRendererMapping {
  '2pane_comparison': ISlideRenderer<TwoPaneComparisonContent>;
  '3pane_parallel': ISlideRenderer<ThreePaneParallelContent>;
  'linear_process': ISlideRenderer<LinearProcessContent>;
}

const rendererMap: TypedRendererMapping = {
  [SlidePattern.TwoPaneComparison]: TwoPaneComparisonRenderer,
  [SlidePattern.ThreePaneParallel]: ThreePaneParallelRenderer,
  [SlidePattern.LinearProcess]: LinearProcessRenderer,
};

/**
 * Gets the appropriate React component for rendering a given slide pattern.
 * @param patternType - The type of slide pattern.
 * @returns The React functional component for the pattern, or a fallback component if not found.
 */
export const getRendererComponent = (patternType: SlidePattern): React.FC<SlideRendererProps<any>> => {
  const renderer = rendererMap[patternType as keyof TypedRendererMapping]; // Ensure patternType is a valid key
  if (renderer) {
    return renderer;
  }

  // Fallback for unsupported or unknown patterns
  return (props: { content: any }) => (
    React.createElement('div', { className: 'text-red-500 p-4' }, 
      `Unsupported slide pattern: ${patternType}. Content: ${JSON.stringify(props.content, null, 2)}`
    )
  );
};

/**
 * Renders a slide using the appropriate component based on its pattern type.
 * @param slide - The slide data.
 * @returns JSX.Element for the rendered slide.
 */
export const renderSlide = (slide: Slide): JSX.Element => {
  const RendererComponent = getRendererComponent(slide.pattern_type);
  
  // Type assertion is needed here because RendererComponent is React.FC<any>
  // and slide.content is a union type. The switch in SlidePreview handled this more gracefully.
  // However, the `patternEngine` is requested, so this is one way to implement it.
  // A better way would be for getRendererComponent to be more type-safe or for the caller
  // to handle the type narrowing.
  
  // This dynamic rendering approach is powerful but can be tricky with TypeScript's type narrowing
  // for union content types if not handled carefully in the calling component (SlidePreview).
  return React.createElement(RendererComponent, { content: slide.content });
};