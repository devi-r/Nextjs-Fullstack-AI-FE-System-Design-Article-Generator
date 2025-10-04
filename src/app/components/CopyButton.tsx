import React from "react";
import { ClipboardIcon, CheckIcon } from "./icons";

interface CopyButtonProps {
  copied: boolean;
  onCopy: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ copied, onCopy }) => (
  <button
    onClick={onCopy}
    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md transition-colors duration-200 disabled:opacity-50"
    disabled={copied}
  >
    {copied ? (
      <CheckIcon className="w-4 h-4 text-green-400" />
    ) : (
      <ClipboardIcon className="w-4 h-4" />
    )}
    {copied ? "Copied!" : "Copy"}
  </button>
);
