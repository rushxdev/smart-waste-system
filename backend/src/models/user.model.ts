import { Schema, model, Document } from "mongoose";

export type UserRole = "manager" | "collector" | "resident";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["manager", "collector", "resident"], default: "resident" },
  createdAt: { type: Date, default: Date.now }
});

export default model<IUser>("User", userSchema);
