import React, { useState, useEffect } from "react";
import type { ScheduleModalProps, NewSchedule } from "../types/teamOverview.types";
import { useScheduleValidation } from "../hooks/useScheduleValidation";

// Schedule Modal Component (Single Responsibility: Handle schedule creation and editing)
export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSchedule
}) => {
  const [newSchedule, setNewSchedule] = useState<NewSchedule>({
    name: "",
    date: "",
    time: "",
    city: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validationErrors, validateSchedule, clearFieldError, clearAllErrors } = useScheduleValidation();

  // Populate fields when editing a schedule
  useEffect(() => {
    if (editingSchedule) {
      setNewSchedule({
        name: editingSchedule.name,
        date: editingSchedule.date,
        time: editingSchedule.time,
        city: editingSchedule.city
      });
    } else {
      setNewSchedule({
        name: "",
        date: "",
        time: "",
        city: ""
      });
    }
  }, [editingSchedule, isOpen]);

  const handleInputChange = (field: keyof NewSchedule, value: string) => {
    setNewSchedule(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error when user starts typing
    clearFieldError(field);
  };

  const handleSave = async () => {
    if (!validateSchedule(newSchedule)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(newSchedule);
      handleClose();
    } catch (error) {
      // Error will be handled by parent component
      console.error("Error saving schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewSchedule({
      name: "",
      date: "",
      time: "",
      city: ""
    });
    clearAllErrors();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
        </h3>
        
        <div className="space-y-4">
          {/* Schedule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Name *
            </label>
            <input
              type="text"
              value={newSchedule.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Morning Collection"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={newSchedule.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.date && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.time && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.time}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={newSchedule.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Downtown"
            />
            {validationErrors.city && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isSubmitting 
              ? (editingSchedule ? "Updating..." : "Creating...") 
              : (editingSchedule ? "Update Schedule" : "Create Schedule")
            }
          </button>
        </div>
      </div>
    </div>
  );
};