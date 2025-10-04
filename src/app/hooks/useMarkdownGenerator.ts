import { useState, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // The final, complete article is now stored as an array of paragraphs
  const [articleParagraphs, setArticleParagraphs] = useState<string[]>([]);
  const fullArticleText = useRef<string>(""); // For the copy button

  const thinkingMessages = [
    "Drafting introduction...",
    "Consulting architectural patterns...",
    "Structuring arguments...",
    "Reviewing scalability concerns...",
    "Polishing the final draft...",
  ];

  // Ref to hold the queue of incoming text from the stream
  const textQueueRef = useRef<string[]>([]);
  // Ref to hold the animation frame request
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Ref for the scrollable container element
  const parentRef = useRef<HTMLDivElement>(null);

  // On initial component mount, check the localStorage for the count
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(PROMPT_COUNT_KEY);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      setPromptCount(count);
    } catch (e) {
      console.error("Could not read from localStorage", e);
      setPromptCount(0);
    }
  }, []);

  // Dynamic "thinking" message effect
  useEffect(() => {
    if (state.isLoading && !displayedContent) {
      let messageIndex = 0;
      setCurrentMessageIndex(0);

      const interval = setInterval(() => {
        messageIndex++;
        if (messageIndex < thinkingMessages.length) {
          setCurrentMessageIndex(messageIndex);
        }
        // If we've reached the last message, don't do anything - just stay there
      }, 2500);

      return () => clearInterval(interval);
    } else if (displayedContent) {
      // Reset message index when content starts displaying
      setCurrentMessageIndex(0);
    }
  }, [state.isLoading, displayedContent]);

  // TanStack Virtual hook setup
  const rowVirtualizer = useVirtualizer({
    count: articleParagraphs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Provide a reasonable base estimate for the initial render
    overscan: 5,
  });

  // A new effect to process the markdown string into paragraphs for virtualization
  useEffect(() => {
    if (displayedContent) {
      // Split the full text by double newlines to get paragraphs
      const paragraphs = displayedContent
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0);
      setArticleParagraphs(paragraphs);
      fullArticleText.current = displayedContent; // Store the full text for copying
    }
  }, [displayedContent]);

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

  const processQueue = () => {
    if (textQueueRef.current.length === 0) {
      // If the stream is done and the queue is empty, stop the animation
      if (isStreamingComplete) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }
        return;
      }
      // If the queue is empty but streaming isn't done, just wait for more data
      animationFrameRef.current = requestAnimationFrame(processQueue);
      return;
    }

    // Determine how many characters to pull from the queue
    const charsToProcess = Math.max(
      1,
      Math.floor(textQueueRef.current.join("").length / 10)
    ); // Process faster as queue grows
    let textToAppend = "";

    while (
      textToAppend.length < charsToProcess &&
      textQueueRef.current.length > 0
    ) {
      const firstChunk = textQueueRef.current[0];
      const remainingLength = charsToProcess - textToAppend.length;

      if (firstChunk.length <= remainingLength) {
        textToAppend += firstChunk;
        textQueueRef.current.shift();
      } else {
        textToAppend += firstChunk.substring(0, remainingLength);
        textQueueRef.current[0] = firstChunk.substring(remainingLength);
      }
    }

    setDisplayedContent((prev) => prev + textToAppend);

    animationFrameRef.current = requestAnimationFrame(processQueue);
  };

  const generateMarkdown = async (systemName: string): Promise<void> => {
    if (!canGenerate) {
      return;
    }

    if (!systemName.trim()) {
      setError("Please enter a system name.");
      return;
    }

    setIsLoading(true);
    setError("");
    setDisplayedContent("");
    textQueueRef.current = [];
    fullArticleText.current = "";
    setArticleParagraphs([]); // Reset the paragraph array
    setIsStreamingComplete(false);
    setCopied(false);

    // Start the animation loop
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(processQueue);
    }

    try {
      // 1. Make the fetch request to our backend API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemName }),
      });
      console.log("response", response);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // On successful request, increment the prompt count
      const newCount = promptCount + 1;
      setPromptCount(newCount);
      localStorage.setItem(PROMPT_COUNT_KEY, newCount.toString());

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsStreamingComplete(true);
          break;
        }
        const textChunk = decoder.decode(value, { stream: true });
        textQueueRef.current.push(textChunk);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setIsStreamingComplete(true); // Stop animation on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (fullArticleText.current) {
      navigator.clipboard.writeText(fullArticleText.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return {
    ...state,
    promptCount,
    canGenerate,
    displayedContent,
    isStreamingComplete,
    currentMessageIndex,
    thinkingMessages,
    articleParagraphs,
    fullArticleText,
    parentRef,
    rowVirtualizer,
    setSystemName,
    generateMarkdown,
    handleCopy,
  };
};
