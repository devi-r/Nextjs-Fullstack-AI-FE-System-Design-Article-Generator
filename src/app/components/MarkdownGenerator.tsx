"use client";

import React from "react";
import { Clipboard, Check } from "lucide-react";
import { Header } from "./Header";
import { SystemInputForm } from "./SystemInputForm";
import { MarkdownSkeleton } from "./MarkdownSkeleton";
import { ErrorDisplay } from "./ErrorDisplay";
import { ParagraphRow } from "./ParagraphRow";
import { useMarkdownGenerator } from "../hooks/useMarkdownGenerator";

export default function MarkdownGenerator(): React.JSX.Element {
  const {
    systemName,
    isLoading,
    error,
    copied,
    promptCount,
    canGenerate,
    displayedContent,
    currentMessageIndex,
    thinkingMessages,
    articleParagraphs,
    parentRef,
    rowVirtualizer,
    setSystemName,
    generateMarkdown,
    handleCopy,
  } = useMarkdownGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateMarkdown(systemName);
  };

  const handleAutoSubmit = async (systemName: string) => {
    await generateMarkdown(systemName);
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gray-900 text-gray-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        <Header />

        <SystemInputForm
          systemName={systemName}
          isLoading={isLoading}
          canGenerate={canGenerate}
          promptCount={promptCount}
          onSystemNameChange={setSystemName}
          onSubmit={handleSubmit}
          onAutoSubmit={handleAutoSubmit}
        />

        {/* Output Area */}
        <div className="w-full mt-8 text-left min-h-[500px]">
          {/* --- Loading State --- */}
          {isLoading && !displayedContent && (
            <MarkdownSkeleton
              currentMessageIndex={currentMessageIndex}
              thinkingMessages={thinkingMessages}
            />
          )}

          {error && !isLoading && <ErrorDisplay error={error} />}

          {/* --- Virtualized Display State --- */}
          {displayedContent && articleParagraphs.length > 0 && (
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl shadow-2xl">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200">
                  Generated Document
                </h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-sm transition-colors disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* VIRTUALIZATION CONTAINER */}
              <div
                ref={parentRef}
                className="h-[60vh] overflow-y-auto p-6"
                style={{ contain: "strict" }}
              >
                {/* Inner container for total scroll height */}
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* STEP 3: Render the list using our new, self-measuring ParagraphRow component. */}
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                    <ParagraphRow
                      key={virtualItem.key}
                      virtualizer={rowVirtualizer}
                      virtualItem={virtualItem}
                      paragraphText={articleParagraphs[virtualItem.index]}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
