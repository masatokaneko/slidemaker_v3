
import { useState, useCallback } from 'react';
import { yamlGeneratorService } from '../services/yamlGeneratorService';
import { sanitizeInput } from '../utils/validation';
import type { PresentationData, ApiError, UsageMetrics, ApiResponse } from '../types';
import { dump as yamlDump } from 'js-yaml';


export const useSlideGenerator = () => {
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [yamlOutput, setYamlOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageMetrics | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateSlides = useCallback(async (promptText: string): Promise<ApiResponse<PresentationData> | undefined> => {
    setIsLoading(true);
    setError(null);
    setPresentationData(null);
    setYamlOutput(null);

    const sanitizedPrompt = sanitizeInput(promptText);
    if (!sanitizedPrompt) {
      setError("Input prompt cannot be empty.");
      setIsLoading(false);
      return { success: false, error: { message: "Input prompt cannot be empty.", userMessage: "Input prompt cannot be empty."}};
    }
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        setError("Gemini API key (VITE_GEMINI_API_KEY) is not configured in the environment.");
        setIsLoading(false);
        return { success: false, error: { message: "API key not configured.", userMessage: "API key not configured."}};
    }

    const response = await yamlGeneratorService.generatePresentationYaml(sanitizedPrompt) as 
      (typeof yamlGeneratorService.generatePresentationYaml extends (...args: any[]) => Promise<infer R> ? R & { rawYaml?: string } : never);


    if (response.success && response.data) {
      setPresentationData(response.data);
      
      if (response.rawYaml) {
        setYamlOutput(response.rawYaml);
      } else {
        try {
          setYamlOutput(yamlDump(response.data));
        } catch (e) {
            console.error("Failed to re-serialize YAML for display:", e);
            setYamlOutput("Successfully generated, but could not display raw YAML.");
        }
      }

    } else {
      setError(response.error?.userMessage || "An unknown error occurred during slide generation.");
      setPresentationData(null);
      if (response.rawYaml) { 
        setYamlOutput(response.rawYaml);
      } else {
        setYamlOutput(null);
      }
    }
    
    if(response.usage) {
        setUsage(response.usage);
    }

    setIsLoading(false);
    return response;
  }, []);

  return {
    presentationData,
    setPresentationData, // Expose setter
    yamlOutput,
    setYamlOutput, // Expose setter
    isLoading,
    error,
    setError, // Expose setter
    usage,
    generateSlides,
    clearError,
  };
};
