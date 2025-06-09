
import yaml from 'js-yaml';
import Ajv from 'ajv';
import { PresentationData, ApiError } from '../types';
import { PRESENTATION_SCHEMA } from './constants';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(PRESENTATION_SCHEMA);

interface ValidationResult {
  data?: PresentationData;
  error?: ApiError;
}

// Parses a YAML string and validates it against the presentation schema
export const parseAndValidateYaml = (yamlString: string): ValidationResult => {
  try {
    // Pre-process YAML string to remove potential markdown fences if Gemini adds them
    let cleanYamlString = yamlString.trim();
    const yamlFenceRegex = /^```yaml\s*\n?(.*?)\n?\s*```$/s; // For ```yaml ... ```
    const genericFenceRegex = /^```\s*\n?(.*?)\n?\s*```$/s; // For ``` ... ```
    
    let match = cleanYamlString.match(yamlFenceRegex);
    if (match && match[1]) {
      cleanYamlString = match[1].trim();
    } else {
      match = cleanYamlString.match(genericFenceRegex);
      if (match && match[1]) {
        cleanYamlString = match[1].trim();
      }
    }

    const parsedData = yaml.load(cleanYamlString);

    if (typeof parsedData !== 'object' || parsedData === null) {
      return { error: { message: "Invalid YAML structure: Not an object." } };
    }

    // Ensure parsedData is compatible with PresentationData structure for validation
    // js-yaml might parse into a plain JS object which is fine for AJV
    const dataToValidate = parsedData as PresentationData;

    const valid = validate(dataToValidate);
    if (!valid) {
      const errors = validate.errors?.map(err => `${err.instancePath} ${err.message}`).join(', ');
      return { error: { message: `Schema validation failed: ${errors || 'Unknown validation error'}` } };
    }
    return { data: dataToValidate };
  } catch (e: any) {
    console.error("YAML Parsing/Validation Error:", e);
    return { error: { message: `YAML parsing error: ${e.message || 'Invalid YAML format'}` } };
  }
};
