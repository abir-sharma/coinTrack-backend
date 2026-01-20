import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  console.log("req",req.body)
  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("decoded",decoded)
    if (typeof decoded !== "object" || !("authId" in decoded)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded as JwtPayload;
    console.log("req.user",req.user)
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


