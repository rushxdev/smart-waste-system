import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Create a typed JWT verification function
function verifyJWT(token: string): any {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.verify(token, secret);
}

export interface AuthRequest extends Request {
  user?: { sub: string; role: string; email?: string; [k: string]: any };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const payload = verifyJWT(token);
    req.user = { sub: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
