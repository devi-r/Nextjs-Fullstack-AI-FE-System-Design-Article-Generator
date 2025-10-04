import React from "react";
import { BrainCircuitIcon } from "./icons";

export const Header: React.FC = () => {
  return (
    <>
      {/* Header Icon */}
      <div className="p-2 border-2 border-purple-500/30 bg-gray-800/50 rounded-full mb-6 shadow-lg">
        <BrainCircuitIcon className="w-8 h-8 text-purple-400" />
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        Frontend System Design
      </h1>

      {/* Description */}
      <p className="mt-3 text-sm md:text-lg text-gray-400 max-w-xl">
        Enter the name of a system (e.g., Netflix, Instagram) and let AI
        generate a comprehensive frontend system design article for you.
      </p>
    </>
  );
};
