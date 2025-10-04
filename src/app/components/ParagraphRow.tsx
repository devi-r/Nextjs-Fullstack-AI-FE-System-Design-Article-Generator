import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Virtualizer } from "@tanstack/react-virtual";

interface ParagraphRowProps {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualItem: any;
  paragraphText: string;
}

// STEP 1: Create a dedicated component for each virtualized row.
// This component is responsible for measuring itself and reporting its height.
export const ParagraphRow: React.FC<ParagraphRowProps> = ({
  virtualizer,
  virtualItem,
  paragraphText,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  // This effect runs when the component mounts and reports its size.
  useEffect(() => {
    if (elementRef.current) {
      // The measureElement function is the key to dynamic heights.
      virtualizer.measureElement(elementRef.current);
    }
  }, [virtualizer]); // Re-run if the virtualizer instance changes

  return (
    <div
      ref={elementRef}
      key={virtualItem.key}
      data-index={virtualItem.index}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${virtualItem.start}px)`,
        padding: "10px 0", // Adds vertical space between paragraphs
      }}
    >
      <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-gray-100 prose-a:text-purple-400 prose-strong:text-pink-400 prose-code:text-pink-400 prose-code:bg-gray-900/50 prose-code:rounded-sm prose-code:px-1.5 prose-code:py-1 prose-pre:bg-gray-900/50">
        <ReactMarkdown>{paragraphText}</ReactMarkdown>
      </div>
    </div>
  );
};
