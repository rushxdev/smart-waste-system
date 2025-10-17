import React from "react";
import type { FormData } from "./FormStep";

interface PaymentStepProps {
  formData: FormData;
  onBack: () => void;
  onProceed: () => void;
  loading: boolean;
}

// Pricing calculator following Single Responsibility Principle
const calculateServiceFee = (wasteType: string): number => {
  const baseFees: Record<string, number> = {
    "Electrical Waste": 500,
    "Plastic": 300,
    "Organic": 200,
    "Paper": 250,
    "Glass": 350,
    "Metal": 400,
    "Mixed Waste": 450
  };
  return baseFees[wasteType] || 300;
};

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  onBack,
  onProceed,
  loading
}) => {
  const serviceFee = calculateServiceFee(formData.wasteType);
  const ecoCoinsApplied = 0; // Future feature
  const finalAmount = serviceFee - ecoCoinsApplied;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
      {/* Header with Icon */}
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#3C4E1E]"
          >
            {/* Hand giving icon */}
            <path
              d="M30 50 L30 60 C30 65 35 70 40 70 L60 70 C65 70 70 65 70 60 L70 40"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <circle cx="70" cy="35" r="8" fill="currentColor" />
            <path
              d="M40 50 L40 40 M50 50 L50 35 M60 50 L60 40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Checkmark badge */}
            <circle cx="75" cy="70" r="12" fill="#4ade80" />
            <path
              d="M70 70 L73 73 L80 66"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Pricing & Summary</h1>
      </div>

      {/* Summary Details */}
      <div className="space-y-4 mb-6">
        {/* Waste Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Waste Type</label>
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 font-medium">
            {formData.wasteType}
          </div>
        </div>

        {/* Pickup Date & Time */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Pickup Date & Time
          </label>
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 font-medium">
            {new Date(formData.preferredDate).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric"
            })}{" "}
            - {formData.preferredTime}
          </div>
        </div>

        {/* Service Fee */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Service Fee</label>
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 font-medium">
            LKR {serviceFee.toFixed(2)}
          </div>
        </div>

        {/* EcoCoins Applied */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            EcoCoins Applied
          </label>
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 font-medium">
            LKR {ecoCoinsApplied.toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * Eco-points package are free. You'll also earn points by completing
            eco-friendly tasks.
          </p>
        </div>

        {/* Final Amount */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Final Amount</label>
          <div className="bg-[#3C4E1E] px-4 py-3 rounded-lg text-white font-bold text-lg">
            LKR {finalAmount.toFixed(2)}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Payment Method
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition"
            >
              0578 8803 2597
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-[#4ade80] text-white rounded-lg font-medium hover:bg-[#22c55e] transition flex items-center gap-2"
            >
              <span>EcoCoins</span>
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center py-4">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        <div className="w-10 h-1 bg-[#3C4E1E] rounded-full"></div>
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 border-2 border-[#3C4E1E] text-[#3C4E1E] rounded-lg font-semibold hover:bg-gray-50 transition duration-200 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onProceed}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#3C4E1E] text-white rounded-lg font-semibold hover:bg-[#2d3a16] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Proceed"}
        </button>
      </div>
    </div>
  );
};
