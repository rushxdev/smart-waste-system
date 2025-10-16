import { useState } from "react";
import type { NewSchedule, ValidationErrors } from "../types/teamOverview.types";

// Custom hook for schedule validation (Single Responsibility Principle)
export const useScheduleValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateSchedule = (schedule: NewSchedule): boolean => {
    const errors: ValidationErrors = {};
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // Check required fields
    if (!schedule.name.trim()) {
      errors.name = "Schedule name is required";
    }

    if (!schedule.date) {
      errors.date = "Date is required";
    } else {
      // Check if date is in the future
      if (schedule.date < today) {
        errors.date = "Please select a future date";
      } else if (schedule.date === today && schedule.time && schedule.time <= currentTime) {
        errors.time = "Please select a future time for today";
      }
    }

    if (!schedule.time) {
      errors.time = "Time is required";
    }

    if (!schedule.city.trim()) {
      errors.city = "City is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const clearAllErrors = () => {
    setValidationErrors({});
  };

  return {
    validationErrors,
    validateSchedule,
    clearFieldError,
    clearAllErrors
  };
};