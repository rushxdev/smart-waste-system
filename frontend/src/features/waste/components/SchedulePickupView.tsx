import React, { useState } from "react";
import { WelcomeStep } from "./WelcomeStep";
import { FormStep, type FormData } from "./FormStep";
import { SuccessStep } from "./SuccessStep";
import { useAuth } from "../../../app/AuthContext";
import { createWasteRequest } from "../../../services/wasteService";

// Schedule Pickup View Component with 3-step flow
interface SchedulePickupViewProps {
  onRequestCreated: () => void;
}

type Step = 1 | 2 | 3;

export const SchedulePickupView: React.FC<SchedulePickupViewProps> = ({
  onRequestCreated
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!user?.id) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await createWasteRequest({
        residentId: user.id,
        address: formData.address,
        wasteType: formData.wasteType,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.notes || undefined
      });
      setCurrentStep(3);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error &&
        typeof error.response === "object" && error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" && error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Error creating waste request. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setCurrentStep(1); // Reset for next time
    onRequestCreated();
  };

  return (
    <div className="space-y-6">
      {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
      {currentStep === 2 && (
        <FormStep
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          loading={loading}
        />
      )}
      {currentStep === 3 && <SuccessStep onComplete={handleComplete} />}
    </div>
  );
};