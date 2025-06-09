
import { SlidePattern } from '../types';

export const GEMINI_API_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const MAX_REQUESTS_PER_HOUR = 50; 
export const MAX_INPUT_LENGTH = 5000;

// Schema for 2 Pane Comparison Content
const TWO_PANE_COMPARISON_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    left_pane: {
      type: "object",
      properties: {
        pane_title: { type: "string", maxLength: 30 },
        content: { type: "array", items: { type: "string", maxLength: 60 }, minItems: 1, maxItems: 4 },
      },
      required: ["pane_title", "content"],
    },
    right_pane: {
      type: "object",
      properties: {
        pane_title: { type: "string", maxLength: 30 },
        content: { type: "array", items: { type: "string", maxLength: 60 }, minItems: 1, maxItems: 4 },
      },
      required: ["pane_title", "content"],
    },
    comparison: { type: "string", maxLength: 120 },
  },
  required: ["left_pane", "right_pane", "comparison"],
};

// Schema for 3 Pane Parallel Content
const THREE_PANE_PARALLEL_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    main_title: { type: "string", maxLength: 40 },
    panes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pane_title: { type: "string", maxLength: 25 },
          content: { type: "array", items: { type: "string", maxLength: 50 }, minItems: 1, maxItems: 3 },
        },
        required: ["pane_title", "content"],
      },
      minItems: 3,
      maxItems: 3,
    },
    summary: { type: "string", maxLength: 100 },
  },
  required: ["main_title", "panes", "summary"],
};

// Schema for Linear Process Content
const LINEAR_PROCESS_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    process_title: { type: "string", maxLength: 40 },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          step_number: { type: "number" },
          step_title: { type: "string", maxLength: 30 },
          description: { type: "string", maxLength: 80 },
          details: { type: "array", items: { type: "string", maxLength: 60 }, minItems: 0, maxItems: 2 },
        },
        required: ["step_number", "step_title", "description", "details"],
      },
      minItems: 1,
    },
    conclusion: { type: "string", maxLength: 120 },
  },
  required: ["process_title", "steps", "conclusion"],
};

export const PRESENTATION_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", maxLength: 50 },
    description: { type: "string", maxLength: 100 },
    slides: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          slide_id: { type: "number" },
          pattern_type: { type: "string", enum: Object.values(SlidePattern) },
          content: { // Content schema will be determined by pattern_type
            oneOf: [ // This requires pattern_type to be correctly set for validation
                        TWO_PANE_COMPARISON_CONTENT_SCHEMA,
                        THREE_PANE_PARALLEL_CONTENT_SCHEMA,
                        LINEAR_PROCESS_CONTENT_SCHEMA
                      // Note: For more precise validation with oneOf based on a sibling property (pattern_type),
                      // AJV might need `discriminator` keyword or more complex if/then/else structures.
                      // This simpler oneOf assumes the content structure itself is one of the valid types.
                      // Actual validation logic might need to be augmented in code post-parsing if this isn't sufficient.
            ]
          }
        },
        required: ["slide_id", "pattern_type", "content"],
        // Example of a more robust way if using AJV features, this is complex:
        // allOf: [
        //   { $ref: "#/definitions/baseSlide" },
        //   {
        //     if: { properties: { pattern_type: { const: SlidePattern.TwoPaneComparison } } },
        //     then: { properties: { content: { $ref: "#/definitions/twoPaneComparisonContent" } } }
        //   },
        //   {
        //     if: { properties: { pattern_type: { const: SlidePattern.ThreePaneParallel } } },
        //     then: { properties: { content: { $ref: "#/definitions/threePaneParallelContent" } } }
        //   },
        //   {
        //     if: { properties: { pattern_type: { const: SlidePattern.LinearProcess } } },
        //     then: { properties: { content: { $ref: "#/definitions/linearProcessContent" } } }
        //   }
        // ]
      },
    },
  },
  required: ["title", "description", "slides"],
  // definitions: { // For use with more complex if/then/else or $ref structure
  //   baseSlide: { ... },
  //   twoPaneComparisonContent: TWO_PANE_COMPARISON_CONTENT_SCHEMA,
  //   threePaneParallelContent: THREE_PANE_PARALLEL_CONTENT_SCHEMA,
  //   linearProcessContent: LINEAR_PROCESS_CONTENT_SCHEMA,
  // }
};
