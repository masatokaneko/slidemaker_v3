
import React from 'react';
import { BarChart, Activity, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useSlideGenerator } from '../../hooks/useSlideGenerator'; // To get basic usage stats

export const AIInsightsDashboard: React.FC = () => {
  const { usage } = useSlideGenerator(); // Get basic usage from existing hook

  // Placeholder data for more advanced insights that would typically come from a backend
  const placeholderData = {
    averageGenerationTime: 7.5, // seconds
    commonPatternsUsed: ['2pane_comparison', 'linear_process'],
    contentQualityScore: 85, // out of 100
  };

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Brain size={22} className="mr-2 text-primary" />
          AI Insights & Analytics (Demo)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-surface-alt">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary flex items-center">
                <Activity size={16} className="mr-2" /> Session Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-text-primary">
                {usage?.requestsThisSession || 0} <span className="text-sm font-normal">requests</span>
              </p>
              <p className="text-xs text-text-disabled">
                (Tokens: {usage?.tokensUsedThisSession || 0} - Placeholder)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-surface-alt">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary flex items-center">
                <BarChart size={16} className="mr-2" /> Avg. Gen Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-text-primary">
                {placeholderData.averageGenerationTime.toFixed(1)} <span className="text-sm font-normal">sec</span>
              </p>
              <p className="text-xs text-text-disabled">(Mock Data)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-surface-alt">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary flex items-center">
                 <Brain size={16} className="mr-2" /> Content Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-text-primary">
                {placeholderData.contentQualityScore}%
              </p>
              <p className="text-xs text-text-disabled">(Mock AI Assessment)</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4">
            <h4 className="text-md font-medium text-text-secondary mb-2">Commonly Used Patterns:</h4>
            {placeholderData.commonPatternsUsed.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {placeholderData.commonPatternsUsed.map(pattern => (
                        <span key={pattern} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {pattern.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            ): (
                <p className="text-sm text-text-disabled">No pattern usage data yet (Mock).</p>
            )}
        </div>
        <p className="text-xs text-text-disabled mt-4 text-center">
          Advanced analytics and insights would typically require a backend data processing pipeline. This is a simplified client-side demonstration.
        </p>
      </CardContent>
    </Card>
  );
};
