
import React from 'react';
import YamlGeneratorInput from './components/YamlGeneratorInput';
import SlidePreview from './components/SlidePreview';
import { useSlideGenerator } from './hooks/useSlideGenerator';
import { Github, Zap } from 'lucide-react'; // Example icons

const App: React.FC = () => {
  const {
    presentationData,
    rawYaml,
    isLoading,
    error,
    usageMetrics,
    groundingMetadata,
    generateSlides,
    clearError,
    currentSlideIndex,
    setCurrentSlideIndex,
  } = useSlideGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Zap size={40} className="text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            AI Slide Generator
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          日本語のアイデアから、AIが瞬時にプレゼンテーション構成を提案します。
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <YamlGeneratorInput
            onGenerate={generateSlides}
            isLoading={isLoading}
            error={error}
            clearError={clearError}
            usageMetrics={usageMetrics}
            rawYaml={rawYaml}
            groundingMetadata={groundingMetadata}
          />
        </div>

        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <SlidePreview
            presentation={presentationData}
            currentSlideIndex={currentSlideIndex}
            setCurrentSlideIndex={setCurrentSlideIndex}
          />
        </div>
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-sm">
        <p>Powered by Google Gemini API.</p>
        <p>
          This is a demo application for slide structure generation. Phase 1: 2-Pane Comparison.
        </p>
        <a 
          href="https://github.com/google/generative-ai-docs/tree/main/site/en/tutorials/rest_quickstart" /* Placeholder link */
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center hover:text-yellow-400 transition-colors mt-2"
        >
          <Github size={16} className="mr-1" /> View on GitHub (Example)
        </a>
      </footer>
    </div>
  );
};

export default App;
