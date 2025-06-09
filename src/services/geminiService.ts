
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ApiError, UsageMetrics, ApiResponse, MultimodalContentPart } from '../types';
import { GEMINI_TEXT_MODEL, GEMINI_VISION_MODEL, MAX_REQUESTS_PER_SESSION } from '../constants';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

let sessionRequestCount = 0;
const usageMetrics: UsageMetrics = {
  requestsThisSession: 0,
  tokensUsedThisSession: 0, 
};

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

const handleApiCall = async <T>(
    apiCall: () => Promise<GenerateContentResponse>,
    errorContext: string
  ): Promise<ApiResponse<T>> => {
    if (!ai) {
      return {
        success: false,
        error: {
          message: "Gemini API key not configured.",
          userMessage: "API key is missing. Please ensure VITE_GEMINI_API_KEY is set.",
        },
      };
    }

    if (sessionRequestCount >= MAX_REQUESTS_PER_SESSION) {
      return {
        success: false,
        error: {
          message: "Session request limit reached.",
          userMessage: `You have reached the maximum of ${MAX_REQUESTS_PER_SESSION} requests for this session. Please try again later.`,
          retryable: false,
        },
      };
    }

    let retries = 0;
    while (retries <= MAX_RETRIES) {
      try {
        const response = await apiCall();
        
        sessionRequestCount++;
        usageMetrics.requestsThisSession = sessionRequestCount;
        // Note: Token counting is complex client-side and typically handled by the API response if available.
        // This is a placeholder for more accurate tracking if the API provides it directly.
        // usageMetrics.tokensUsedThisSession += (prompt.length + (response.text?.length || 0)); 

        return {
          success: true,
          data: response.text as T, // Assuming response.text is the primary data type
          usage: { ...usageMetrics },
        };
      } catch (error: any) {
        console.error(`Gemini API Error (${errorContext}):`, error);
        const userMessage = "An error occurred while communicating with the AI. Please try again.";
        let apiError: ApiError = { message: error.message || `Unknown API error in ${errorContext}`, userMessage, retryable: false };

        if (error.message?.includes('429') || error.status === 429) {
          apiError = {
            code: 429,
            message: "Rate limit exceeded or quota exhausted.",
            userMessage: "The service is experiencing high demand. Please wait a moment and try again.",
            retryable: true,
          };
          if (retries < MAX_RETRIES) {
            const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, retries);
            console.log(`Rate limit hit. Retrying in ${backoffTime / 1000}s... (Attempt ${retries + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            retries++;
            continue; 
          } else {
             apiError.userMessage = "The service is currently unavailable due to high demand. Please try again later.";
             apiError.retryable = false;
          }
        } else if (error.message?.includes('API key not valid')) {
            apiError = { code: 403, message: "Authentication failed. API key might be invalid.", userMessage: "Authentication failed. Please check your API key configuration.", retryable: false };
        } else if (error.message?.includes('Bad Request') || error.status === 400 || error.message?.includes('[GoogleGenerativeAI Error]: Error fetching from GCS')) {
            apiError = { code: 400, message: `Bad request. The input might be invalid or an issue with content. Details: ${error.message}`, userMessage: "There was an issue with the request (e.g. invalid input or image data). Please check your input and try again.", retryable: false };
        }
        return { success: false, error: apiError, usage: { ...usageMetrics } };
      }
    }
    return { 
        success: false, 
        error: { message: "Max retries exceeded.", userMessage: "Failed to get a response after multiple attempts. Please try again later.", retryable: false },
        usage: { ...usageMetrics } 
    };
};


export const geminiService = {
  isApiKeyValid: async (): Promise<boolean> => {
    if (!ai) return false;
    try {
      // Use a minimal, non-streaming call for validation.
      // Temperature 0 for deterministic (less variable) check.
      await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL, // Use the actual text model constant
        contents: 'test', // Minimal prompt
        config: { temperature: 0 } 
      });
      return true;
    } catch (error) {
      console.error("API Key validation failed:", error);
      return false;
    }
  },

  generateContent: async (
    prompt: string, 
    systemInstruction?: string,
    useThinking: boolean = true // Default to true as per general guidance unless specified
  ): Promise<ApiResponse<string>> => {
    return handleApiCall<string>(async () => {
        if (!ai) throw new Error("AI client not initialized");
        const config: any = { temperature: 0.7, topP: 0.95, topK: 64 }; // Example reasonable defaults
        if (systemInstruction) config.systemInstruction = systemInstruction;

        // Apply thinkingConfig only if model is 'gemini-2.5-flash-preview-04-17' and useThinking is false
        if (GEMINI_TEXT_MODEL === "gemini-2.5-flash-preview-04-17" && !useThinking) {
            config.thinkingConfig = { thinkingBudget: 0 };
        }
        // Ensure to use the correct model name variable
        return ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config });
    }, "text generation");
  },

  generateContentMultimodal: async (
    parts: MultimodalContentPart[],
    systemInstruction?: string,
    useThinking: boolean = true // Default to true
  ): Promise<ApiResponse<string>> => {
     return handleApiCall<string>(async () => {
        if (!ai) throw new Error("AI client not initialized");
        const config: any = { temperature: 0.7, topP: 0.95, topK: 64 };
        if (systemInstruction) config.systemInstruction = systemInstruction;

        if (GEMINI_VISION_MODEL === "gemini-2.5-flash-preview-04-17" && !useThinking) {
            config.thinkingConfig = { thinkingBudget: 0 };
        }
        // Ensure to use the correct vision model name variable
        // The contents structure for multimodal is { parts: [...] }
        return ai.models.generateContent({ model: GEMINI_VISION_MODEL, contents: { parts }, config });
    }, "multimodal generation");
  },


  getUsageInfo: (): UsageMetrics => {
    return { ...usageMetrics };
  },
};
