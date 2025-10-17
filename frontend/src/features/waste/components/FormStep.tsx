import React, { useState } from "react";

interface FormStepProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  loading: boolean;
}

export interface FormData {
  wasteType: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  notes: string;
}

const WASTE_TYPES = [
  "Electrical Waste",
  "Plastic",
  "Organic",
  "Paper",
  "Glass",
  "Metal",
  "Mixed Waste"
];

const TIME_SLOTS = [
  { label: "8:00AM - 12:00PM", value: "8:00AM - 12:00PM" },
  { label: "10:30AM - 1:00PM", value: "10:30AM - 1:00PM" },
  { label: "3:00PM - 7:00PM", value: "3:00PM - 7:00PM" }
];

export const FormStep: React.FC<FormStepProps> = ({ onSubmit, onBack, loading }) => {
  const [formData, setFormData] = useState<FormData>({
    wasteType: "",
    preferredDate: "",
    preferredTime: "",
    address: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Schedule a waste collection
        </h1>
        <p className="text-gray-600 text-sm">
          Choose the type of waste and a convenient pickup time. Our team will handle the rest and keep your surroundings clean
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Waste Type Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Waste Type
          </label>
          <div className="relative">
            <select
              value={formData.wasteType}
              onChange={(e) => handleChange("wasteType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent"
              required
            >
              <option value="">Select waste type</option>
              {WASTE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Pickup Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleChange("preferredDate", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Time Slot
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => handleChange("preferredTime", slot.value)}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition duration-200 ${
                  formData.preferredTime === slot.value
                    ? "bg-[#3C4E1E] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Any special instructions..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4E1E] focus:border-transparent resize-none"
          />
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center py-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-10 h-1 bg-[#3C4E1E] rounded-full"></div>
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
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
            type="submit"
            disabled={loading || !formData.preferredTime}
            className="flex-1 px-6 py-3 bg-[#3C4E1E] text-white rounded-lg font-semibold hover:bg-[#2d3a16] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};
