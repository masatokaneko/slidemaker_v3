import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ApiKeyBanner: React.FC = () => {
  return (
    <div 
      className="w-full max-w-5xl mb-6 p-4 bg-warning/10 border-l-4 border-warning text-warning-darker rounded-md shadow-sm" 
      role="alert"
      // Using a conceptual 'warning-darker' or relying on text-warning to have enough contrast.
      // Direct text color might need adjustment based on theme if text-warning is too light on warning/10 bg.
      // For now, assuming 'text-warning' is fine, or a darker shade of it would be defined in themes.css
      // e.g. body.theme-light { --theme-text-warning-emphasis: #c58300; }
      // then use className="... text-[var(--theme-text-warning-emphasis)]"
      // For simplicity, let's use text-text-primary for body, and text-warning for icon/border.
    >
      <div className="flex">
        <div className="py-1">
          <AlertTriangle className="h-6 w-6 text-warning mr-3" />
        </div>
        <div className="text-text-primary"> {/* Main text uses primary text color for readability */}
          <p className="font-bold text-warning">API Key Missing</p> {/* Title can be warning color */}
          <p className="text-sm text-text-secondary">
            The VITE_GEMINI_API_KEY environment variable is not set. 
            This application requires a valid Gemini API key to function. 
            Please ensure it's configured in your environment.
          </p>
        </div>
      </div>
    </div>
  );
};
