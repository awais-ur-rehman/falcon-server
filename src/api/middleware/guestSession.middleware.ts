import vars from "../../config/vars.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  guestId?: string;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const handleGuestSession = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    const guestId = req.headers["x-guest-id"] as string;
    
    if (guestId && guestId.startsWith("guest_")) {
      req.guestId = guestId;
    } else {
      req.guestId = `guest_${uuidv4()}`;
      res.setHeader("x-guest-id", req.guestId);
    }
    
    next();
    return;
  }

  jwt.verify(token, vars.jwtSecret, (err: any, decoded: any) => {
    if (err) {
      req.guestId = `guest_${uuidv4()}`;
      res.setHeader("x-guest-id", req.guestId);
    } else {
      req.user = decoded as DecodedToken;
    }
    next();
  });
};