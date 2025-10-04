import React from "react";

interface MarkdownSkeletonProps {
  currentMessageIndex?: number;
  thinkingMessages?: string[];
}

export const MarkdownSkeleton: React.FC<MarkdownSkeletonProps> = ({
  currentMessageIndex = 0,
  thinkingMessages = ["Loading..."],
}) => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-800/60 border border-gray-700 rounded-xl p-6">
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-600 h-12 w-12 mb-4 animate-spin border-t-purple-500"></div>
    <p className="text-gray-300 text-lg transition-opacity duration-500">
      {thinkingMessages[currentMessageIndex]}
    </p>
  </div>
);
