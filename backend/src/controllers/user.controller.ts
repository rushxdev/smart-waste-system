import type { Request, Response } from "express";
import User from "../models/user.model";

export class UserController {
  // GET /users?role=collector
  static async listByRole(req: Request, res: Response) {
    try {
      const { role } = req.query as { role?: string };
      const filter: any = {};
      if (role) filter.role = role;
      const users = await User.find(filter).select("_id name role").lean();
      res.status(200).json(users);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
}
