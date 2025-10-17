import React, { useState } from "react";
import { WelcomeStep } from "./WelcomeStep";
import { FormStep, type FormData } from "./FormStep";
import { PaymentStep } from "./PaymentStep";
import { AddCardStep } from "./AddCardStep";
import { SuccessStep } from "./SuccessStep";
import { useAuth } from "../../../app/AuthContext";
import { createWasteRequest } from "../../../services/wasteService";
import { createPayment, type PaymentDetails } from "../../../services/paymentService";

// Schedule Pickup View Component with 5-step flow
interface SchedulePickupViewProps {
  onRequestCreated: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

export const SchedulePickupView: React.FC<SchedulePickupViewProps> = ({
  onRequestCreated
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [savedFormData, setSavedFormData] = useState<FormData | null>(null);
  const [wasteRequestId, setWasteRequestId] = useState<string | null>(null);
  const { user } = useAuth();

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBackToWelcome = () => {
    setCurrentStep(1);
  };

  const handleBackToForm = () => {
    setCurrentStep(2);
  };

  const handleBackToPayment = () => {
    setCurrentStep(3);
  };

  const handleFormSubmit = (formData: FormData) => {
    // Save form data and move to payment step
    setSavedFormData(formData);
    setCurrentStep(3);
  };

  const handleProceedToAddCard = () => {
    setCurrentStep(4);
  };

  const handlePaymentSubmit = async (paymentDetails: PaymentDetails) => {
    if (!user?.id || !savedFormData) {
      alert("Session expired. Please start again.");
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create waste request
      const wasteRequestResponse = await createWasteRequest({
        residentId: user.id,
        address: savedFormData.address,
        wasteType: savedFormData.wasteType,
        preferredDate: savedFormData.preferredDate,
        preferredTime: savedFormData.preferredTime,
        notes: savedFormData.notes || undefined
      });

      const requestId = wasteRequestResponse._id || wasteRequestResponse.id;
      setWasteRequestId(requestId);

      // Step 2: Create payment record
      await createPayment({
        residentId: user.id,
        requestId: requestId,
        amount: calculateServiceFee(savedFormData.wasteType),
        method: "Card",
        paymentDetails
      });

      // Success! Move to final step
      setCurrentStep(5);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error &&
        typeof error.response === "object" && error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" && error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Error processing your request. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for calculating service fee (matches PaymentStep logic)
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

  const handleComplete = () => {
    // Reset state for next time
    setCurrentStep(1);
    setSavedFormData(null);
    setWasteRequestId(null);
    onRequestCreated();
  };

  return (
    <div className="space-y-6">
      {currentStep === 1 && <WelcomeStep onNext={handleNext} />}

      {currentStep === 2 && (
        <FormStep
          onSubmit={handleFormSubmit}
          onBack={handleBackToWelcome}
          loading={loading}
        />
      )}

      {currentStep === 3 && savedFormData && (
        <PaymentStep
          formData={savedFormData}
          onBack={handleBackToForm}
          onProceed={handleProceedToAddCard}
          loading={loading}
        />
      )}

      {currentStep === 4 && (
        <AddCardStep
          onSubmit={handlePaymentSubmit}
          onBack={handleBackToPayment}
          loading={loading}
        />
      )}

      {currentStep === 5 && <SuccessStep onComplete={handleComplete} />}
    </div>
  );
};