import React from "react";

export const MarkdownSkeleton: React.FC = () => (
  <div className="mt-8 w-full animate-pulse">
    <div className="h-8 bg-gray-700 rounded-md w-3/4 mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-700 rounded-md w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded-md w-full"></div>
      <div className="h-6 bg-gray-700 rounded-md w-1/2 my-6"></div>
      <div className="h-4 bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-700 rounded-md w-3/4"></div>
    </div>
  </div>
);
