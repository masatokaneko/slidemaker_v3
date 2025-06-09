
import React, { useState } from 'react';
import { MAX_INPUT_LENGTH } from '../utils/constants';
import { UsageMetrics, YamlOutput, ApiError, Candidate, GroundingChunkWeb } from '../types'; 
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface YamlGeneratorInputProps {
  onGenerate: (inputText: string) => Promise<void>;
  isLoading: boolean;
  error: ApiError | null;
  clearError: () => void;
  usageMetrics: UsageMetrics;
  rawYaml: YamlOutput | null;
  groundingMetadata: Candidate[] | null; 
}

const YamlGeneratorInput: React.FC<YamlGeneratorInputProps> = ({
  onGenerate,
  isLoading,
  error,
  clearError,
  usageMetrics,
  rawYaml,
  groundingMetadata
}) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      return;
    }
    onGenerate(inputText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    clearError(); 
    setInputText(e.target.value);
  };

  const webChunks = groundingMetadata?.flatMap(candidate => candidate.groundingMetadata?.groundingChunks ?? [])
    .map(chunk => chunk.web)
    .filter((web): web is GroundingChunkWeb => web !== undefined && web !== null && web.uri !== undefined);


  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-md border border-slate-700"> {/* Adjusted background for dark theme */}
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">プレゼンテーション内容入力</h2>
      <p className="text-sm text-slate-400 mb-4">
        日本語でプレゼンテーションの概要や比較したい内容を入力してください。(最大 {MAX_INPUT_LENGTH} 文字)
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="例: スマートフォンAとスマートフォンBの機能、価格、デザインを比較し、どちらがどのようなユーザーに適しているか説明してください。"
          className="w-full h-40 p-3 border border-slate-600 bg-slate-700 text-gray-200 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-shadow resize-none placeholder-slate-500"
          maxLength={MAX_INPUT_LENGTH}
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-3 mb-3">
          <p className="text-xs text-slate-500">
            {inputText.length} / {MAX_INPUT_LENGTH} 文字
          </p>
          <p className="text-xs text-slate-500">
            リクエスト回数: {usageMetrics.requestsMade} / {usageMetrics.maxRequestsPerHour}
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-3 px-4 rounded-md transition-colors disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '生成中...' : 'スライド構成を生成'}
        </button>
      </form>

      {isLoading && <LoadingSpinner text="AIがスライド構成を考えています..." />}
      <ErrorMessage error={error} onDismiss={clearError} />

      {rawYaml && !isLoading && !error && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">生成されたYAML:</h3>
          <pre className="bg-slate-700 p-4 rounded-md text-sm text-gray-300 overflow-x-auto max-h-96 whitespace-pre-wrap break-all fancy-scrollbar"> {/* Added custom scrollbar class */}
            {rawYaml}
          </pre>
        </div>
      )}
      {webChunks && webChunks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">参照元:</h3>
          <ul className="list-disc list-inside space-y-1">
            {webChunks.map((chunk, index) => (
              chunk.uri && ( 
                <li key={index} className="text-sm text-slate-400">
                  <a href={chunk.uri} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    {chunk.title || chunk.uri}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YamlGeneratorInput;
