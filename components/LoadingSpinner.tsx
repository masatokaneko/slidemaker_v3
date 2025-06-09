import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({ size = 'md', text = "Loading..." }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className={`animate-spin rounded-full border-t-transparent border-b-transparent border-l-primary border-r-primary ${sizeClasses[size]}`}></div>
      {text && <p className="mt-3 text-sm text-text-secondary">{text}</p>}
    </div>
  );
};
