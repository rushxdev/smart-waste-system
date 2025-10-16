import { useState } from "react";
import { useDispatch } from "react-redux";
import { processPayment } from "../payment/paymentSlice"; // Assuming Redux slice

interface PaymentDetails {
  wasteType: string;
  pickupDateTime: string;
  serviceFee: number;
  ecoCoinsApplied: number;
  finalAmount: number;
  paymentMethod: string;
}

export default function PricingSummary() {
  const [payment, setPayment] = useState<PaymentDetails>({
    wasteType: "",
    pickupDateTime: "",
    serviceFee: 0,
    ecoCoinsApplied: 0,
    finalAmount: 0,
    paymentMethod: "EcoCoins",
  });
  const dispatch = useDispatch();

  const updateFinalAmount = () => {
    const final = payment.serviceFee - payment.ecoCoinsApplied;
    setPayment({ ...payment, finalAmount: final > 0 ? final : 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(processPayment(payment));
    // Call paymentService.processPayment(payment) for backend
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Pricing & Summary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Waste Type"
          value={payment.wasteType}
          onChange={(e) => setPayment({ ...payment, wasteType: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <input
          type="datetime-local"
          value={payment.pickupDateTime}
          onChange={(e) => setPayment({ ...payment, pickupDateTime: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <input
          type="number"
          placeholder="Service Fee (LKR)"
          value={payment.serviceFee}
          onChange={(e) => {
            setPayment({ ...payment, serviceFee: parseFloat(e.target.value) });
            updateFinalAmount();
          }}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <input
          type="number"
          placeholder="EcoCoins Applied"
          value={payment.ecoCoinsApplied}
          onChange={(e) => {
            setPayment({ ...payment, ecoCoinsApplied: parseFloat(e.target.value) });
            updateFinalAmount();
          }}
          className="w-full p-2 border border-green-300 rounded"
        />
        <p className="text-lg">Final Amount: {payment.finalAmount} LKR</p>
        <select
          value={payment.paymentMethod}
          onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
        >
          <option value="EcoCoins">EcoCoins</option>
          <option value="Card">Card</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Proceed
        </button>
      </form>
    </div>
  );
}