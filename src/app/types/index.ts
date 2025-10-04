export interface MarkdownGeneratorState {
  systemName: string;
  isLoading: boolean;
  error: string;
  copied: boolean;
}

export interface MarkdownGeneratorActions {
  setSystemName: (name: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setCopied: (copied: boolean) => void;
}

export interface IconProps {
  className?: string;
}

export interface ApiResponse {
  ok: boolean;
  json: () => Promise<{ markdown: string }>;
}
