
import React from 'react';
// These imports will fail if types.ts and patternEngine.ts are not present in src/ or src/services/
import { PresentationData, Slide, PatternType, TwoPaneComparisonContent, ThreePaneParallelContent, LinearProcessContent } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { patternEngine } from '../services/patternEngine'; // Corrected import

interface SlidePreviewProps {
  presentation: PresentationData | null;
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ presentation, currentSlideIndex, setCurrentSlideIndex }) => {
  if (!presentation || !presentation.slides || presentation.slides.length === 0) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-slate-700 rounded-lg shadow-inner text-center text-gray-500 dark:text-gray-400">
        <p>生成されたスライドがありません。</p>
        <p className="mt-2 text-sm">入力を送信してスライドを生成してください。</p>
      </div>
    );
  }

  const currentSlide: Slide | undefined = presentation.slides[currentSlideIndex];

  if (!currentSlide) {
    return <div className="p-4 text-center text-red-500">現在のスライドが見つかりません。</div>;
  }

  const renderSlideContent = (slide: Slide) => {
    const RendererComponent = patternEngine.getRenderer(slide.pattern_type as PatternType); // Use patternEngine.getRenderer
    
    if (!RendererComponent) {
        const UnknownPatternComponent = () => React.createElement('div', { className: 'text-red-600 dark:text-red-400 p-4' }, \`Unsupported slide pattern: \${slide.pattern_type}\`);
        return <UnknownPatternComponent />;
    }

    // Cast content based on pattern_type for the renderer
    switch (slide.pattern_type) {
        case '2pane_comparison':
            return <RendererComponent content={slide.content as TwoPaneComparisonContent} />;
        case '3pane_parallel':
            return <RendererComponent content={slide.content as ThreePaneParallelContent} />;
        case 'linear_process':
            return <RendererComponent content={slide.content as LinearProcessContent} />;
        default:
             const UnknownPatternComponentWithCheck = () => React.createElement('div', { className: 'text-red-600 dark:text-red-400 p-4' }, \`Unsupported slide pattern: \${slide.pattern_type}\`);
            return <UnknownPatternComponentWithCheck />;
    }
  };

  const totalSlides = presentation.slides.length;

  const goToNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">スライドプレビュー</h2>
      
      <div 
        className="slide-container w-full max-w-[800px] h-auto aspect-[4/3] bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg shadow-xl p-6 md:p-8 box-border flex flex-col mx-auto overflow-hidden relative"
      >
        <div className="mb-4 text-center">
            <h1 className="slide-title text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 leading-tight">
                {presentation.title}
            </h1>
            {presentation.description && (
                <p className="text-sm md:text-md text-gray-600 dark:text-gray-300 mt-1">{presentation.description}</p>
            )}
        </div>
        
        <div className="flex-grow overflow-y-auto p-1 min-h-[300px] fancy-scrollbar">
            {renderSlideContent(currentSlide)}
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
            {currentSlideIndex + 1} / {totalSlides}
        </div>
      </div>

      {totalSlides > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={goToPrevSlide}
            className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full text-gray-700 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            スライド {currentSlideIndex + 1} / {totalSlides}
          </span>
          <button
            onClick={goToNextSlide}
            className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full text-gray-700 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SlidePreview;
