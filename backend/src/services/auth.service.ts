import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type IUser } from "../models/user.model";

// Get environment variables with proper validation
const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
})();

const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export class AuthService {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async register(userData: { name: string; email: string; password: string; role?: string; }): Promise<Partial<IUser>> {
    const existing = await this.repo.findByEmail(userData.email);
    if (existing) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const created = await this.repo.create({
      name: userData.name,
      email: userData.email,
      password: hashed,
      role: (userData.role as any) || "resident"
    } as Partial<IUser>);

    return { id: created._id, name: created.name, email: created.email, role: created.role };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<IUser> }> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { sub: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
  }

  // helper to verify token -> returns payload or throws
  verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  }
}
