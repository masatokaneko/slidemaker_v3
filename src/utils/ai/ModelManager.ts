
import { 
    GEMINI_TEXT_MODEL, 
    GEMINI_VISION_MODEL, 
    GEMINI_IMAGE_GENERATION_MODEL 
} from '../../constants';

export type AITaskType = 'text_generation' | 'multimodal_understanding' | 'image_generation';

export const ModelManager = {
  getModelNameForTask: (taskType: AITaskType): string => {
    switch (taskType) {
      case 'text_generation':
        return GEMINI_TEXT_MODEL;
      case 'multimodal_understanding':
        // Gemini Vision tasks (like describing an image or answering questions about it)
        // use the text model that supports multimodal input.
        return GEMINI_VISION_MODEL; 
      case 'image_generation':
        return GEMINI_IMAGE_GENERATION_MODEL;
      default:
        console.warn(`Unknown AI task type: ${taskType}. Defaulting to text model.`);
        return GEMINI_TEXT_MODEL;
    }
  },

  // Expose model names directly if needed
  models: {
    text: GEMINI_TEXT_MODEL,
    vision: GEMINI_VISION_MODEL,
    imageGeneration: GEMINI_IMAGE_GENERATION_MODEL,
  }
};
