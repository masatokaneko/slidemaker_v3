
import { useState, useCallback } from 'react';
import { AdvancedAIEngine } from '../services/ai/AdvancedAIEngine';
import type { PresentationData, AISuggestion, ApiResponse } from '../types';

export interface AdvancedAIState {
  processedImage: File | null;
  isProcessingImage: boolean;
  imageProcessingError: string | null;
  
  isGeneratingFromImage: boolean;
  generationFromImageError: string | null;
  
  altText: string | null;
  isGeneratingAltText: boolean;
  altTextError: string | null;

  suggestions: AISuggestion[];
  isFetchingSuggestions: boolean;
  suggestionsError: string | null;
}

export const useAdvancedAI = () => {
  const [processedImageFile, setProcessedImageFile] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false); // Note: actual processing happens in service
  const [imageProcessingError, setImageProcessingError] = useState<string | null>(null);
  
  const [isGeneratingFromImage, setIsGeneratingFromImage] = useState(false);
  const [generationFromImageError, setGenerationFromImageError] = useState<string | null>(null);

  const [altText, setAltText] = useState<string | null>(null);
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [altTextError, setAltTextError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const clearImageState = useCallback(() => {
    setProcessedImageFile(null);
    setImageProcessingError(null);
    setAltText(null);
    setAltTextError(null);
    setGenerationFromImageError(null);
  }, []);
  
  const clearSuggestionsState = useCallback(() => {
    setSuggestions([]);
    setSuggestionsError(null);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    clearImageState();
    setIsProcessingImage(true); // Indicates an image has been selected and is ready
    // Actual processing to base64 happens when an action is taken with the image.
    // Here, we just store the file and can do preliminary checks if needed.
    const MAX_IMAGE_SIZE_MB = 4;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setImageProcessingError(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`);
        setProcessedImageFile(null);
        setIsProcessingImage(false);
        return;
    }
    setProcessedImageFile(file);
    setIsProcessingImage(false); // Ready for use
  }, [clearImageState]);

  const generateSlideFromImage = useCallback(async (objective: string): Promise<ApiResponse<PresentationData>> => {
    if (!processedImageFile) {
      setGenerationFromImageError("No image selected for generation.");
      return { success: false, error: { message: "No image selected.", userMessage: "Please upload an image first." } };
    }
    setIsGeneratingFromImage(true);
    setGenerationFromImageError(null);
    
    const response = await AdvancedAIEngine.generateSlideFromImageAndObjective(processedImageFile, objective);
    
    if (!response.success) {
      setGenerationFromImageError(response.error?.userMessage || "Failed to generate slide from image.");
    }
    setIsGeneratingFromImage(false);
    return response;
  }, [processedImageFile]);

  const generateAltTextForImage = useCallback(async () => {
    if (!processedImageFile) {
      setAltTextError("No image selected for alt text generation.");
      return;
    }
    setIsGeneratingAltText(true);
    setAltText(null);
    setAltTextError(null);
    
    const response = await AdvancedAIEngine.generateAltText(processedImageFile);
    
    if (response.success && response.data) {
      setAltText(response.data);
    } else {
      setAltTextError(response.error?.userMessage || "Failed to generate alt text.");
    }
    setIsGeneratingAltText(false);
  }, [processedImageFile]);

  const fetchSuggestionsForContent = useCallback(async (textContent: string) => {
    if (!textContent.trim()) {
      setSuggestions([]);
      setSuggestionsError(null);
      return;
    }
    setIsFetchingSuggestions(true);
    setSuggestions([]);
    setSuggestionsError(null);

    const response = await AdvancedAIEngine.getSuggestionsForContent(textContent);

    if (response.success && response.data) {
      setSuggestions(response.data);
    } else {
      setSuggestionsError(response.error?.userMessage || "Failed to fetch suggestions.");
    }
    setIsFetchingSuggestions(false);
  }, []);
  
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  return {
    // Image related state and functions
    processedImageFile,
    isProcessingImage,
    imageProcessingError,
    handleImageUpload,
    clearImageState,

    // Generation from image
    isGeneratingFromImage,
    generationFromImageError,
    generateSlideFromImage,

    // Alt text related state and functions
    altText,
    isGeneratingAltText,
    altTextError,
    generateAltTextForImage,

    // Suggestions related state and functions
    suggestions,
    isFetchingSuggestions,
    suggestionsError,
    fetchSuggestionsForContent,
    dismissSuggestion,
    clearSuggestionsState,
  };
};
