import { CardModel, ICard } from "../models/card.model";

export class CardRepository {
  async createCard(payload: Partial<ICard>) {
    const card = new CardModel(payload);
    return card.save();
  }

  async getCardsByResident(residentId: string) {
    return CardModel.find({ residentId }).sort({ createdAt: -1 }).lean();
  }

  async getAllCards() {
    return CardModel.find().sort({ createdAt: -1 }).lean();
  }
}