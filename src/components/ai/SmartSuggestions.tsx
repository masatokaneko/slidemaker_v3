
import React from 'react';
import type { AISuggestion } from '../../types';
import { Lightbulb, Check, X as CloseIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';

interface SmartSuggestionsProps {
  suggestions: AISuggestion[];
  isLoading?: boolean;
  onAcceptSuggestion?: (suggestion: AISuggestion) => void; // Placeholder for future action
  onDismissSuggestion?: (suggestionId: string) => void;
  className?: string;
  title?: string;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  suggestions,
  isLoading,
  onAcceptSuggestion,
  onDismissSuggestion,
  className,
  title = "AI Suggestions"
}) => {
  if (isLoading) {
    return (
      <Card className={`mt-4 ${className || ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Lightbulb size={18} className="mr-2 text-accent" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-sm">Loading suggestions...</p>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null; // Don't render if no suggestions
  }

  return (
    <Card className={`mt-6 ${className || ''} shadow-lg`}>
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Lightbulb size={20} className="mr-2 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-3 bg-surface-alt rounded-md border border-border relative group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-primary capitalize mb-0.5">
                        {suggestion.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-text-primary mb-1">{suggestion.description}</p>
                    {suggestion.suggestedText && suggestion.type !== 'alt_text' && (
                         <p className="text-xs text-text-secondary mt-1 p-2 bg-background border border-border rounded">
                            <strong>Suggestion:</strong> <span className="italic">{suggestion.suggestedText}</span>
                         </p>
                    )}
                     {suggestion.type === 'alt_text' && suggestion.suggestedText && (
                         <p className="text-xs text-text-secondary mt-1 p-2 bg-background border border-border rounded">
                            <strong>Suggested Alt Text:</strong> <span className="font-mono text-sm">{suggestion.suggestedText}</span>
                         </p>
                    )}
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex space-x-1">
                    {onAcceptSuggestion && (
                        <IconButton
                        icon={<Check size={16} />}
                        label="Accept Suggestion"
                        onClick={() => onAcceptSuggestion(suggestion)}
                        variant="ghost"
                        size="sm"
                        className="!text-success hover:!bg-success/10"
                        />
                    )}
                    {onDismissSuggestion && (
                        <IconButton
                        icon={<CloseIcon size={16} />}
                        label="Dismiss Suggestion"
                        onClick={() => onDismissSuggestion(suggestion.id)}
                        variant="ghost"
                        size="sm"
                        className="!text-error hover:!bg-error/10"
                        />
                    )}
                </div>

            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
