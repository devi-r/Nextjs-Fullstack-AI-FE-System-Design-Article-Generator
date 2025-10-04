import React from "react";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-left">
    <p className="font-semibold">An Error Occurred</p>
    <p>{error}</p>
  </div>
);
