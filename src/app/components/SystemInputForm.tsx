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
}

export const SystemInputForm: React.FC<SystemInputFormProps> = ({
  systemName,
  isLoading,
  canGenerate,
  promptCount,
  onSystemNameChange,
  onSubmit,
}) => {
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
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-xs sm:text-sm"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="hidden sm:inline">Generating...</span>
              <span className="sm:hidden">Gen</span>
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
    </form>
  );
};
