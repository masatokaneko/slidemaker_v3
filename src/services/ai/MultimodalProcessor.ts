
import type { ImagePart, TextPart, MultimodalContentPart, ApiResponse } from '../../types';
import { geminiService } from '../geminiService';
import { PromptEngineer } from './PromptEngineer';
import type { PersonalizationPreferences } from '../../types';

const MAX_IMAGE_SIZE_MB = 4; // Gemini API supports up to 4MB images generally

export const MultimodalProcessor = {
  /**
   * Processes an image file for use with the Gemini API.
   * Converts the image to a base64 data URL and checks size.
   * @param imageFile The image file object.
   * @returns A promise that resolves to an ImagePart or an error string.
   */
  processImageFile: (imageFile: File): Promise<ImagePart | string> => {
    return new Promise((resolve) => {
      if (imageFile.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        resolve(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        // The base64 string includes the data URL prefix (e.g., "data:image/png;base64,"),
        // Gemini API expects only the data part.
        const pureBase64Data = base64Data.split(',')[1]; 
        if (!pureBase64Data) {
            resolve("Failed to read image data.");
            return;
        }

        resolve({
          inlineData: {
            mimeType: imageFile.type, // e.g., 'image/png', 'image/jpeg'
            data: pureBase64Data,
          },
        });
      };
      reader.onerror = () => {
        resolve("Failed to read image file.");
      };
      reader.readAsDataURL(imageFile);
    });
  },

  /**
   * Sends a multimodal request (e.g., image + text prompt) to the Gemini API.
   * @param parts An array of MultimodalContentPart (ImagePart, TextPart).
   * @param systemInstruction Optional system instruction for the model.
   * @param useThinking Whether to use the model's "thinking" capability.
   * @returns A promise resolving to an ApiResponse with the model's text response.
   */
  generateContentFromMultimodalInput: async (
    parts: MultimodalContentPart[],
    systemInstruction?: string,
    useThinking: boolean = true
  ): Promise<ApiResponse<string>> => {
    if (parts.length === 0) {
      return { success: false, error: { message: "No content parts provided.", userMessage: "Input cannot be empty." } };
    }
    return geminiService.generateContentMultimodal(parts, systemInstruction, useThinking);
  },

  /**
   * Generates a textual description of a given image.
   * @param imagePart The processed ImagePart.
   * @param personalization Optional user personalization preferences.
   * @returns A promise resolving to an ApiResponse with the image description.
   */
  describeImage: async (
    imagePart: ImagePart,
    personalization?: PersonalizationPreferences
  ): Promise<ApiResponse<string>> => {
    const { systemInstruction } = PromptEngineer.createImageDescriptionPrompt(personalization);
    const parts: MultimodalContentPart[] = [imagePart];
    // Optionally, add a leading text part if the prompt structure requires it,
    // e.g., { text: "Describe this image:" }
    // For now, systemInstruction should be sufficient.
    
    return geminiService.generateContentMultimodal(parts, systemInstruction);
  },
};
