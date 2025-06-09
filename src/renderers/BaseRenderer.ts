import React, { PropsWithChildren } from 'react';
import { SlidePattern } from '../types';

// Generic props for any slide content renderer
export interface SlideRendererProps<TContent> {
  content: TContent;
}

// Interface that each specific slide renderer component could adhere to
// Updated to match React.FC's parameter signature for better compatibility
export interface ISlideRenderer<TContent> {
  (props: PropsWithChildren<SlideRendererProps<TContent>>, context?: any): JSX.Element | null;
}

// Type for a map of pattern types to renderer components
export type RendererMapping = {
  [key in SlidePattern]?: React.FC<any>; // React.FC<SlideRendererProps<SpecificContentType>>
};