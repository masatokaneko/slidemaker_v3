import React from 'react';
import { ThreePaneParallelContent, ThreePaneParallelSinglePane } from '../types';
import { SlideRendererProps } from './BaseRenderer';

const ThreePaneParallelRenderer: React.FC<SlideRendererProps<ThreePaneParallelContent>> = ({ content }) => {
  const { main_title, panes, summary } = content;

  const renderPane = (pane: ThreePaneParallelSinglePane, index: number) => {
    const colors = [
        { bg: 'bg-sky-50 dark:bg-slate-700', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-slate-600', bullet: 'bg-sky-500' },
        { bg: 'bg-indigo-50 dark:bg-slate-700', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-slate-600', bullet: 'bg-indigo-500' },
        { bg: 'bg-purple-50 dark:bg-slate-700', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-slate-600', bullet: 'bg-purple-500' },
    ];
    const color = colors[index % colors.length];

    return (
        <div key={index} className={`pane-container flex flex-col p-4 ${color.bg} rounded-lg shadow`}>
            <h3 className={`pane-title text-lg font-semibold ${color.text} mb-3 border-b-2 ${color.border} pb-2`}>
                {pane.pane_title}
            </h3>
            <ul className="slide-content list-none p-0 space-y-2 text-gray-700 dark:text-gray-300 text-sm flex-grow">
                {pane.content.map((item, itemIndex) => (
                <li key={itemIndex} className="relative pl-5">
                    <span className={`absolute left-0 top-1 w-2.5 h-2.5 ${color.bullet} rounded-full`}></span>
                    {item}
                </li>
                ))}
                {pane.content.length === 0 && <li className="text-gray-400 italic">No content points.</li>}
            </ul>
        </div>
    );
  }

  return (
    <div className="three-pane-layout flex flex-col h-full gap-4">
      {main_title && (
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-2">{main_title}</h2>
      )}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 flex-grow">
        {panes.map((pane, index) => renderPane(pane, index))}
      </div>
      {summary && (
        <div className="summary-section text-center mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 shadow">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-1">概要</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreePaneParallelRenderer;