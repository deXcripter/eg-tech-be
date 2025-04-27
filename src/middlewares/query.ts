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
  inStock?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

const querySchema = joi
  .object({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100000).default(10),
    sort: joi.string().valid("asc", "desc").default("asc").optional(),
    sortBy: joi.string().optional(), // Schema validation for allowed sort columns would be good
    sortDirection: joi.string().valid("asc", "desc").default("asc").optional(),
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
        "any.invalid": "Invalid category ID format",
      }),
    inStock: joi.boolean().optional(),
    featured: joi.boolean().optional(),
    minPrice: joi.number().optional(),
    maxPrice: joi.number().optional(),
  })
  .custom((value, helpers) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.maxPrice < value.minPrice
    ) {
      return helpers.error("any.invalid", {
        message: "maxPrice cannot be lower than minPrice",
      });
    }
    return value;
  }, "Price range validation")
  .messages({
    "any.invalid": "{{#label}} failed custom validation because {{#message}}",
  });
// .unknown(true); // Consider if unknown fields should be allowed or stripped

export const validateQuery: RequestHandler = async (req, res, next) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return next(
        new AppError(
          error.details ? error.details[0].message : "Invalid query parameters",
          400
        )
      );
    }

    if (value.category) {
      const categoryExists = await Category.findById(value.category);
      if (!categoryExists) {
        return next(new AppError(`Category not found`, 404));
      }
    }

    // Assign validated value to req.paginationQuery
    req.paginationQuery = value as iQuery;
    next();
  } catch (error) {
    next(error);
  }
};

declare module "express-serve-static-core" {
  interface Request {
    paginationQuery: iQuery;
  }
}
