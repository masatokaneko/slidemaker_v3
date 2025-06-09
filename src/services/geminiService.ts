
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_API_MODEL_TEXT } from '../utils/constants';
import { ApiError, GenerateContentResponseWithGrounding } from '../types';

// Retrieve API key from environment variables
// IMPORTANT: Assumes process.env.API_KEY is set in the execution environment (e.g., Google AI Studio secrets)
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("Gemini API Key is missing. Please set process.env.API_KEY.");
}

// Validates if the API key is present (basic check)
export const validateApiKey = (): boolean => {
  return !!API_KEY;
};

// Generates content using the Gemini API with retry logic for rate limiting
export const generateGeminiContent = async (
  prompt: string,
  systemInstruction?: string
): Promise<{ data?: GenerateContentResponseWithGrounding; error?: ApiError }> => {
  if (!ai) {
    return { error: { message: "Gemini API client is not initialized. API Key might be missing." } };
  }
  if (!API_KEY) {
    return { error: { message: "Gemini API Key is not configured." } };
  }

  let retries = 3;
  let delay = 1000; // Initial delay 1 second

  while (retries > 0) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_API_MODEL_TEXT,
        contents: prompt,
        config: {
          ...(systemInstruction && { systemInstruction }),
          // Using default thinkingConfig (enabled). For low latency, use:
          // thinkingConfig: { thinkingBudget: 0 }
        },
      });
      
      // The `text` accessor simplifies getting the text.
      const responseText = response.text;
      const candidates = response.candidates; // For grounding metadata

      return { data: { text: responseText, candidates } };
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      // Check for specific error types, e.g. rate limits (often 429)
      // The actual error structure from @google/genai might vary, adjust as needed
      if (e.status === 429 && retries > 0) { // Example: check for rate limit error
        console.warn(`Rate limit hit. Retrying in ${delay / 1000}s... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        retries--;
      } else {
         // Attempt to parse a more specific error message if available
        let message = "Failed to generate content from Gemini API.";
        if (e.message) {
          message = e.message;
        } else if (typeof e === 'string') {
          message = e;
        }
        // Provide a user-friendly message and potentially log technical details
        return { error: { message: `API Error: ${message}`, details: JSON.stringify(e) } };
      }
    }
  }
  return { error: { message: "Failed to generate content after multiple retries due to rate limiting or other API errors." } };
};