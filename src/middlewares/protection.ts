import { RequestHandler } from "express";
import { AppError } from "../utils/app.error";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export const protect: RequestHandler = async (req, res, next) => {
  const [authorization, token] = req.headers.authorization?.split(" ") || [];
  const jwtSecret = process.env.JWT_SECRET as string;

  if (!jwtSecret) {
    throw next(new AppError("JWT secret not found", 500));
    return;
  }

  if (!token || !`${authorization}`.startsWith("Bearer")) {
    throw next(new AppError("Unauthorized - No token provided", 401));
    return;
  }

  try {
    jwt.verify(token, jwtSecret);
    const decoded = jwt.decode(token) as { id: string } | null;

    if (!decoded) {
      return next(new AppError("Unauthorized - Invalid token", 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("Unauthorized - User not found", 401));

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Unauthorized - Token expired", 401));
    } else if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Unauthorized - Invalid token", 401));
    } else if (err instanceof jwt.NotBeforeError) {
      return next(new AppError("Unauthorized - Token not active", 401));
    } else if (err instanceof AppError) {
      return next(err);
    } else return next(new AppError("Unauthorized - Invalid token", 401));
  }
};

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
  }
}
