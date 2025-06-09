import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-short interactive-scale";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-text-on-primary hover:bg-primary-variant shadow-sm",
  secondary: "bg-secondary text-text-on-secondary hover:bg-secondary-variant shadow-sm",
  danger: "bg-error text-white hover:bg-opacity-80 shadow-sm",
  ghost: "text-primary hover:bg-primary hover:text-text-on-primary",
  outline: "border border-primary text-primary hover:bg-primary hover:text-text-on-primary",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const loadingSpinner = (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? loadingSpinner : leftIcon}
      {isLoading ? <span className="ml-2">Loading...</span> : <span className={leftIcon && !isLoading ? 'ml-2' : rightIcon && !isLoading ? 'mr-2' : ''}>{children}</span>}
      {!isLoading && rightIcon}
    </button>
  );
};
