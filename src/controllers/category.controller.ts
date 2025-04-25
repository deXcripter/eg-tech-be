import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import Category from "../models/category.model";
import { AppError } from "../utils/app.error";
import { uploadImage } from "../utils/cloudinary";

const FOLDER = "category";

const checkIfCategoryExists = async (name: string) => {
  const category = await Category.find({ name }).select("name").lean();
  return category;
};

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    const { name, description } = req.body;
    if (!name || !description)
      return next(new AppError("Name and description must be present", 400));

    const existing = await checkIfCategoryExists(name);
    if (existing.length > 0)
      return next(new AppError("Category already exists", 400));

    let image = await uploadImage(req.file, FOLDER);

    const category = await Category.create({
      name,
      description,
      coverImage: image,
    });

    return res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

export const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = req.paginationQuery.page;
    const limit = req.paginationQuery.limit;
    const skip = (page - 1) * limit;
    const sort = req.paginationQuery.sort;

    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select("-__v")
      .lean();
    const totalDocuments = await Category.countDocuments();

    const totalPages = Math.ceil(totalDocuments / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      status: "success",
      data: {
        categories,
      },
      pagination: {
        total: totalDocuments,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  }
);

export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
