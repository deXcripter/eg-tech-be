import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { productValidationSchema } from "../validations/category.validation";
import { AppError } from "../utils/app.error";

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = productValidationSchema.validate(req.body);
    console.log(value, error);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    // Destructure the validated value
    res.status(201).json({
      status: "success",
      data: {
        product: value,
      },
    });
  }
);
