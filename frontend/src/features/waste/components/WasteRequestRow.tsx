import { type WasteRequest } from "../../../services/wasteService";

// Props interface following Interface Segregation Principle
interface WasteRequestRowProps {
  request: WasteRequest;
  onClick: (requestId: string) => void;
}

// Single Responsibility: Display a single waste request row
export const WasteRequestRow: React.FC<WasteRequestRowProps> = ({ request, onClick }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Collected":
      case "Completed":
        return "text-green-600";
      case "Scheduled":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getPaymentColor = (paymentStatus?: string) => {
    return paymentStatus === "Paid" ? "text-green-600" : "text-red-600";
  };

  const handleClick = () => {
    if (request._id) {
      onClick(request._id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <tr
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="text-center border-b hover:bg-gray-50 cursor-pointer transition-colors"
      tabIndex={0}
      role="button"
      aria-label={`View tracking details for ${request.wasteType} request`}
    >
      <td className="p-3 border">{request.wasteType}</td>
      <td className="p-3 border">{request.weight || "-"}</td>
      <td className={`p-3 border font-medium ${getStatusColor(request.status)}`}>
        {request.status || "Pending"}
      </td>
      <td className={`p-3 border font-medium ${getPaymentColor(request.paymentStatus)}`}>
        {request.paymentStatus || "Unpaid"}
      </td>
      <td className="p-3 border">
        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}
      </td>
      <td className="p-3 border">
        <span className="text-green-600 hover:text-green-700 font-medium">
          Track →
        </span>
      </td>
    </tr>
  );
};
