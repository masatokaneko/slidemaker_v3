
// Defines the structure for API errors
export interface ApiError {
  message: string; // User-friendly error message
  details?: string; // Optional technical details
}

// Defines the structure for usage metrics tracked by the application
export interface UsageMetrics {
  requestsMade: number;
  maxRequestsPerHour: number; // Example limit
}

// Defines the structure for content within a pane of a 2-pane comparison slide
export interface PaneContent {
  pane_title: string; // Title of the pane (max 30 chars for 2pane, 25 for 3pane)
  content: string[];  // Array of content points (max 4 items, 60 chars each for 2pane; max 3 items, 50 chars for 3pane)
}

// Defines the structure for the content specific to a 2-pane comparison slide
export interface TwoPaneComparisonContent {
  left_pane: PaneContent;
  right_pane: PaneContent;
  comparison: string; // Comparison summary (max 120 chars)
}

// New type for individual panes in 3-pane parallel
export interface ThreePaneParallelSinglePane {
  pane_title: string; // max 25 chars
  content: string[]; // max 3 items, 50 chars each
}

// New type for 3-pane parallel content
export interface ThreePaneParallelContent {
  main_title: string; // max 40 chars
  panes: [ThreePaneParallelSinglePane, ThreePaneParallelSinglePane, ThreePaneParallelSinglePane];
  summary: string; // max 100 chars
}

// New type for steps in linear process
export interface LinearProcessStep {
  step_number: number;
  step_title: string; // max 30 chars
  description: string; // max 80 chars
  details: string[]; // max 2 items, 60 chars each
}

// New type for linear process content
export interface LinearProcessContent {
  process_title: string; // max 40 chars
  steps: LinearProcessStep[];
  conclusion: string; // max 120 chars
}

// Enum for different slide patterns available
export enum SlidePattern {
  TwoPaneComparison = "2pane_comparison",
  ThreePaneParallel = "3pane_parallel",
  LinearProcess = "linear_process",
}

// Defines the structure for a single slide
export interface Slide {
  slide_id: number;
  pattern_type: SlidePattern;
  content: TwoPaneComparisonContent | ThreePaneParallelContent | LinearProcessContent; // Union type for content
}

// Defines the overall structure of a presentation
export interface PresentationData {
  title: string;        // Presentation title (max 50 chars)
  description: string;  // Presentation description (max 100 chars)
  slides: Slide[];
}

// Defines the expected structure of the YAML output from the AI
// This is a string representation, actual parsing will result in PresentationData
export type YamlOutput = string;

// Structure for grounding metadata if using Google Search
export interface GroundingChunkWeb {
  uri?: string; 
  title?: string; // Made optional to align with @google/genai SDK
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}
export interface GenerateContentResponseWithGrounding {
  text: string;
  candidates?: Candidate[];
}

// For pattern rendering (Prompt 2.1)
export interface StyleSettings {
  fontFamily?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontSize?: {
    title: number;
    paneTitle: number;
    content: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}