import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import vars from "../../config/vars.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    phoneNumber: string;
    role: string;
  };
}

interface DecodedToken {
  id: string;
  phoneNumber: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ 
      success: false,
      error: "Access token required" 
    });
    return;
  }

  jwt.verify(token, vars.jwtSecret, (err, decoded) => {
    if (err) {
      res.status(403).json({ 
        success: false,
        error: "Invalid or expired token" 
      });
      return;
    }

    req.user = decoded as DecodedToken;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required"
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Insufficient permissions"
      });
      return;
    }

    next();
  };
};