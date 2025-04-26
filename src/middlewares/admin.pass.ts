import { RequestHandler } from "express";
import { AppError } from "../utils/app.error";

export const onlyAdmin: RequestHandler = (req, res, next) => {
  if (!req.user) return next(new AppError("Unauthorized - No user found", 401));

  if (req.user.role !== "admin") {
    return next(new AppError("Unauthorized - Not an admin", 403));
  }

  next();
};
