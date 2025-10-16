import { useState } from "react";
//import { useDispatch } from "react-redux";   ..... denata meka ona ne hode.(0)
//import { saveCard } from "../auth/authSlice"; // Assuming Redux slice

interface CardDetails {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
}

export default function AddCard() {
  const [card, setCard] = useState<CardDetails>({ holderName: "", number: "", expiry: "", cvv: "" });
  //const dispatch = useDispatch();  ..... denata meka ona ne hode.(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic (e.g., check lengths)
    if (card.number.length !== 16) {
      alert("Invalid card number");
      return;
    }
    //dispatch(saveCard(card));   ..... denata meka ona ne hode.(2)
    // Call paymentService.saveCard(card) for backend integration
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Payment Card</h2>
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        {/* Dynamic Card Preview */}
        <p className="text-lg font-mono">{card.number || "**** **** **** ****"}</p>
        <p>{card.holderName || "Card Holder"}</p>
        <p>Exp: {card.expiry || "MM/YY"}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Card Holder Name"
          value={card.holderName}
          onChange={(e) => setCard({ ...card, holderName: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="Card Number"
          value={card.number}
          onChange={(e) => setCard({ ...card, number: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          value={card.expiry}
          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="CVV"
          value={card.cvv}
          onChange={(e) => setCard({ ...card, cvv: e.target.value })}
          className="w-full p-2 border border-green-300 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Save Card
        </button>
      </form>
    </div>
  );
}