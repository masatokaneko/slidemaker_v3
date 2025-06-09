import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeName } from '../../types';
import { Sun, Moon, Contrast } from 'lucide-react'; //Icons for themes
import { Button } from './Button';


const themeIcons: Record<ThemeName, React.ReactNode> = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    'high-contrast': <Contrast size={18} />
};

const themeDisplayNames: Record<ThemeName, string> = {
    light: "Light",
    dark: "Dark",
    'high-contrast': "High Contrast"
};

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex items-center space-x-2 p-2 bg-surface rounded-lg shadow-sm">
      <span className="text-sm font-medium text-text-secondary mr-2">Theme:</span>
      <div className="flex rounded-md overflow-hidden border border-border">
        {availableThemes.map((themeName) => (
          <Button
            key={themeName}
            onClick={() => setTheme(themeName)}
            variant={theme.name === themeName ? 'primary' : 'ghost'}
            size="sm"
            className={`px-3 py-1.5 
                        ${theme.name === themeName ? '' : 'text-text-secondary hover:bg-surface-alt'}
                        ${themeName === 'light' ? 'rounded-l-md' : ''}
                        ${themeName === availableThemes[availableThemes.length-1] ? 'rounded-r-md border-r-0' : 'border-r border-border'}
                        flex items-center space-x-1.5 focus:z-10 focus:ring-2 focus:ring-primary focus:ring-offset-0`}
            aria-pressed={theme.name === themeName}
            title={`Switch to ${themeDisplayNames[themeName]} theme`}
          >
            {themeIcons[themeName]}
            <span className="hidden sm:inline">{themeDisplayNames[themeName]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
