import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType; // Allows rendering as a different HTML element, e.g., 'section'
  // Add padding props if you want to control padding from outside
  // e.g. padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({ children, className, as: Component = 'div', ...props }) => {
  return (
    <Component
      className={`bg-surface border border-border rounded-lg shadow-default p-4 sm:p-6 ${className || ''}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// Optional: CardHeader, CardContent, CardFooter components for more structure

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className }) => {
  return (
    <div className={`pb-4 border-b border-border mb-4 ${className || ''}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }> = ({ children, className, as: Component = 'h3' }) => {
    return (
      <Component className={`text-xl font-semibold text-text-primary ${className || ''}`}>
        {children}
      </Component>
    );
};


export const CardContent: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className }) => {
  return (
    <div className={`${className || ''}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className }) => {
  return (
    <div className={`pt-4 border-t border-border mt-4 ${className || ''}`}>
      {children}
    </div>
  );
};
