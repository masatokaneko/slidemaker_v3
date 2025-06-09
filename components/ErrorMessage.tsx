import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { IconButton } from '../components/ui/IconButton'; // Using IconButton for close

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, className }) => {
  if (!message) return null;

  return (
    <div 
      className={`mt-4 p-3 sm:p-4 bg-error/10 border border-error/30 text-error rounded-md relative flex items-start shadow-sm ${className || ''}`} 
      role="alert"
    >
      <AlertTriangle size={20} className="mr-2 sm:mr-3 text-error flex-shrink-0 mt-0.5" />
      <span className="block sm:inline flex-grow text-sm">{message}</span>
      {onClose && (
        <IconButton
          icon={<X size={18} />}
          label="Close error message"
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="ml-2 -mr-1 -mt-1 !text-error hover:!bg-error/20" // Overriding some IconButton styles for specific error context
        />
      )}
    </div>
  );
};
