"use client";

import { useState, useEffect } from "react";

interface LoadingErrorProps {
  tabName: string;
  errorMessage?: string;
}

export default function LoadingError({ tabName, errorMessage }: LoadingErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const isColdStart =
    errorMessage?.includes("404") ||
    errorMessage?.includes("502") ||
    errorMessage?.includes("503") ||
    errorMessage?.includes("504");

  useEffect(() => {
    if (isColdStart) {
      const timer = setTimeout(() => {
        setIsRetrying(true);
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isColdStart]);

  return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">
        {isRetrying
          ? `Loading ${tabName} data...`
          : `Unable to load ${tabName} data`}
      </p>
      <p className="text-gray-600 text-sm mt-2">
        {isColdStart
          ? "The server is waking up. Retrying automatically..."
          : errorMessage || "Try again in a moment."}
      </p>
      {!isRetrying && (
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm"
        >
          Retry Now
        </button>
      )}
      {isRetrying && (
        <div className="mt-4 animate-pulse text-gray-500 text-sm">
          Connecting to server...
        </div>
      )}
    </div>
  );
}
