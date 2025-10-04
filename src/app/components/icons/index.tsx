import { Brain, Sparkles, Clipboard, Check, Loader2 } from "lucide-react";
import { IconProps } from "../../types";

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
  <Brain className={className} size={24} />
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <Sparkles className={className} size={24} />
);

export const ClipboardIcon: React.FC<IconProps> = ({ className }) => (
  <Clipboard className={className} size={24} />
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <Check className={className} size={24} />
);

export const LoadingSpinner: React.FC<IconProps> = ({ className }) => (
  <Loader2
    className={`animate-spin -ml-1 mr-2 h-5 w-5 text-white ${className || ""}`}
    size={20}
  />
);
