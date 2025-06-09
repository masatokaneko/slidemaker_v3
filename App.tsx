
import React, { useState, useCallback, useRef } from 'react';
import { InputArea } from './components/InputArea';
import { SlidePreview } from './components/SlidePreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { useSlideGenerator } from './hooks/useSlideGenerator';
import { useAdvancedAI } from './hooks/useAdvancedAI'; // Import new hook
import type { PresentationData } from './types';
import { Github, Settings, Menu, X as CloseIcon, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ui/ThemeSwitcher';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { IconButton } from './components/ui/IconButton';
import { SlideThumbnailStrip } from './components/SlideThumbnailStrip';
import { SmartSuggestions } from './components/ai/SmartSuggestions'; // Import SmartSuggestions
import { AIInsightsDashboard } from './components/ai/AIInsightsDashboard'; // Import AIInsightsDashboard

const AppContent: React.FC = () => {
  const {
    generateSlides: generateSlidesFromText, // Rename for clarity
    presentationData,
    setPresentationData, // Allow setting presentation data from image generation
    isLoading: isLoadingTextGeneration,
    error: textGenerationError,
    setError: setTextGenerationError, // Allow setting error
    clearError: clearTextGenerationError,
    yamlOutput,
    setYamlOutput, // Allow setting YAML from image generation
  } = useSlideGenerator();

  const advancedAI = useAdvancedAI();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'insights'>('create');
  const slidePreviewRef = useRef<HTMLDivElement>(null);


  const handleGenerateFromText = async (promptText: string) => {
    advancedAI.clearSuggestionsState(); // Clear previous suggestions
    advancedAI.clearImageState(); // Clear any selected image
    const response = await generateSlidesFromText(promptText);
    if (response?.success && response.data) {
        setCurrentSlideIndex(0);
    }
  };

  const handleGenerateFromImage = async (imageFile: File, objective: string) => {
    setTextGenerationError(null);
    advancedAI.clearSuggestionsState();
    const response = await advancedAI.generateSlideFromImage(objective);
    if (response.success && response.data) {
        setPresentationData(response.data);
        setYamlOutput(response.rawYaml || null);
        setCurrentSlideIndex(0);
    } else {
        setPresentationData(null);
        setYamlOutput(response.rawYaml || null);
        // Error is handled by advancedAI.generationFromImageError
    }
  };
  
  const handleGetContentSuggestions = async (text: string) => {
    await advancedAI.fetchSuggestionsForContent(text);
  };
  
  const handleAcceptSuggestion = (suggestion: any) => {
      // Placeholder: Implement logic to apply suggestion to editor or relevant content
      console.log("Accepted suggestion:", suggestion);
      advancedAI.dismissSuggestion(suggestion.id); 
  };


  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const navigateSlides = (direction: 'prev' | 'next') => {
    if (!presentationData || !presentationData.slides) return;
    setCurrentSlideIndex(prev => {
      if (direction === 'next') {
        return Math.min(prev + 1, presentationData.slides.length - 1);
      } else {
        return Math.max(prev - 1, 0);
      }
    });
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentSlideIndex(index);
  };
  
  const currentError = textGenerationError || advancedAI.generationFromImageError || advancedAI.imageProcessingError || advancedAI.altTextError || advancedAI.suggestionsError;
  const clearCurrentError = () => {
    clearTextGenerationError();
    advancedAI.clearImageState(); // Clears imageProcessingError, altTextError, generationFromImageError
    advancedAI.clearSuggestionsState(); // Clears suggestionsError
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-medium">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface shadow-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" alt="Google Logo" className="h-6 mr-3 hidden sm:block" />
            <h1 className="text-xl font-display font-semibold text-primary sm:text-2xl">
              AI Slide Studio
            </h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button 
                variant={activeTab === 'create' ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('create')}
                className="hidden md:inline-flex"
            >
                Create
            </Button>
            <Button 
                variant={activeTab === 'insights' ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('insights')}
                leftIcon={<Brain size={16}/>}
                className="hidden md:inline-flex"
            >
                Insights
            </Button>
            <ThemeSwitcher />
            <IconButton 
              icon={<Settings size={20} />} 
              label="Open Settings" 
              onClick={() => setIsSidebarOpen(true)}
              variant="ghost"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!apiKey && <ApiKeyBanner />}

        {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Section */}
            <Card className="flex flex-col">
                <CardHeader>
                <CardTitle>Create Presentation</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                <InputArea 
                    onGenerate={handleGenerateFromText} 
                    isLoading={isLoadingTextGeneration}
                    onGenerateFromImage={handleGenerateFromImage}
                    isGeneratingFromImage={advancedAI.isGeneratingFromImage}
                    onGetContentSuggestions={handleGetContentSuggestions}
                    isFetchingSuggestions={advancedAI.isFetchingSuggestions}
                    onImageFileSelected={advancedAI.handleImageUpload}
                    processedImageFile={advancedAI.processedImageFile}
                    imageProcessingError={advancedAI.imageProcessingError}
                    altText={advancedAI.altText}
                    isGeneratingAltText={advancedAI.isGeneratingAltText}
                    onGenerateAltText={advancedAI.generateAltTextForImage}
                />
                {currentError && <ErrorMessage message={currentError} onClose={clearCurrentError} className="mt-4"/>}
                
                {(isLoadingTextGeneration || advancedAI.isGeneratingFromImage || advancedAI.isGeneratingAltText) && (
                    <div className="mt-4 flex-grow flex flex-col items-center justify-center">
                    <LoadingSpinner text={
                        advancedAI.isGeneratingFromImage ? "Generating from image..." :
                        advancedAI.isGeneratingAltText ? "Generating alt text..." :
                        "Generating from text..."
                    } />
                    </div>
                )}

                <SmartSuggestions
                    suggestions={advancedAI.suggestions}
                    isLoading={advancedAI.isFetchingSuggestions}
                    onAcceptSuggestion={handleAcceptSuggestion} // Implement actual accept logic
                    onDismissSuggestion={advancedAI.dismissSuggestion}
                    className="mt-4"
                />
                
                {yamlOutput && !isLoadingTextGeneration && !advancedAI.isGeneratingFromImage && !currentError && (
                    <div className="mt-6 flex-grow flex flex-col">
                    <h3 className="text-md font-medium text-text-secondary mb-2">Generated YAML:</h3>
                    <pre className="flex-grow bg-surface-alt p-3 rounded-md text-xs text-text-primary overflow-auto max-h-80 border border-border whitespace-pre-wrap break-all font-mono">
                        {yamlOutput}
                    </pre>
                    </div>
                )}
                </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="flex flex-col min-h-[450px] sm:min-h-[500px] lg:min-h-[600px]">
                <CardHeader className="flex items-center justify-between">
                <CardTitle>Slide Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center relative">
                {presentationData && presentationData.slides && presentationData.slides.length > 0 ? (
                    <>
                    <div ref={slidePreviewRef} className="w-full flex-grow flex items-center justify-center mb-4">
                        <SlidePreview 
                            presentationData={presentationData} 
                            currentSlideIndex={currentSlideIndex} 
                            previewRef={slidePreviewRef}
                        />
                    </div>
                    {presentationData.slides.length > 1 && (
                        <div className="w-full flex items-center justify-center space-x-4 mb-2">
                            <IconButton
                            icon={<ChevronLeft size={20} />}
                            label="Previous Slide"
                            onClick={() => navigateSlides('prev')}
                            disabled={currentSlideIndex === 0}
                            variant="outline"
                            />
                            <span className="text-sm text-text-secondary tabular-nums">
                            {currentSlideIndex + 1} / {presentationData.slides.length}
                            </span>
                            <IconButton
                            icon={<ChevronRight size={20} />}
                            label="Next Slide"
                            onClick={() => navigateSlides('next')}
                            disabled={currentSlideIndex === presentationData.slides.length - 1}
                            variant="outline"
                            />
                        </div>
                    )}
                    </>
                ) : (
                    <div className="text-center text-text-secondary p-8">
                    {(isLoadingTextGeneration || advancedAI.isGeneratingFromImage) ? 'Generating preview...' : 'Preview will appear here once slides are generated.'}
                    </div>
                )}
                </CardContent>
                {presentationData && presentationData.slides && presentationData.slides.length > 1 && (
                    <SlideThumbnailStrip
                        presentationData={presentationData}
                        currentSlideIndex={currentSlideIndex}
                        onThumbnailClick={handleThumbnailClick}
                    />
                )}
            </Card>
            </div>
        )}
        {activeTab === 'insights' && (
            <AIInsightsDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-surface text-center">
        <p className="text-sm text-text-secondary">Powered by Google Gemini API. This is a demo application.</p>
        <a
          href="https://github.com/google/generative-ai-docs/tree/main/site/en/ai_studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline mt-1 text-sm"
        >
          <Github size={14} className="mr-1.5" /> View on GitHub (Conceptual Link)
        </a>
      </footer>

      {/* Settings Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <Card className="relative w-full max-w-sm h-full shadow-xl border-l border-border rounded-l-none flex flex-col">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Application Settings</CardTitle>
                    <IconButton 
                        icon={<CloseIcon size={20} />} 
                        label="Close Settings"
                        onClick={() => setIsSidebarOpen(false)}
                        variant="ghost"
                    />
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto space-y-6">
                   <AccessibilitySettings />
                   {/* TODO: Add Personalization Settings UI here */}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
