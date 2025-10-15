import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export const authorize = (allowedRoles: string[] | string) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden: insufficient role" });
    next();
  };
};
