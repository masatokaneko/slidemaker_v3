import React from 'react';
import type { PresentationData, Slide, SlideContent, PatternType } from '../types';
import { patternEngine } from '../services/patternEngine';
import { FileQuestion, Maximize } from 'lucide-react';
import { FullScreenButton } from './FullScreenButton'; // Import FullScreenButton
import { IconButton } from './ui/IconButton';

interface SlidePreviewProps {
  presentationData: PresentationData | null;
  currentSlideIndex: number;
  previewRef: React.RefObject<HTMLDivElement>; // For FullScreenButton target
}

const UnknownPatternRenderer: React.FC<{ patternType: string }> = ({ patternType }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center text-text-secondary p-4 bg-surface-alt rounded-md border border-border">
    <FileQuestion size={48} className="mb-4 text-warning" />
    <h3 className="text-lg font-semibold mb-2 text-text-primary">Unsupported Slide Pattern</h3>
    <p className="text-sm">
      The pattern type "<span className="font-mono bg-border px-1 rounded">{patternType}</span>" is not recognized or supported by the current preview engine.
    </p>
    <p className="text-xs mt-2 text-text-disabled">Please check the generated YAML or contact support.</p>
  </div>
);


export const SlidePreview: React.FC<SlidePreviewProps> = ({ presentationData, currentSlideIndex, previewRef }) => {
  if (!presentationData || !presentationData.slides || presentationData.slides.length === 0) {
    return (
      <div className="w-full aspect-4/3 bg-surface-alt rounded-lg flex items-center justify-center text-text-secondary border border-border">
        No slide data available for preview.
      </div>
    );
  }

  const currentSlide = presentationData.slides[currentSlideIndex];

  if (!currentSlide) {
     return (
      <div className="w-full aspect-4/3 bg-surface-alt rounded-lg flex items-center justify-center text-text-secondary border border-border">
        Invalid slide index.
      </div>
    );
  }
  
  const RendererComponent = patternEngine.getRenderer(currentSlide.pattern_type);

  return (
    <div 
      ref={previewRef} // Attach ref here for fullscreen targeting
      className="w-full max-w-[800px] aspect-4/3 bg-surface border border-border rounded-lg shadow-xl p-5 sm:p-6 md:p-8 box-border font-display overflow-hidden flex flex-col relative group"
    >
      {/* Fullscreen button positioned within the preview card */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-short">
         <FullScreenButton targetRef={previewRef} />
      </div>

      <h2 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-primary mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-tight break-words">
        {presentationData.title || "Untitled Presentation"}
      </h2>
      
      <div className="flex-grow overflow-hidden relative">
        {RendererComponent ? (
          <RendererComponent content={currentSlide.content as SlideContent} />
        ) : (
          <UnknownPatternRenderer patternType={currentSlide.pattern_type} />
        )}
      </div>
       {presentationData.description && (
         <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-text-secondary border-t border-border pt-2 sm:pt-3 line-clamp-2">
           {presentationData.description}
         </p>
       )}
    </div>
  );
};
