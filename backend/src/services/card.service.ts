import { CardRepository } from "../repositories/card.repository";

export class CardService {
  constructor(private repo: CardRepository) {}

  // payload should include residentId, holderName, number, expiry
  async saveCard(payload: { residentId: string; holderName: string; number: string; expiry: string }) {
    if (!payload.residentId || !payload.number || !payload.holderName || !payload.expiry) {
      throw new Error("residentId, holderName, number and expiry are required");
    }

    // Never store CVV. Mask PAN and store last4 only.
    const pan = payload.number.replace(/\s+/g, "");
    const last4 = pan.slice(-4);
    const maskedNumber = "**** **** **** " + last4;

    const record = {
      residentId: payload.residentId,
      holderName: payload.holderName,
      maskedNumber,
      last4,
      expiry: payload.expiry,
    };

    return this.repo.createCard(record);
  }

  async getCardsByResident(residentId: string) {
    return this.repo.getCardsByResident(residentId);
  }
}