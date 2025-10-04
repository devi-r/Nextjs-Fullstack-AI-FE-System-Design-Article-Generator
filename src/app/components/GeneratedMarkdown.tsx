import React, { useRef } from "react";
import { CopyButton } from "./CopyButton";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface GeneratedMarkdownProps {
  markdown: string;
  copied: boolean;
  onCopy: () => void;
  isStreamingComplete?: boolean;
}

export const GeneratedMarkdown: React.FC<GeneratedMarkdownProps> = ({
  markdown,
  copied,
  onCopy,
  isStreamingComplete = true,
}) => {
  const articleRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (articleRef.current) {
      // Using document.execCommand as a fallback for iframe environments
      const textArea = document.createElement("textarea");
      textArea.value = articleRef.current.innerText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        onCopy();
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="mt-4 sm:mt-8 text-left bg-gray-800/60 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-3 sm:p-4 bg-gray-900/50 border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
          Generated Article
        </h2>
        <CopyButton copied={copied} onCopy={handleCopy} />
      </div>
      <div ref={articleRef}>
        <MarkdownRenderer markdown={markdown} />
        {!isStreamingComplete && (
          <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
        )}
      </div>
    </div>
  );
};
