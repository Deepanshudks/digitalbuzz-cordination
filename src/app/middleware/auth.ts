import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends NextApiRequest {
  user?: any;
}

export function withAuth(handler: Function) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function withAdminAuth(handler: Function) {
  return withAuth(async (req: AuthRequest, res: NextApiResponse) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }
    return handler(req, res);
  });
}
