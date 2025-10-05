import React from "react";
import { SparklesIcon, LoadingSpinner } from "./icons";
import { MAX_PROMPTS } from "../constants";

interface SystemInputFormProps {
  systemName: string;
  isLoading: boolean;
  canGenerate: boolean;
  promptCount: number;
  onSystemNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAutoSubmit: (systemName: string) => void;
}

export const SystemInputForm: React.FC<SystemInputFormProps> = ({
  systemName,
  isLoading,
  canGenerate,
  promptCount,
  onSystemNameChange,
  onSubmit,
  onAutoSubmit,
}) => {
  const suggestionChips = [
    { label: "Try Netflix", value: "Netflix" },
    { label: "Try Canva", value: "Canva" },
    { label: "Try Uber", value: "Uber" },
  ];

  const handleChipClick = (value: string) => {
    if (!isLoading && canGenerate) {
      onSystemNameChange(value);
      onAutoSubmit(value);
    }
  };
  return (
    <form onSubmit={onSubmit} className="w-full mt-10">
      <div className="relative">
        <input
          type="text"
          value={systemName}
          onChange={(e) => onSystemNameChange(e.target.value)}
          placeholder="Enter a system name like 'X' or 'TikTok'"
          disabled={isLoading}
          className="w-full pl-4 sm:pl-5 pr-24 sm:pr-36 py-3 sm:py-4 text-sm sm:text-base bg-gray-800/80 border border-gray-700 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !canGenerate}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg text-xs sm:text-sm"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="hidden sm:inline">Generating...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">
                Generate ({MAX_PROMPTS - promptCount} left)
              </span>
              <span className="sm:hidden">Go</span>
            </>
          )}
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {suggestionChips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => handleChipClick(chip.value)}
            disabled={isLoading || !canGenerate}
            className="px-3 py-1.5 text-sm bg-gray-800/60 border border-gray-600 rounded-full hover:bg-gray-700/60 hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-300 hover:text-gray-100"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </form>
  );
};
