
import Ajv from 'ajv';
import { load as yamlLoad } from 'js-yaml';
import { PRESENTATION_SCHEMA, MAX_INPUT_LENGTH } from '../constants'; // Changed import path
import type { PresentationData, ValidationError } from '../types';

const ajv = new Ajv({ allErrors: true });
const validateFunction = ajv.compile(PRESENTATION_SCHEMA);

export const sanitizeInput = (text: string): string => {
  // Basic sanitization: trim whitespace and limit length
  let sanitizedText = text.trim();
  if (sanitizedText.length > MAX_INPUT_LENGTH) {
    sanitizedText = sanitizedText.substring(0, MAX_INPUT_LENGTH);
    // Optionally, add a warning or notification to the user about truncation
    console.warn(`Input text truncated to ${MAX_INPUT_LENGTH} characters.`);
  }
  // More complex PII removal is out of scope for this client-side example.
  // For production, sensitive data handling should be robust.
  return sanitizedText;
};

// Function to clean markdown fences (```json ... ``` or ```yaml ... ```)
const cleanMarkdownFence = (rawText: string): string => {
  const text = rawText.trim();
  const fenceRegex = /^```(?:json|yaml)?\s*\n?(.*?)\n?\s*```$/si;
  const match = text.match(fenceRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text; // Return original if no fence or if content is empty
};


export const validateAndParseYaml = (
  yamlString: string
): { isValid: boolean; data: PresentationData | null; errors: ValidationError[] | null | undefined; rawYaml?: string } => {
  const cleanedYamlString = cleanMarkdownFence(yamlString);
  let parsedData: any;

  try {
    parsedData = yamlLoad(cleanedYamlString);
    if (parsedData === null || typeof parsedData !== 'object') {
      // Handles cases where YAML is valid but empty or not an object
      return { isValid: false, data: null, errors: [{ message: "YAML content is empty or not an object.", instancePath: "", schemaPath: "", keyword: "type", params: {} }], rawYaml: cleanedYamlString };
    }
  } catch (e: any) {
    return { 
      isValid: false, 
      data: null, 
      errors: [{ message: `YAML parsing error: ${e.message}`, instancePath: "", schemaPath: "", keyword: "parsing", params: {} }],
      rawYaml: cleanedYamlString
    };
  }

  const isValid = validateFunction(parsedData);
  if (!isValid) {
    return { 
      isValid: false, 
      data: null, 
      errors: validateFunction.errors as ValidationError[] | null | undefined, // Type cast Ajv errors
      rawYaml: cleanedYamlString 
    };
  }

  return { 
    isValid: true, 
    data: parsedData as PresentationData, 
    errors: null,
    rawYaml: cleanedYamlString
  };
};
