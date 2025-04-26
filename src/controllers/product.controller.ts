import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { productValidationSchema } from "../validations/category.validation";
import { AppError } from "../utils/app.error";
import Product from "../models/product.model";
import { uploadImage, uploadImages } from "../utils/cloudinary";
import Category from "../models/category.model";

const FOLDER = "product";

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = productValidationSchema.validate(req.body);
    console.log(value, error);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    if (!(await Category.exists({ _id: value.category }))) {
      return next(new AppError("Category not found", 404));
    }

    const product = new Product(value);

    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files ?? {}).flat();
    const images = await uploadImages(filesArray, FOLDER);
    if (images instanceof AppError || typeof images !== "string")
      return next(images);

    product.images = images;

    await product.save();

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category subcategory");

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);
