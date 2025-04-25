import joi from "joi";
import { AppError } from "../utils/app.error";
import { RequestHandler } from "express";

interface iQuery {
  page: number;
  limit: number;
  sort: "asc" | "desc";
}

const querySchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100000).default(10),
  sort: joi.string().valid("asc", "desc").default("asc").optional(),
});

export const validateQuery: RequestHandler = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    return next(new AppError(error.message, 400));
  }

  req.paginationQuery = value as iQuery;
  next();
};

declare module "express-serve-static-core" {
  interface Request {
    paginationQuery: iQuery;
  }
}
