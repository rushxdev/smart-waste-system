import React from "react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-xl shadow-md p-8">
      {/* Truck Icon with Clock */}
      <div className="mb-8">
        <svg
          width="150"
          height="150"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#3C4E1E]"
        >
          {/* Truck body */}
          <rect x="30" y="90" width="80" height="50" fill="currentColor" stroke="currentColor" strokeWidth="3"/>
          {/* Truck cabin */}
          <rect x="110" y="100" width="40" height="40" fill="currentColor" stroke="currentColor" strokeWidth="3"/>
          {/* Truck wheels */}
          <circle cx="55" cy="145" r="12" fill="white" stroke="currentColor" strokeWidth="3"/>
          <circle cx="125" cy="145" r="12" fill="white" stroke="currentColor" strokeWidth="3"/>
          {/* Clock */}
          <circle cx="140" cy="60" r="35" fill="white" stroke="currentColor" strokeWidth="3"/>
          <line x1="140" y1="60" x2="140" y2="40" stroke="currentColor" strokeWidth="3"/>
          <line x1="140" y1="60" x2="155" y2="70" stroke="currentColor" strokeWidth="3"/>
          {/* Clock center dot */}
          <circle cx="140" cy="60" r="3" fill="currentColor"/>
        </svg>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-[#3C4E1E] text-white flex items-center justify-center font-semibold">
          1
        </div>
        <span className="text-gray-600 font-medium">Schedule Your Pickup</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Schedule Your Pickup
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        Let us know what type of waste you want collected. Select the pickup slot and confirm to keep your surroundings clean and green
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        <div className="w-10 h-1 bg-[#3C4E1E] rounded-full"></div>
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Schedule Now Button */}
      <button
        onClick={onNext}
        className="bg-[#3C4E1E] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#2d3a16] transition duration-200 shadow-md"
      >
        Schedule Now
      </button>
    </div>
  );
};
