
export type PatternType = '2pane_comparison' | '3pane_parallel' | 'linear_process';

// --- Base Renderer Props ---
export interface BaseRendererProps<T> {
  content: T;
}

// --- 2 Pane Comparison (Existing) ---
export interface PaneContent {
  pane_title: string;
  content: string[];
}

export interface TwoPaneComparisonContent {
  left_pane: PaneContent;
  right_pane: PaneContent;
  comparison: string;
}

// --- 3 Pane Parallel (New) ---
export interface ThreePaneParallelPane {
  pane_title: string; // max 25 chars
  content: string[]; // max 3 items, 50 chars each
}

export interface ThreePaneParallelContent {
  main_title: string; // max 40 chars
  panes: [ThreePaneParallelPane, ThreePaneParallelPane, ThreePaneParallelPane]; // Fixed array of 3 panes
  summary: string; // max 100 chars
}

// --- Linear Process (New) ---
export interface LinearProcessStep {
  step_number: number;
  step_title: string; // max 30 chars
  description: string; // max 80 chars
  details: string[]; // max 2 items, 60 chars each
}

export interface LinearProcessContent {
  process_title: string; // max 40 chars
  steps: LinearProcessStep[];
  conclusion: string; // max 120 chars
}

// --- Slide & Presentation (Updated) ---
export type SlideContent = TwoPaneComparisonContent | ThreePaneParallelContent | LinearProcessContent;

export interface Slide {
  slide_id: number;
  pattern_type: PatternType;
  content: SlideContent;
}

export interface PresentationData {
  title: string;
  description: string;
  slides: Slide[];
}

// --- API & Error Types (Existing - Unchanged) ---
export interface ApiError {
  code?: number;
  message: string;
  retryable?: boolean;
  userMessage: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  usage?: UsageMetrics;
  rawYaml?: string; 
}

export interface UsageMetrics {
  requestsThisSession: number;
  tokensUsedThisSession: number;
}

export interface ValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, any>;
  message?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

// --- Theme System Types ---
export type ThemeName = 'light' | 'dark' | 'high-contrast';

export interface ThemeColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;
  textOnSecondary: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeTypography {
  fontFamilySans: string;
  fontFamilyDisplay: string;
  fontFamilyMono: string;
}

export interface ThemeSpacing {
  unit: string; 
}

export interface ThemeLayout {
  borderRadiusSm: string;
  borderRadiusDefault: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  shadowSm: string;
  shadowDefault: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadowInner: string;
}

export interface ThemeAnimation {
    durationShort: string;
    durationMedium: string;
    durationLong: string;
    timingFunction: string;
}

export interface AppTheme {
  name: ThemeName;
  isDark: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  layout: ThemeLayout;
  animation: ThemeAnimation;
}

export interface ThemeContextType {
  theme: AppTheme;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
}

// --- Advanced AI & Multimodal Types (New for 4.1) ---
export interface ImagePart {
  inlineData: {
    mimeType: string; // e.g., 'image/png', 'image/jpeg'
    data: string;     // base64 encoded string
  };
}

export interface TextPart {
  text: string;
}

export type MultimodalContentPart = ImagePart | TextPart;

export interface MultimodalPrompt {
  parts: MultimodalContentPart[];
  // role?: 'user' | 'model'; // If building a chat history
}

export interface AISuggestion {
  id: string;
  type: 'content_improvement' | 'alt_text' | 'style_adjustment' | 'image_idea' | 'fact_check_needed';
  originalText?: string; // For content improvement
  suggestedText?: string;
  description: string; // General description of the suggestion
  appliesToElementId?: string; // Optional: ID of the element the suggestion applies to
}

export type PresentationStylePreference = 'professional' | 'casual' | 'academic' | 'creative' | 'concise';

export interface PersonalizationPreferences {
  preferredStyle?: PresentationStylePreference;
  frequentlyUsedPatterns?: PatternType[];
  customPrompts?: Record<string, string>; // User-defined prompts
  // Add more preferences as needed
}

export interface ImageAnalysisResult {
  description: string;
  altText?: string;
  keywords?: string[];
}

export interface ContentAnalysisResult {
  critique?: string;
  suggestions?: AISuggestion[];
  readabilityScore?: number; // Placeholder
}
