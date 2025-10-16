import mongoose, { Document, Schema } from "mongoose";

export interface ICard extends Document {
  residentId: string;
  holderName: string;
  maskedNumber: string; // e.g. **** **** **** 1234
  last4: string;
  expiry: string;
  createdAt: Date;
}

const CardSchema: Schema = new Schema({
  residentId: { type: String, required: true },
  holderName: { type: String, required: true },
  maskedNumber: { type: String, required: true },
  last4: { type: String, required: true },
  expiry: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CardModel = mongoose.model<ICard>("Card", CardSchema);