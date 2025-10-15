import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";

const repo = new UserRepository();
const service = new AuthService(repo);

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const user = await service.register({ name, email, password, role });
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await service.login(email, password);
      res.status(200).json({ token, user });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }
}
