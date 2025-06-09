import React from 'react';
import type { LinearProcessContent, LinearProcessStep } from '../../types';
import type { RendererProps } from './BaseRenderer';
import { TrendingUp, CheckCircle } from 'lucide-react';

const ProcessStepItem: React.FC<{ step: LinearProcessStep }> = ({ step }) => (
  <div className="flex items-start gap-3 sm:gap-3.5 p-3 sm:p-3.5 border-l-4 border-primary bg-primary/5 hover:bg-primary/10 rounded-r-md transition-colors duration-short">
    <div className="flex-shrink-0 mt-0.5 min-w-[28px] h-7 sm:min-w-[30px] sm:h-[30px] rounded-full bg-primary text-text-on-primary flex items-center justify-center font-bold text-sm">
      {step.step_number}
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="text-sm sm:text-base font-medium text-primary mb-0.5 line-clamp-2">
        {step.step_title}
      </h4>
      <p className="text-xs sm:text-sm text-text-secondary mb-1 line-clamp-3">
        {step.description}
      </p>
      {step.details && step.details.length > 0 && (
        <ul className="space-y-0.5 text-xs text-text-secondary list-none p-0 pl-3 border-l-2 border-border">
          {step.details.map((detail, index) => (
            <li key={index} className="relative line-clamp-2">
              <span className="absolute -left-2.5 top-1.5 h-1 w-1 bg-text-disabled rounded-full"></span>
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export const LinearProcessRenderer: React.FC<RendererProps<LinearProcessContent>> = ({ content }) => {
  return (
    <div className="flex flex-col flex-grow h-full justify-between text-text-primary">
      {/* Process Title */}
      {content.process_title && (
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2.5 sm:mb-3 line-clamp-2 flex items-center">
          <TrendingUp size={22} className="inline mr-2 align-middle opacity-80" />
          {content.process_title}
        </h3>
      )}

      {/* Steps Layout */}
      <div className="flex flex-col gap-2.5 sm:gap-3 flex-grow overflow-y-auto mb-2.5 sm:mb-3 pr-0.5 custom-scrollbar">
        {content.steps.map((step) => (
          <ProcessStepItem key={step.step_number} step={step} />
        ))}
        {content.steps.length === 0 && <p className="text-text-disabled italic">No steps defined.</p>}
      </div>

      {/* Conclusion Section */}
      {content.conclusion && (
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-border text-center">
           <div className="flex justify-center items-center text-success mb-1 sm:mb-1.5">
            <CheckCircle size={16} className="mr-1.5 opacity-80" />
            <span className="text-sm font-medium">Conclusion</span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary italic line-clamp-3">
            {content.conclusion}
          </p>
        </div>
      )}
    </div>
  );
};
