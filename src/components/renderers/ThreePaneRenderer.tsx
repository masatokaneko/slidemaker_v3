import React from 'react';
import type { ThreePaneParallelContent, ThreePaneParallelPane } from '../../types';
import type { RendererProps } from './BaseRenderer'; 
import { Columns } from 'lucide-react';

const PaneItem: React.FC<{ item: string }> = ({ item }) => (
  <li className="relative pl-5 line-clamp-3">
    <span className="absolute left-0 top-1 text-primary font-bold text-sm">•</span>
    {item}
  </li>
);

const ParallelPane: React.FC<{ pane: ThreePaneParallelPane, isLast?: boolean }> = ({ pane }) => (
  <div className="flex-1 flex flex-col p-3 sm:p-3.5 border border-border rounded-md bg-surface-alt min-w-0">
    <h4 className="text-sm sm:text-base font-medium text-text-primary mb-2 line-clamp-2">
      {pane.pane_title}
    </h4>
    <ul className="space-y-1.5 text-xs sm:text-sm text-text-secondary list-none p-0 flex-grow">
      {pane.content.map((item, index) => (
        <PaneItem key={index} item={item} />
      ))}
      {pane.content.length === 0 && <li className="text-text-disabled italic">No content.</li>}
    </ul>
  </div>
);

export const ThreePaneRenderer: React.FC<RendererProps<ThreePaneParallelContent>> = ({ content }) => {
  return (
    <div className="flex flex-col flex-grow h-full justify-between text-text-primary">
      {/* Main Title */}
      {content.main_title && (
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2.5 sm:mb-3 line-clamp-2">
          {content.main_title}
        </h3>
      )}

      {/* Panes Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 flex-grow overflow-hidden mb-2.5 sm:mb-3">
        {content.panes.map((pane, index) => (
          <ParallelPane key={index} pane={pane} isLast={index === content.panes.length -1} />
        ))}
      </div>

      {/* Summary Section */}
      {content.summary && (
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-border text-center">
           <div className="flex justify-center items-center text-secondary mb-1 sm:mb-1.5">
             <Columns size={16} className="mr-1.5 opacity-80" />
            <span className="text-sm font-medium">Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary italic line-clamp-3">
            {content.summary}
          </p>
        </div>
      )}
    </div>
  );
};
