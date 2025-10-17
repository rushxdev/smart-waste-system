import React, { useState } from "react";
import type { PaymentDetails } from "../../../services/paymentService";

interface AddCardStepProps {
  onSubmit: (paymentDetails: PaymentDetails) => void;
  onBack: () => void;
  loading: boolean;
}

// Card validation utility following Single Responsibility Principle
const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
};

const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

export const AddCardStep: React.FC<AddCardStepProps> = ({
  onSubmit,
  onBack,
  loading
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paymentDetails);
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setPaymentDetails((prev) => ({
        ...prev,
        cardNumber: cleaned
      }));
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) {
      setPaymentDetails((prev) => ({
        ...prev,
        expiryDate: cleaned
      }));
    }
  };

  const handleCvvChange = (value: string) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setPaymentDetails((prev) => ({
        ...prev,
        cvv: value
      }));
    }
  };

  const displayCardNumber = formatCardNumber(paymentDetails.cardNumber);
  const displayExpiryDate = formatExpiryDate(paymentDetails.expiryDate);

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Card</h1>
      </div>

      {/* Card Preview */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-md h-48 bg-gradient-to-br from-[#3C4E1E] to-[#5a7329] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          {/* Card chip */}
          <div className="absolute top-6 right-6">
            <svg
              width="40"
              height="32"
              viewBox="0 0 40 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="40"
                height="32"
                rx="4"
                fill="white"
                fillOpacity="0.3"
              />
              <rect x="8" y="8" width="12" height="8" rx="1" fill="white" fillOpacity="0.5" />
              <rect x="20" y="8" width="12" height="8" rx="1" fill="white" fillOpacity="0.5" />
            </svg>
          </div>

          {/* Card Number */}
          <div className="absolute bottom-20 left-6 right-6">
            <div className="text-xl tracking-wider font-mono">
              {displayCardNumber || "0000 0000 0000 0000"}
            </div>
          </div>

          {/* Card Holder Name and Expiry */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <div className="text-xs opacity-70 mb-1">Card Holder Name</div>
              <div className="font-medium text-sm">
                {paymentDetails.cardHolderName || "Sakith Chanlaka"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-70 mb-1">Expiry Date</div>
              <div className="font-medium text-sm">
                {displayExpiryDate || "04/28"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Holder Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            value={paymentDetails.cardHolderName}
            onChange={(e) =>
              setPaymentDetails((prev) => ({
                ...prev,
                cardHolderName: e.target.value
              }))
            }
            placeholder="Enter card holder name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={displayCardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="0000 0000 0000 0000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent font-mono tracking-wider"
            required
          />
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={displayExpiryDate}
              onChange={(e) => handleExpiryChange(e.target.value)}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">CVV</label>
            <input
              type="password"
              value={paymentDetails.cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              placeholder="0000"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center py-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-10 h-1 bg-[#3C4E1E] rounded-full"></div>
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
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#3C4E1E] text-white rounded-lg font-semibold hover:bg-[#2d3a16] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Save Card"}
          </button>
        </div>
      </form>
    </div>
  );
};
