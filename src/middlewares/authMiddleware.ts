import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface AuthRequest extends Request {
  user?: any;
}

// middleware for checking whether authorized person is accessing the api endpoint or not throught token
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized: No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach decoded user info
    req.user = decoded; 

    next();

  } catch (err) {
    return res.status(403).json({
      error: "Unauthorized: Invalid or expired token",
    });
  }
}
