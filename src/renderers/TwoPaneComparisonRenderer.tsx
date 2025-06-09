import React from 'react';
import { TwoPaneComparisonContent, PaneContent } from '../types';
import { SlideRendererProps } from './BaseRenderer';

const TwoPaneComparisonRenderer: React.FC<SlideRendererProps<TwoPaneComparisonContent>> = ({ content }) => {
  const { left_pane, right_pane, comparison } = content;

  const renderPane = (pane: PaneContent, side: 'left' | 'right') => (
    <div className={`pane flex-1 p-4 ${side === 'left' ? 'bg-blue-50 dark:bg-slate-700' : 'bg-green-50 dark:bg-slate-700'} rounded-lg flex flex-col shadow`}>
      <h3 className={`pane-title text-xl font-semibold ${side === 'left' ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'} mb-3 border-b-2 ${side === 'left' ? 'border-blue-200 dark:border-slate-600' : 'border-green-200 dark:border-slate-600'} pb-2`}>
        {pane.pane_title}
      </h3>
      <ul className="slide-content list-none p-0 space-y-2 text-gray-700 dark:text-gray-300 text-sm flex-grow">
        {pane.content.map((item, index) => (
          <li key={index} className="relative pl-5">
            <span className={`absolute left-0 top-1 w-2.5 h-2.5 ${side === 'left' ? 'bg-blue-500' : 'bg-green-500'} rounded-full`}></span>
            {item}
          </li>
        ))}
        {pane.content.length === 0 && <li className="text-gray-400 italic">No content points.</li>}
      </ul>
    </div>
  );

  return (
    <div className="two-pane-layout flex flex-col md:flex-row gap-4 md:gap-6 h-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-grow">
        {renderPane(left_pane, 'left')}
        {renderPane(right_pane, 'right')}
      </div>

      {comparison && (
        <div className="comparison-section text-center mt-4 md:mt-2 p-3 bg-yellow-50 dark:bg-slate-700 rounded-lg border border-yellow-200 dark:border-slate-600 shadow">
          <h4 className="text-md font-semibold text-yellow-800 dark:text-yellow-300 mb-1">比較のポイント</h4>
          <p className="comparison-text text-sm text-yellow-700 dark:text-yellow-200 italic">
            {comparison}
          </p>
        </div>
      )}
    </div>
  );
};

export default TwoPaneComparisonRenderer;