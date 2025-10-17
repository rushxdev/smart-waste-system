import React, { useEffect } from "react";

interface SuccessStepProps {
  onComplete: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onComplete }) => {
  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-[#3C4E1E] to-[#5a7329] rounded-xl shadow-md p-8">
      {/* Success Badge */}
      <div className="mb-8 relative">
        {/* Outer badge */}
        <div className="w-40 h-40 bg-[#4ade80] rounded-full flex items-center justify-center animate-pulse">
          {/* Inner circle */}
          <div className="w-32 h-32 bg-[#86efac] rounded-full flex items-center justify-center">
            {/* Checkmark circle */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              {/* Checkmark */}
              <svg
                className="w-16 h-16 text-[#4ade80]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-4 text-center">
        Pickup Scheduled
      </h1>

      {/* Description */}
      <p className="text-white/90 text-center max-w-md mb-8 leading-relaxed">
        Your request has been received. Our collection team will arrive during your chosen slot.
      </p>

      {/* Manual return button (optional, in case auto-redirect fails) */}
      <button
        onClick={onComplete}
        className="bg-white text-[#3C4E1E] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 shadow-md"
      >
        Return to Dashboard
      </button>

      {/* Loading indicator */}
      <div className="mt-6 text-white/70 text-sm">
        Redirecting in 3 seconds...
      </div>
    </div>
  );
};
