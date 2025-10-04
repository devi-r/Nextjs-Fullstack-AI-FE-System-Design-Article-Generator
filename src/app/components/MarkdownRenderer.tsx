import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  markdown: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
}) => {
  return (
    <article className="p-4 sm:p-6 prose prose-invert prose-sm sm:prose-lg max-w-none prose-h1:text-purple-400 prose-h2:border-b prose-h2:border-gray-600 prose-a:text-pink-400 hover:prose-a:text-pink-300 prose-strong:text-gray-100">
      <ReactMarkdown>{markdown}</ReactMarkdown>
      <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
    </article>
  );
};
