import { useState, useEffect } from "react";
import { MarkdownGeneratorState, ApiResponse } from "../types";
import { MAX_PROMPTS, PROMPT_COUNT_KEY } from "../constants";

export const useMarkdownGenerator = () => {
  const [state, setState] = useState<MarkdownGeneratorState>({
    systemName: "",
    markdownContent: "",
    isLoading: false,
    error: "",
    copied: false,
  });
  const [promptCount, setPromptCount] = useState(0);

  // On initial component mount, check the localStorage for the count
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(PROMPT_COUNT_KEY);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      setPromptCount(count);
      if (count >= MAX_PROMPTS) {
        setError(
          `You have used all ${MAX_PROMPTS} of your free generations for this browser.`
        );
      }
    } catch (e) {
      console.error("Could not read from localStorage", e);
      setPromptCount(0);
    }
  }, []);

  const setSystemName = (name: string) => {
    setState((prev) => ({ ...prev, systemName: name }));
  };

  const setMarkdownContent = (markdownContent: string) => {
    setState((prev) => ({ ...prev, markdownContent }));
  };

  const setIsLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error }));
  };

  const setCopied = (copied: boolean) => {
    setState((prev) => ({ ...prev, copied }));
  };

  const canGenerate = promptCount < MAX_PROMPTS;

  const generateMarkdown = async (systemName: string): Promise<void> => {
    if (!canGenerate) {
      setError(`You have no generations left.`);
      return;
    }

    if (!systemName.trim()) {
      setError("Please enter a system name.");
      return;
    }

    setIsLoading(true);
    setMarkdownContent("");
    setError("");
    setCopied(false);

    try {
      // 1. Make the fetch request to our backend API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemName }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // IMPORTANT: Only increment on a successful stream start
      const newCount = promptCount + 1;
      setPromptCount(newCount);
      localStorage.setItem(PROMPT_COUNT_KEY, newCount.toString());

      // 2. Get the stream reader and decoder
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 3. Start the consumption loop
      while (true) {
        // 4. Read a chunk from the stream
        const { value, done } = await reader.read();

        // 5. Check if the stream is finished
        if (done) {
          break;
        }

        // 6. Decode the chunk and update the React state
        const textChunk = decoder.decode(value, { stream: true });
        setState((prev) => ({
          ...prev,
          markdownContent: prev.markdownContent + textChunk,
        }));
      }

      // After the final successful prompt, show the limit message
      if (newCount >= MAX_PROMPTS) {
        setError(
          `You have used all ${MAX_PROMPTS} of your free generations for this browser.`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return {
    ...state,
    promptCount,
    canGenerate,
    setSystemName,
    generateMarkdown,
    handleCopy,
  };
};
