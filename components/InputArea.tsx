
import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button'; 
import { IconButton } from '../components/ui/IconButton';
import { MAX_INPUT_LENGTH } from '../constants';
import type { AISuggestion } from '../types';

interface InputAreaProps {
  onGenerate: (promptText: string) => void;
  isLoading: boolean;
  // New props for advanced AI features
  onGenerateFromImage: (imageFile: File, objective: string) => Promise<void>;
  isGeneratingFromImage: boolean;
  onGetContentSuggestions: (text: string) => Promise<void>;
  isFetchingSuggestions: boolean;
  onImageFileSelected: (file: File | null) => void;
  processedImageFile: File | null;
  imageProcessingError: string | null;
  altText?: string | null;
  isGeneratingAltText?: boolean;
  onGenerateAltText?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
    onGenerate, 
    isLoading,
    onGenerateFromImage,
    isGeneratingFromImage,
    onGetContentSuggestions,
    isFetchingSuggestions,
    onImageFileSelected,
    processedImageFile,
    imageProcessingError,
    altText,
    isGeneratingAltText,
    onGenerateAltText
}) => {
  const [promptText, setPromptText] = useState<string>('');
  const [imageObjective, setImageObjective] = useState<string>('Create a slide summarizing this image.');
  const charsLeft = MAX_INPUT_LENGTH - promptText.length;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim() && !isLoading) {
      onGenerate(promptText);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageFileSelected(file);
    } else {
      onImageFileSelected(null);
    }
  };

  const handleImageGenerate = async () => {
    if (processedImageFile) {
        await onGenerateFromImage(processedImageFile, imageObjective);
    }
  };
  
  const handleGetSuggestions = async () => {
    if (promptText.trim()) {
        await onGetContentSuggestions(promptText);
    }
  };


  return (
    <div className="space-y-4 flex flex-col flex-grow">
      {/* Text Input Section */}
      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-text-secondary mb-1">
            Enter presentation topic (Japanese) or get suggestions:
          </label>
          <textarea
            id="prompt-input"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="例：弊社の新製品Xと競合製品Yの機能比較について..."
            rows={6}
            className="w-full p-3 border border-border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-short text-sm bg-surface text-text-primary resize-y"
            disabled={isLoading || isGeneratingFromImage}
            maxLength={MAX_INPUT_LENGTH}
            aria-describedby="char-count-info"
          />
          <div id="char-count-info" className="mt-1.5 text-xs flex justify-between">
              <span className="text-text-disabled">
                  Describe your content clearly.
              </span>
              <span className={`font-medium ${charsLeft < 0 ? 'text-error' : charsLeft < MAX_INPUT_LENGTH * 0.1 ? 'text-warning' : 'text-text-disabled'}`}>
                  {charsLeft} characters remaining
              </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button
                type="submit"
                disabled={isLoading || isGeneratingFromImage || !promptText.trim() || charsLeft < 0}
                isLoading={isLoading}
                leftIcon={!isLoading ? <Send size={18} /> : undefined}
                className="w-full sm:flex-1"
                size="md"
            >
                Generate from Text
            </Button>
            <Button
                type="button"
                onClick={handleGetSuggestions}
                disabled={isFetchingSuggestions || !promptText.trim()}
                isLoading={isFetchingSuggestions}
                leftIcon={!isFetchingSuggestions ? <Lightbulb size={18} /> : undefined}
                variant="outline"
                className="w-full sm:flex-1"
                size="md"
            >
                Get Suggestions
            </Button>
        </div>
      </form>

      {/* Image Input Section */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-text-secondary">Generate from Image:</h3>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id="image-upload-input"
        />
        <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<ImageIcon size={18} />}
            className="w-full"
            size="md"
        >
          {processedImageFile ? `Change Image: ${processedImageFile.name.substring(0,25)}${processedImageFile.name.length > 25 ? '...' : ''}` : "Upload Image (PNG, JPG, WebP)"}
        </Button>

        {imageProcessingError && <p className="text-xs text-error">{imageProcessingError}</p>}

        {processedImageFile && !imageProcessingError && (
          <div className="space-y-3 p-3 border border-border rounded-md bg-surface-alt">
            <div className="flex items-center space-x-3">
                <img 
                    src={URL.createObjectURL(processedImageFile)} 
                    alt="Uploaded preview" 
                    className="w-16 h-16 object-cover rounded-md border border-border"
                />
                <div className="text-xs text-text-secondary flex-grow">
                    <p className="font-medium text-text-primary line-clamp-1">{processedImageFile.name}</p>
                    <p>{(processedImageFile.size / 1024).toFixed(1)} KB</p>
                    <p>{processedImageFile.type}</p>
                </div>
            </div>
             {onGenerateAltText && (
                <div className="flex items-center justify-between">
                    {altText && !isGeneratingAltText && <p className="text-xs text-success italic truncate flex-1 mr-2" title={altText}>Alt: "{altText}"</p>}
                    {!altText && isGeneratingAltText && <div className="flex items-center text-xs text-text-disabled"><Loader2 size={14} className="animate-spin mr-1"/>Generating alt text...</div>}
                    {!altText && !isGeneratingAltText && altText !== null && <p className="text-xs text-text-disabled italic">No alt text yet.</p>}
                    <Button 
                        size="sm" variant="outline" 
                        onClick={onGenerateAltText} 
                        isLoading={isGeneratingAltText}
                        disabled={isGeneratingAltText}
                    >
                        {altText ? "Regenerate Alt" : "Generate Alt Text"}
                    </Button>
                </div>
            )}

            <textarea
              value={imageObjective}
              onChange={(e) => setImageObjective(e.target.value)}
              placeholder="Objective for this image (e.g., summarize key points)"
              rows={2}
              className="w-full p-2 border border-border rounded-md text-sm bg-surface text-text-primary focus:ring-1 focus:ring-primary"
              disabled={isGeneratingFromImage || isLoading}
            />
            <Button
              onClick={handleImageGenerate}
              disabled={isGeneratingFromImage || isLoading || !processedImageFile || !imageObjective.trim()}
              isLoading={isGeneratingFromImage}
              leftIcon={!isGeneratingFromImage ? <Sparkles size={18} /> : undefined}
              className="w-full"
              size="md"
            >
              Generate from Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
