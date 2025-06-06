import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import {
  productValidationSchema,
  updateProductValidationSchema,
} from "../validations/product.validation";
import { AppError } from "../utils/app.error";
import Product, { iProduct } from "../models/product.model";
import { deleteImage, uploadImages } from "../utils/cloudinary";
import Category from "../models/category.model";
import Subcategory from "../models/subcategory.model";
import { Types } from "mongoose";

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

    // Verify category exists
    const categoryExists = await Category.findById(value.category);
    if (!categoryExists) {
      return next(new AppError("Category not found", 404));
    }

    // Verify subcategory exists if provided
    if (value.subcategory) {
      const subcategoryExists = await Subcategory.findById(value.subcategory);
      if (!subcategoryExists) {
        return next(new AppError("Subcategory not found", 404));
      }
    }

    value.specs = JSON.parse(value.specs);

    const product = new Product(value);

    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files ?? {}).flat();

    if (filesArray.length > 0) {
      const images = await uploadImages(filesArray, FOLDER);
      if (images.every((img) => typeof img !== "string")) {
        return next(new AppError("Error uploading some images", 400));
      }
      product.images = images;
    }

    await product.save();

    // Populate the saved product
    await product.populate(["category", "subcategory"]);

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
      ...(req.paginationQuery.inStock !== undefined && {
        inStock: req.paginationQuery.inStock,
      }),
      ...(req.paginationQuery.featured !== undefined && {
        featured: req.paginationQuery.featured,
      }),
      ...(req.paginationQuery.minPrice && {
        price: { $gte: req.paginationQuery.minPrice },
      }),
      ...(req.paginationQuery.maxPrice && {
        price: {
          ...(req.paginationQuery.minPrice && {
            $gte: req.paginationQuery.minPrice,
          }),
          ...(req.paginationQuery.maxPrice && {
            $lte: req.paginationQuery.maxPrice,
          }),
        },
      }),
    };

    const limit = req.paginationQuery.limit || 10;
    const page = req.paginationQuery.page || 1;
    const skip = (page - 1) * limit;

    // fetch the data with populated references
    const products = await Product.find(queryObj)
      .populate("category", "name slug description")
      .populate("subcategory", "name slug description")
      .skip(skip)
      .limit(limit);

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

    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Delete associated images
    if (product.images?.length > 0) {
      const deletionErrors: string[] = [];

      await Promise.all(
        product.images.map(async (image) => {
          try {
            await deleteImage(FOLDER, image);
          } catch (err) {
            const message =
              err instanceof AppError ? err.message : "Failed to delete image";
            deletionErrors.push(`${image}: ${message}`);
          }
        })
      );

      if (deletionErrors.length > 0) {
        console.error("Some images failed to delete:", deletionErrors);
        // Continue with product deletion even if image deletion fails
      }
    }

    await product.deleteOne();

    res.status(204).json({
      status: "success",
      message: "Product deleted successfully",
    });
  }
);

export const deleteProductImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { image } = req.query as { image: string };

    if (!image) {
      return next(new AppError("Image URL is required", 400));
    }

    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const imageIndex = product.images.indexOf(image);
    if (imageIndex === -1) {
      return next(new AppError("Image not found in product", 404));
    }

    try {
      // TODO: Fix the line below
      // await deleteImage(FOLDER, image);

      // Remove the image from the array
      product.images.splice(imageIndex, 1);
      await product.save({ validateBeforeSave: false });

      res.status(204).json({
        status: "success",
        message: "Image deleted successfully",
        data: { product },
      });
    } catch (err) {
      console.error(`Failed to delete image: ${image}`, err);
      return next(
        new AppError(
          err instanceof AppError ? err.message : "Failed to delete image",
          err instanceof AppError ? err.statusCode : 500
        )
      );
    }
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    let { value, error } = updateProductValidationSchema.validate(req.body);

    console.log(value);

    if (error || !value) {
      return next(
        new AppError(
          error?.message ||
            "Request validation error. Please pass the correct details",
          400
        )
      );
    }

    const product = await Product.findById(id);
    console.log(product);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Verify category exists if being updated
    if (value.category) {
      const categoryExists = await Category.findById(value.category);
      if (!categoryExists) {
        return next(new AppError("Category not found", 404));
      }
    }

    // Verify subcategory exists if being updated
    if (value.subcategory) {
      const subcategoryExists = await Subcategory.findById(value.subcategory);
      if (!subcategoryExists) {
        return next(new AppError("Subcategory not found", 404));
      }
    }

    // Update product fields
    if (Object.entries(value.specs || {}).length > 0) {
      value.specs = JSON.parse(value.specs);
    }

    Object.assign(product, value);

    // Handle new images if provided
    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files ?? {}).flat();

    if (filesArray.length > 0) {
      const newImages = await uploadImages(filesArray, FOLDER);
      if (newImages.every((img) => typeof img !== "string")) {
        return next(new AppError("Error uploading some images", 400));
      }
      // Append new images to the existing images
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    // Populate the updated product
    await product.populate(["category", "subcategory"]);

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.paginationQuery.limit || 10;
    const page = req.paginationQuery.page || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({ featured: true })
      .skip(skip)
      .limit(limit);

    if (!products) {
      return next(new AppError("No featured products found", 404));
    }

    const total = await Product.countDocuments({ featured: true });
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          total,
          hasNextPage,
          hasPreviousPage,
          currentPage: page,
          limit,
        },
      },
    });
  }
);
