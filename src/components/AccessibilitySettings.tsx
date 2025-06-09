import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Settings, ZapOff, Zap } from 'lucide-react';

export const AccessibilitySettings: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      // This is just for UI state; actual reduction is handled by themes.css
      // For a more robust solution, this might set a class on <body>
      // or store a preference in localStorage if CSS doesn't handle it dynamically.
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleReducedMotion = () => {
    // This is a conceptual toggle. The actual `prefers-reduced-motion` is a system setting.
    // This button would ideally link to system settings or explain how to change it.
    // For demo, we'll just log it.
    console.log("Reduced motion is a system setting. This button is illustrative.");
    alert("Reduced motion is typically a system-level accessibility setting in your OS or browser.");
  };
  
  // In a real app, you might add options for font size, etc.
  // For now, this component is mostly illustrative of where such settings could go.

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings size={22} className="mr-2 text-primary" />
          Accessibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Motion Preference:
            <strong className="ml-1 text-text-primary">
              {reducedMotion ? "Reduce Motion" : "Default Motion"}
            </strong>
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleReducedMotion}
            leftIcon={reducedMotion ? <ZapOff size={16}/> : <Zap size={16} />}
          >
            {reducedMotion ? "Suggest Full Motion" : "Suggest Reduce Motion"}
          </Button>
        </div>
        <p className="text-xs text-text-disabled">
            The application respects your system's motion preferences. 
            You can usually change this in your operating system or browser accessibility settings.
        </p>
      </CardContent>
    </Card>
  );
};
