import joi from "joi";
import { AppError } from "../utils/app.error";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import Category from "../models/category.model";

interface iQuery {
  page: number;
  limit: number;
  sort: "asc" | "desc";
  query?: string;
  category?: string;
  inStock: boolean;
  featured: boolean;
}

const querySchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100000).default(10),
  sort: joi.string().valid("asc", "desc").default("asc").optional(),
  query: joi.string().optional(),
  category: joi
    .string()
    .optional()
    .custom((value, helpers) => {
      if (value && !Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid subcategory ID format",
    }),
  inStock: joi.boolean().optional(),
  featured: joi.boolean().optional(),
});
// .unknown(true);

export const validateQuery: RequestHandler = async (req, res, next) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    return next(new AppError(error.message, 400));
  }

  if (value.category) {
    if (!(await Category.findById(value.category)))
      return next(new AppError(`Categoty not found`, 404));
  }

  req.paginationQuery = value as iQuery;
  next();
};

declare module "express-serve-static-core" {
  interface Request {
    paginationQuery: iQuery;
  }
}
