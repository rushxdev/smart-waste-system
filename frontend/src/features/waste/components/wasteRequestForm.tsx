import { useState } from "react";
import { createWasteRequest } from "../services/wasteService";

interface Props {
  onRequestCreated: () => void;
}

export default function WasteRequestForm({ onRequestCreated }: Props) {
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createWasteRequest({ wasteType, weight });
      setWasteType("");
      setWeight(0);
      onRequestCreated();
    } catch {
      alert("Error creating waste request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-xl space-y-4"
    >
      <h3 className="text-xl font-semibold">Create New Waste Request</h3>

      <input
        type="text"
        placeholder="Waste Type (e.g., Plastic, Food)"
        value={wasteType}
        onChange={(e) => setWasteType(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value))}
        className="border p-2 rounded w-full"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
