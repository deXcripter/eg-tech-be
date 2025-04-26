import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { productValidationSchema } from "../validations/category.validation";
import { AppError } from "../utils/app.error";
import Product, { iProduct, iProductModel } from "../models/product.model";
import { deleteImage, uploadImage, uploadImages } from "../utils/cloudinary";
import Category from "../models/category.model";

const FOLDER = "product";

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = productValidationSchema.validate(req.body);
    if (error || !value) {
      return next(
        new AppError(
          error?.message ||
            "Request validation error. Please pass the correct details",
          400
        )
      );
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

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryObj = {
      ...(req.paginationQuery.query && {
        name: { $regex: req.paginationQuery.query, $options: "i" },
      }),
      ...(req.paginationQuery.category && {
        category: req.paginationQuery.category,
      }),
      ...(req.paginationQuery.inStock && {
        inStock: req.paginationQuery.inStock,
      }),
      ...(req.paginationQuery.featured && {
        featured: req.paginationQuery.featured,
      }),
    };

    const limit = req.paginationQuery.limit || 10;
    const page = req.paginationQuery.page || 1;
    const skip = (page - 1) * limit;

    // fetch the data
    const products = await Product.find(queryObj).skip(skip).limit(limit);
    const total = await Product.countDocuments(queryObj);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      data: products,
      pagination: {
        total,
        hasNextPage,
        hasPreviousPage,
        currentPage: page,
        limit,
      },
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Delete associated images from cloud storage
    if (product.images && product.images.length > 0) {
      const deleteResults = await Promise.all(
        product.images.map(async (image) => {
          try {
            await deleteImage(FOLDER, image);
          } catch (err) {
            console.error(`Failed to delete image: ${image}`, err);
          }
        })
      );
    }

    // Delete the product
    await product.deleteOne();

    res.status(204).json({
      status: "success",
      message: "Product deleted successfully",
    });
  }
);
