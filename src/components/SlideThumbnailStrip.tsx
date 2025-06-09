import React from 'react';
import type { PresentationData, Slide } from '../types';
import { Card } from './ui/Card'; // Using Card for consistent styling

interface SlideThumbnailStripProps {
  presentationData: PresentationData | null;
  currentSlideIndex: number;
  onThumbnailClick: (index: number) => void;
  className?: string;
}

export const SlideThumbnailStrip: React.FC<SlideThumbnailStripProps> = ({
  presentationData,
  currentSlideIndex,
  onThumbnailClick,
  className,
}) => {
  if (!presentationData || !presentationData.slides || presentationData.slides.length <= 1) {
    return null; // Don't show if no data, or only one slide
  }

  return (
    <Card 
        className={`w-full p-2 bg-surface-alt border-t border-border ${className || ''}`}
        // style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--theme-primary) var(--theme-surface-alt)' }}
    >
      <div className="flex space-x-2 overflow-x-auto pb-1.5">
        {presentationData.slides.map((slide, index) => (
          <button
            key={slide.slide_id || index}
            onClick={() => onThumbnailClick(index)}
            className={`flex-shrink-0 w-28 h-20 p-1.5 rounded-md border-2 transition-all duration-short
                        bg-surface shadow-sm hover:border-primary
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface-alt
                        ${currentSlideIndex === index ? 'border-primary ring-2 ring-primary ring-offset-1 ring-offset-surface-alt' : 'border-border'}`}
            aria-current={currentSlideIndex === index ? 'true' : 'false'}
            title={`Go to slide ${index + 1}: ${presentationData.title} - Slide ${index + 1}`}
          >
            <div className="w-full h-full bg-background rounded-sm flex flex-col items-center justify-center text-xs text-text-secondary overflow-hidden">
              <span className="font-medium text-text-primary">{`Slide ${index + 1}`}</span>
              <span className="text-center line-clamp-2 px-1">
                 {slide.pattern_type.replace(/_/g, ' ')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
