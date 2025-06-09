
import React from 'react';
import { TwoPaneComparisonContent } from '../../types';

interface TwoPaneComparisonRendererProps {
  content: TwoPaneComparisonContent;
}

const TwoPaneComparisonRenderer: React.FC<TwoPaneComparisonRendererProps> = ({ content }) => {
  const { left_pane, right_pane, comparison } = content;

  // Helper to render pane content
  const renderPane = (pane: { pane_title: string; content: string[] }, side: 'left' | 'right') => (
    <div className={`pane flex-1 p-4 ${side === 'left' ? 'bg-blue-50' : 'bg-green-50'} rounded-lg flex flex-col`}>
      <h3 className="pane-title text-xl font-semibold text-gray-700 mb-3 border-b-2 border-gray-300 pb-2">
        {pane.pane_title}
      </h3>
      <ul className="slide-content list-none p-0 space-y-2 text-gray-600 text-sm flex-grow">
        {pane.content.map((item, index) => (
          <li key={index} className="relative pl-5">
            <span className={`absolute left-0 top-1 w-2.5 h-2.5 ${side === 'left' ? 'bg-blue-500' : 'bg-green-500'} rounded-full`}></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="two-pane-layout flex flex-col md:flex-row gap-6 h-full">
      {/* Panes */}
      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        {renderPane(left_pane, 'left')}
        {renderPane(right_pane, 'right')}
      </div>

      {/* Comparison Section */}
      {comparison && (
        <div className="comparison-section text-center mt-4 md:mt-0 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          {/* <div className="comparison-arrow text-2xl text-red-500 mb-1">▼</div> */}
          <h4 className="text-md font-semibold text-yellow-800 mb-1">比較のポイント</h4>
          <p className="comparison-text text-sm text-yellow-700 italic">
            {comparison}
          </p>
        </div>
      )}
    </div>
  );
};

export default TwoPaneComparisonRenderer;
