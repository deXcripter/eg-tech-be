import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { productValidationSchema } from "../validations/category.validation";
import { AppError } from "../utils/app.error";
import Product from "../models/product.model";
import { uploadImage, uploadImages } from "../utils/cloudinary";

const FOLDER = "product";

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = productValidationSchema.validate(req.body);
    console.log(value, error);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    const product = new Product(value);

    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files ?? {}).flat();
    product.images = await uploadImages(filesArray, FOLDER);

    await product.save();

    // Destructure the validated value
    res.status(201).json({
      status: "success",
      data: {
        product: value,
      },
    });
  }
);
