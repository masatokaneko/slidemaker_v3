import React from 'react';
import type { TwoPaneComparisonContent } from '../../types'; // Corrected import path
import type { RendererProps } from '../renderers/BaseRenderer'; // Use RendererProps
import { GitCompareArrows } from 'lucide-react'; 

interface PaneProps {
  title: string; 
  items: string[]; 
  className?: string;
}

const Pane: React.FC<PaneProps> = ({ title, items, className }) => (
  <div className={`flex-1 flex flex-col ${className || ''}`}>
    <h3 className="text-base sm:text-lg md:text-xl font-medium text-text-primary mb-2 sm:mb-3 line-clamp-2 leading-snug">
      {title}
    </h3>
    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-text-secondary list-none p-0 flex-grow">
      {items.map((item, index) => (
        <li key={index} className="relative pl-5 sm:pl-6 line-clamp-3">
          <span className="absolute left-0 top-1 text-primary font-bold text-sm sm:text-base">•</span>
          {item}
        </li>
      ))}
      {items.length === 0 && <li className="text-text-disabled italic">No content.</li>}
    </ul>
  </div>
);

// Using RendererProps with the specific content type
export const TwoPaneRenderer: React.FC<RendererProps<TwoPaneComparisonContent>> = ({ content }) => {
  return (
    <div className="flex flex-col flex-grow h-full justify-between">
      <div className="flex flex-row gap-4 sm:gap-5 md:gap-6 flex-grow overflow-hidden">
        <Pane title={content.left_pane.pane_title} items={content.left_pane.content} />
        <Pane title={content.right_pane.pane_title} items={content.right_pane.content} className="border-l border-border pl-4 sm:pl-5 md:pl-6" />
      </div>
      
      {content.comparison && (
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border text-center">
          <div className="flex justify-center items-center text-secondary mb-1 sm:mb-1.5">
            <GitCompareArrows size={18} className="mr-1.5 opacity-80" />
            <span className="text-sm font-medium">Comparison</span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary italic line-clamp-3">
            {content.comparison}
          </p>
        </div>
      )}
    </div>
  );
};
