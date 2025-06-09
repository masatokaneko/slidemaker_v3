import React from 'react';
import { LinearProcessContent, LinearProcessStep } from '../types';
import { SlideRendererProps } from './BaseRenderer';

const LinearProcessRenderer: React.FC<SlideRendererProps<LinearProcessContent>> = ({ content }) => {
  const { process_title, steps, conclusion } = content;

  return (
    <div className="linear-process-layout flex flex-col h-full gap-4">
      {process_title && (
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-2">{process_title}</h2>
      )}
      <div className="flex-grow space-y-4 overflow-y-auto pr-2">
        {steps.map((step: LinearProcessStep, index: number) => (
          <div key={index} className="process-step flex items-start gap-4 p-4 bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-500 rounded-r-lg shadow">
            <div className="step-number min-w-[32px] h-8 w-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full text-sm">
              {step.step_number}
            </div>
            <div className="flex-1">
              <h3 className="step-title text-lg font-semibold text-blue-700 dark:text-blue-300 mb-1">
                {step.step_title}
              </h3>
              <p className="description text-sm text-gray-700 dark:text-gray-300 mb-2">
                {step.description}
              </p>
              {step.details && step.details.length > 0 && (
                <ul className="details list-disc list-inside pl-1 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
         {steps.length === 0 && <p className="text-gray-400 italic text-center">No process steps defined.</p>}
      </div>
      {conclusion && (
        <div className="conclusion-section text-center mt-4 p-3 bg-green-50 dark:bg-slate-700 rounded-lg border border-green-200 dark:border-slate-600 shadow">
          <h4 className="text-md font-semibold text-green-800 dark:text-green-300 mb-1">結論</h4>
          <p className="text-sm text-green-700 dark:text-green-200 italic">
            {conclusion}
          </p>
        </div>
      )}
    </div>
  );
};

export default LinearProcessRenderer;