
import { useState, useCallback } from 'react';
import { PresentationData, ApiError, UsageMetrics, YamlOutput, GenerateContentResponseWithGrounding } from '../types';
import { generatePresentationYaml } from '../services/yamlGenerationService';
import { parseAndValidateYaml } from '../utils/yamlParserValidator';
import { MAX_REQUESTS_PER_HOUR } from '../utils/constants';

interface UseSlideGeneratorReturn {
  presentationData: PresentationData | null;
  rawYaml: YamlOutput | null;
  isLoading: boolean;
  error: ApiError | null;
  usageMetrics: UsageMetrics;
  groundingMetadata: GenerateContentResponseWithGrounding['candidates'] | null;
  generateSlides: (userInput: string) => Promise<void>;
  clearError: () => void;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  currentSlideIndex: number;
}

export const useSlideGenerator = (): UseSlideGeneratorReturn => {
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [rawYaml, setRawYaml] = useState<YamlOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({
    requestsMade: 0,
    maxRequestsPerHour: MAX_REQUESTS_PER_HOUR,
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [groundingMetadata, setGroundingMetadata] = useState<GenerateContentResponseWithGrounding['candidates'] | null>(null);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateSlides = useCallback(async (userInput: string) => {
    clearError();
    setIsLoading(true);
    setPresentationData(null);
    setRawYaml(null);
    setCurrentSlideIndex(0);
    setGroundingMetadata(null);

    if (usageMetrics.requestsMade >= usageMetrics.maxRequestsPerHour) {
      setError({ message: "Request limit reached for this session. Please try again later." });
      setIsLoading(false);
      return;
    }

    const result = await generatePresentationYaml(userInput);

    if (result.error) {
      setError(result.error);
      setPresentationData(null);
      setRawYaml(null);
    } else if (result.yaml) {
      setRawYaml(result.yaml);
      if (result.groundingMetadata) {
        setGroundingMetadata(result.groundingMetadata);
      }
      const validationResult = parseAndValidateYaml(result.yaml);
      if (validationResult.error) {
        setError(validationResult.error);
        setPresentationData(null);
      } else if (validationResult.data) {
        setPresentationData(validationResult.data);
        setError(null); // Clear any previous errors if successful
      }
    } else {
      setError({ message: "Received empty YAML from generation service." });
      setPresentationData(null);
      setRawYaml(null);
    }
    
    setUsageMetrics(prev => ({ ...prev, requestsMade: prev.requestsMade + 1 }));
    setIsLoading(false);
  }, [clearError, usageMetrics]);

  return {
    presentationData,
    rawYaml,
    isLoading,
    error,
    usageMetrics,
    groundingMetadata,
    generateSlides,
    clearError,
    currentSlideIndex,
    setCurrentSlideIndex,
  };
};
