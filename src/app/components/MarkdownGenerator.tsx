"use client";

import React from "react";
import { Header } from "./Header";
import { SystemInputForm } from "./SystemInputForm";
import { MarkdownSkeleton } from "./MarkdownSkeleton";
import { ErrorDisplay } from "./ErrorDisplay";
import { GeneratedMarkdown } from "./GeneratedMarkdown";
import { useMarkdownGenerator } from "../hooks/useMarkdownGenerator";

export default function MarkdownGenerator(): React.JSX.Element {
  const {
    systemName,
    markdownContent,
    isLoading,
    error,
    copied,
    promptCount,
    canGenerate,
    setSystemName,
    generateMarkdown,
    handleCopy,
  } = useMarkdownGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        />

        {/* Output Area */}
        <div className="w-full mt-8">
          {isLoading && <MarkdownSkeleton />}

          {error && !isLoading && <ErrorDisplay error={error} />}

          {markdownContent && !isLoading && (
            <GeneratedMarkdown
              markdown={markdownContent}
              copied={copied}
              onCopy={handleCopy}
            />
          )}
        </div>
      </div>
    </main>
  );
}
