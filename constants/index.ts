
import type { PatternType } from "../types";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
// For multimodal tasks (like image understanding), use the same text model
// as it supports multimodal inputs.
export const GEMINI_VISION_MODEL = "gemini-2.5-flash-preview-04-17"; 
export const GEMINI_IMAGE_GENERATION_MODEL = "imagen-3.0-generate-002";


export const MAX_INPUT_LENGTH = 5000;
export const MAX_REQUESTS_PER_SESSION = 50; // Simplified client-side limit

export const SUPPORTED_PATTERNS: PatternType[] = ['2pane_comparison', '3pane_parallel', 'linear_process'];

// --- LocalStorage Keys ---
export const LOCALSTORAGE_PERSONALIZATION_KEY = 'aiStudioApp_personalization';

// --- System Prompts ---

export const YAML_GENERATION_SYSTEM_PROMPT = \`
You are a presentation structure expert specializing in creating professional slide layouts.
Analyze the provided Japanese input and select the MOST APPROPRIATE pattern from the available options. Then, generate structured YAML for that single slide.

Available Patterns and Use Cases:
1.  **2pane_comparison**: Use when comparing or contrasting two distinct elements, concepts, or approaches directly.
    Output YAML Structure:
    presentation:
      title: "プレゼンテーションのタイトル (最大50文字)"
      description: "プレゼンテーションの説明 (最大100文字)"
      slides:
        - slide_id: 1
          pattern_type: "2pane_comparison"
          content:
            left_pane:
              pane_title: "左側のペインのタイトル (最大30文字)"
              content: ["ポイント1 (各最大60文字)", "ポイント2", "ポイント3", "ポイント4"] # Max 4 items
            right_pane:
              pane_title: "右側のペインのタイトル (最大30文字)"
              content: ["ポイント1 (各最大60文字)", "ポイント2", "ポイント3", "ポイント4"] # Max 4 items
            comparison: "比較の概要 (最大120文字)"

2.  **3pane_parallel**: Use when presenting three related elements, phases, topics, or parallel concepts that deserve individual attention under a common theme.
    Output YAML Structure:
    presentation:
      title: "プレゼンテーションのタイトル (最大50文字)"
      description: "プレゼンテーションの説明 (最大100文字)"
      slides:
        - slide_id: 1
          pattern_type: "3pane_parallel"
          content:
            main_title: "メインタイトル (このスライドの主題 - 最大40文字)"
            panes: # Exactly 3 panes
              - pane_title: "ペイン1のタイトル (最大25文字)"
                content: ["ポイント1 (各最大50文字)", "ポイント2", "ポイント3"] # Max 3 items
              - pane_title: "ペイン2のタイトル (最大25文字)"
                content: ["ポイント1 (各最大50文字)", "ポイント2", "ポイント3"] # Max 3 items
              - pane_title: "ペイン3のタイトル (最大25文字)"
                content: ["ポイント1 (各最大50文字)", "ポイント2", "ポイント3"] # Max 3 items
            summary: "3ペイン全体の総括や次のステップ (最大100文字)"

3.  **linear_process**: Use when describing step-by-step processes, workflows, sequential procedures, or a timeline.
    Output YAML Structure:
    presentation:
      title: "プレゼンテーションのタイトル (最大50文字)"
      description: "プレゼンテーションの説明 (最大100文字)"
      slides:
        - slide_id: 1
          pattern_type: "linear_process"
          content:
            process_title: "プロセス全体のタイトル (最大40文字)"
            steps: # Multiple steps allowed
              - step_number: 1
                step_title: "ステップ1のタイトル (最大30文字)"
                description: "ステップ1の説明 (最大80文字)"
                details: ["詳細1 (各最大60文字)", "詳細2"] # Max 2 items
              - step_number: 2
                step_title: "ステップ2のタイトル (最大30文字)"
                description: "ステップ2の説明 (最大80文字)"
                details: ["詳細1", "詳細2"]
            conclusion: "プロセス全体の結論や成果 (最大120文字)"

General Constraints:
- Base your pattern choice on the input content's structure and intent.
- Ensure all text generated is in professional Japanese business language.
- Strictly adhere to the character limits specified for each field within the chosen pattern. Summarize concisely if source implies longer text.
- Ensure the output is valid YAML.
- Generate only one slide (slide_id: 1).
- The \`pattern_type\` field in the YAML MUST match one of the three specified patterns.
- Fill all fields of the chosen pattern structure logically based on the input.
\`;

export const IMAGE_DESCRIPTION_SYSTEM_PROMPT = \`
You are an expert image analyst. Describe the provided image in detail, focusing on elements relevant for a presentation.
Consider the main subject, setting, colors, mood, and any text or data visible.
The description should be concise yet comprehensive, suitable for someone who hasn't seen the image.
Output format: A single paragraph of descriptive text.
\`;

export const CONTENT_CRITIQUE_SYSTEM_PROMPT = (stylePreference: string = 'professional') => {
  return \`
You are an expert content editor and writing coach.
Review the following text intended for a presentation slide.
Provide constructive criticism focusing on:
1. Clarity and conciseness.
2. Grammatical correctness and style (target style: ${stylePreference}).
3. Engagement and impact.
4. Coherence and logical flow (if multiple points).
5. Suggestions for improvement, if any.

Format your response as a brief summary followed by bullet points for specific feedback.
If the content is excellent, acknowledge that.
\`;
};

export const ALT_TEXT_GENERATION_SYSTEM_PROMPT = \`
You are an expert in web accessibility. Based on the provided image, generate concise and descriptive alternative text (alt text).
The alt text should:
1. Accurately describe the image content and function.
2. Be brief (ideally under 125 characters, but can be longer if necessary for complex images).
3. Not include phrases like "image of..." or "picture of...".
Output format: A single string of alt text.
\`;

export const SLIDE_GENERATION_FROM_IMAGE_PROMPT = (userObjective: string = "Create a presentation slide based on this image.") => {
  return \`
Based on the provided image and the user's objective: "${userObjective}", generate the content for a single presentation slide.
Determine the most suitable slide pattern (2pane_comparison, 3pane_parallel, or linear_process) if not specified by the user.
Extract key information from the image to populate the chosen pattern.
The output should be in the structured YAML format as previously defined for slide generation.
The presentation title and description should also be inferred from the image and objective.
All text should be in professional Japanese business language. Adhere to character limits.
\`;
};

// --- JSON Schema for Presentation ---
const twoPaneComparisonContentSchema = {
  type: "object",
  properties: {
    left_pane: {
      type: "object",
      properties: {
        pane_title: { type: "string", maxLength: 30 },
        content: { type: "array", items: { type: "string", maxLength: 60 }, maxItems: 4 },
      },
      required: ["pane_title", "content"],
    },
    right_pane: {
      type: "object",
      properties: {
        pane_title: { type: "string", maxLength: 30 },
        content: { type: "array", items: { type: "string", maxLength: 60 }, maxItems: 4 },
      },
      required: ["pane_title", "content"],
    },
    comparison: { type: "string", maxLength: 120 },
  },
  required: ["left_pane", "right_pane", "comparison"],
};

const threePaneParallelContentSchema = {
  type: "object",
  properties: {
    main_title: { type: "string", maxLength: 40 },
    panes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pane_title: { type: "string", maxLength: 25 },
          content: { type: "array", items: { type: "string", maxLength: 50 }, maxItems: 3 },
        },
        required: ["pane_title", "content"],
      },
      minItems: 3,
      maxItems: 3, // Strictly 3 panes
    },
    summary: { type: "string", maxLength: 100 },
  },
  required: ["main_title", "panes", "summary"],
};

const linearProcessContentSchema = {
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
          details: { type: "array", items: { type: "string", maxLength: 60 }, maxItems: 2 },
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
      maxItems: 1, // For phase 1 & 2.1, only one slide is generated.
      items: {
        type: "object",
        properties: {
          slide_id: { type: "number", const: 1 }, // Enforce slide_id is 1
          pattern_type: { type: "string", enum: SUPPORTED_PATTERNS },
          content: { type: "object" }, // Content schema defined by conditional logic below
        },
        required: ["slide_id", "pattern_type", "content"],
        allOf: [ // Conditional validation for content based on pattern_type
          {
            if: { properties: { pattern_type: { const: "2pane_comparison" } } },
            then: { properties: { content: twoPaneComparisonContentSchema } },
          },
          {
            if: { properties: { pattern_type: { const: "3pane_parallel" } } },
            then: { properties: { content: threePaneParallelContentSchema } },
          },
          {
            if: { properties: { pattern_type: { const: "linear_process" } } },
            then: { properties: { content: linearProcessContentSchema } },
          },
        ],
      },
    },
  },
  required: ["title", "description", "slides"],
};
