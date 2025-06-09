import React, { useState, useEffect, useCallback } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { IconButton } from './ui/IconButton';

interface FullScreenButtonProps {
  targetRef?: React.RefObject<HTMLElement>; // Optional: target specific element, otherwise documentElement
  onToggle?: (isFullScreen: boolean) => void;
  className?: string;
}

export const FullScreenButton: React.FC<FullScreenButtonProps> = ({ targetRef, onToggle, className }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getTargetElement = useCallback(() => {
    return targetRef?.current || document.documentElement;
  }, [targetRef]);

  const handleFullScreenChange = useCallback(() => {
    const fullscreenElement = document.fullscreenElement || 
                              (document as any).webkitFullscreenElement || 
                              (document as any).mozFullScreenElement ||
                              (document as any).msFullscreenElement;
    const newIsFullScreen = !!fullscreenElement && (fullscreenElement === getTargetElement() || getTargetElement() === document.documentElement && fullscreenElement === document.documentElement);
    setIsFullScreen(newIsFullScreen);
    if (onToggle) {
      onToggle(newIsFullScreen);
    }
  }, [onToggle, getTargetElement]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, [handleFullScreenChange]);

  const toggleFullScreen = async () => {
    const element = getTargetElement();
    if (!element) return;

    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).mozFullScreenElement && !(document as any).msFullscreenElement) {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
      // Fallback: update state based on a quick check if error occurred during request
      setTimeout(handleFullScreenChange, 50); 
    }
  };
  
  const isFullscreenSupported = !!(document.documentElement.requestFullscreen || 
                                   (document.documentElement as any).webkitRequestFullscreen || 
                                   (document.documentElement as any).mozRequestFullScreen ||
                                   (document.documentElement as any).msRequestFullscreen);

  if (!isFullscreenSupported) {
    return null; // Don't render button if fullscreen API is not supported
  }

  return (
    <IconButton
      icon={isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
      label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      onClick={toggleFullScreen}
      variant="ghost"
      size="md"
      className={className}
    />
  );
};
