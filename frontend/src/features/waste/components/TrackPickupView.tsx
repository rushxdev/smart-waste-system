import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTrackingStatus,
  getResidentWasteRequests,
  type WasteRequest,
  type TrackingStatus
} from "../../../services/wasteService";

// Status step configuration following Open/Closed Principle
interface StatusStep {
  id: string;
  label: string;
  icon: string;
  trackingStatus: TrackingStatus["status"] | "confirmed";
}

const STATUS_STEPS: StatusStep[] = [
  { id: "confirmed", label: "Request Confirmed", icon: "✓", trackingStatus: "confirmed" },
  { id: "assigned", label: "Driver Assigned", icon: "🚛", trackingStatus: "Scheduled" },
  { id: "enroute", label: "En Route", icon: "📍", trackingStatus: "In Progress" },
  { id: "completed", label: "Pickup Completed", icon: "✓", trackingStatus: "Collected" }
];

// Separate component for status step (Single Responsibility Principle)
interface StatusStepItemProps {
  step: StatusStep;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}

const StatusStepItem: React.FC<StatusStepItemProps> = ({
  step,
  isActive,
  isCompleted,
  isLast
}) => {
  const getStepColor = () => {
    if (isCompleted) return "bg-green-500 text-white";
    if (isActive) return "bg-green-500 text-white";
    return "bg-gray-300 text-gray-600";
  };

  const getLineColor = () => {
    return isCompleted ? "bg-green-500" : "bg-gray-300";
  };

  return (
    <div className="flex flex-col items-center flex-1">
      <div className="flex items-center w-full">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${getStepColor()} transition-colors duration-300 shadow-lg`}>
          {step.icon}
        </div>
        {!isLast && (
          <div className={`flex-1 h-2 mx-2 ${getLineColor()} transition-colors duration-300`}></div>
        )}
      </div>
      <p className={`mt-3 text-sm font-medium text-center ${isActive || isCompleted ? "text-gray-800" : "text-gray-500"}`}>
        {step.label}
      </p>
    </div>
  );
};

// Main component following Single Responsibility Principle
export const TrackPickupView: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<WasteRequest | null>(null);
  const [tracking, setTracking] = useState<TrackingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive tracking status from request status when tracking data is unavailable
  const deriveTrackingStatus = (request: WasteRequest): TrackingStatus["status"] | "confirmed" => {
    if (!request.status || request.status === "Pending") {
      return "confirmed";
    }
    if (request.status === "Scheduled") {
      return "Scheduled";
    }
    if (request.status === "In Progress") {
      return "In Progress";
    }
    if (request.status === "Collected" || request.status === "Completed") {
      return "Collected";
    }
    return "confirmed";
  };

  // Determine current step based on tracking status or request status
  const getCurrentStepIndex = (
    trackingStatus: TrackingStatus["status"] | undefined,
    requestStatus: WasteRequest["status"] | undefined
  ): number => {
    // Use tracking status if available, otherwise derive from request status
    const effectiveStatus = trackingStatus || (requestStatus ? deriveTrackingStatus({ status: requestStatus } as WasteRequest) : "confirmed");

    const stepIndex = STATUS_STEPS.findIndex(step => step.trackingStatus === effectiveStatus);
    return stepIndex === -1 ? 0 : stepIndex;
  };

  useEffect(() => {
    const fetchTrackingData = async () => {
      if (!requestId) {
        setError("Request ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch request details first
        const requestsData = await getResidentWasteRequests();
        const foundRequest = requestsData.find((r: WasteRequest) => r._id === requestId);

        if (!foundRequest) {
          setError("Request not found");
          setLoading(false);
          return;
        }

        setRequest(foundRequest);

        // Try to fetch tracking data, but don't fail if it doesn't exist
        try {
          const trackingData = await getTrackingStatus(requestId);
          setTracking(trackingData);
        } catch (trackingErr) {
          // Tracking data doesn't exist yet - this is OK
          console.log("No tracking data available yet for request:", requestId);
          setTracking(null);
        }
      } catch (err: any) {
        console.error("Error fetching request data:", err);
        setError(err.response?.data?.message || "Failed to load request information");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [requestId]);

  const currentStepIndex = getCurrentStepIndex(tracking?.status, request?.status);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error || "Unable to load request information"}</p>
          <button
            onClick={() => navigate("/resident")}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Display effective status (from tracking or derived from request)
  const displayStatus = tracking?.status || deriveTrackingStatus(request);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <button
          onClick={() => navigate("/resident")}
          className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
        >
          ← Back to My Requests
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Track Pickup</h1>
      </div>

      {/* Request Details Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-green-100 text-sm">Waste Type</p>
            <p className="font-semibold text-lg">{request.wasteType}</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Scheduled</p>
            <p className="font-semibold text-lg">
              {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : "Not scheduled"}
            </p>
            <p className="text-sm">{request.preferredTime || ""}</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Status</p>
            <p className="font-semibold text-lg">
              {displayStatus === "confirmed" ? "Request Confirmed" : displayStatus}
            </p>
          </div>
        </div>
        {request.collectorId && (
          <div className="mt-4 pt-4 border-t border-green-400">
            <p className="text-green-100 text-sm">Driver Assigned</p>
            <p className="font-semibold">Collector ID: {request.collectorId}</p>
          </div>
        )}
      </div>

      {/* Status Stepper */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Pickup Progress</h2>
        <div className="flex items-start justify-between">
          {STATUS_STEPS.map((step, index) => (
            <StatusStepItem
              key={step.id}
              step={step}
              isActive={index === currentStepIndex}
              isCompleted={index < currentStepIndex}
              isLast={index === STATUS_STEPS.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Request ID</span>
            <span className="font-medium">{request._id}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Address</span>
            <span className="font-medium">{request.address}</span>
          </div>
          {request.weight && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Weight</span>
              <span className="font-medium">{request.weight} kg</span>
            </div>
          )}
          {request.paymentStatus && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Payment Status</span>
              <span className={`font-medium ${request.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                {request.paymentStatus}
              </span>
            </div>
          )}
          {request.notes && (
            <div className="py-2">
              <span className="text-gray-600 block mb-1">Notes</span>
              <p className="text-gray-800">{request.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        {tracking ? (
          <>Last updated: {new Date(tracking.updatedAt).toLocaleString()}</>
        ) : (
          <>Created: {request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}</>
        )}
      </div>
    </div>
  );
};
