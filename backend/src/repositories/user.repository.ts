import User, { type IUser } from "../models/user.model";

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const u = new User(userData);
    return await u.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
}
