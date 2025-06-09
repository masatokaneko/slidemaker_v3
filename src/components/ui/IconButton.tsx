import React from 'react';
import type { ButtonProps } from './Button'; // Re-use parts of ButtonProps if needed
import { Tooltip } from './Tooltip'; // Assuming a Tooltip component will be created or imported

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  label: string; // For accessibility (aria-label) and tooltip
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const baseIconStyles = "inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-short interactive-scale";

const iconVariantStyles = {
  primary: "bg-primary text-text-on-primary hover:bg-primary-variant",
  secondary: "bg-secondary text-text-on-secondary hover:bg-secondary-variant",
  ghost: "text-text-secondary hover:bg-surface-alt hover:text-primary",
  danger: "bg-error text-white hover:bg-opacity-80",
  outline: "border border-border text-text-secondary hover:bg-surface-alt hover:text-primary",
};

const iconSizeStyles = {
  sm: "p-1.5", // For icon size ~16px (lucide default is 24)
  md: "p-2",   // For icon size ~20-24px
  lg: "p-2.5", // For icon size ~28px
};

const loadingSpinner = (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  className,
  tooltipPosition = 'top',
  ...props
}) => {
  const buttonContent = isLoading ? loadingSpinner : icon;

  const buttonElement = (
     <button
        type="button"
        aria-label={label}
        className={`${baseIconStyles} ${iconVariantStyles[variant]} ${iconSizeStyles[size]} ${className || ''}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {buttonContent}
      </button>
  );

  // Simple tooltip display for now. In a real scenario, use a proper Tooltip component.
  return (
    <div className="relative group">
      {buttonElement}
      {!isLoading && (
        <div 
          className="absolute z-10 px-2 py-1 text-xs text-text-on-primary bg-text-primary rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-short pointer-events-none
                     bottom-full mb-1.5 left-1/2 -translate-x-1/2" // Default top
          // Add more classes for other tooltip positions if needed
        >
          {label}
        </div>
      )}
    </div>
  );
};

// A basic Tooltip component structure that IconButton might use
// This is a very simplified version for demonstration.
// In a real app, you'd use a more robust Tooltip component.
const SimpleTooltip: React.FC<{text: string, children: React.ReactElement, position?: string}> = ({ text, children}) => {
    return (
        <div className="relative group inline-block">
            {children}
            <span className={`absolute z-20 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-short pointer-events-none
                              bg-text-primary text-text-on-primary text-xs rounded-md px-2 py-1 shadow-lg
                              bottom-full left-1/2 -translate-x-1/2 mb-1.5 `}> {/* Default top */}
                {text}
            </span>
        </div>
    )
}
