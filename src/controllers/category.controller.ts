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
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new AppError("Category ID is required", 400));

    const category = await Category.findById(id).select("-__v").lean();

    if (!category) return next(new AppError("Category not found", 404));

    return res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) return next(new AppError("Category ID is required", 400));
    // if (!name && !description && !req.file)
    //   return next(
    //     new AppError("At least one field to update must be provided", 400)
    //   );

    const category = await Category.findById(id);
    if (!category) return next(new AppError("Category not found", 404));

    if (name) {
      const existing = await checkIfCategoryExists(name);
      if (existing.length > 0 && existing[0]._id.toString() !== id)
        return next(
          new AppError("Category with this name already exists", 400)
        );
      category.name = name;
    }

    if (description) {
      category.description = description;
    }

    if (req.file) {
      const image = await uploadImage(req.file, FOLDER);
      if (typeof image !== "string") return next(image);
      category.coverImage = image;
    }

    await category.save();

    return res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new AppError("Category ID is required", 400));

    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(new AppError("Category not found", 404));

    return res.status(204).json({
      status: "success",
      message: "Category deleted successfully",
    });
  }
);
