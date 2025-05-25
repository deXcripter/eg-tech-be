import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import Subcategory from "../models/subcategory.model";
import Product from "../models/product.model";
import { AppError } from "../utils/app.error";
import Joi from "joi";

const subcategoryValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Subcategory name is required",
    "any.required": "Subcategory name is required",
  }),
  description: Joi.string().required().trim().messages({
    "string.empty": "Subcategory description is required",
    "any.required": "Subcategory description is required",
  }),
  isActive: Joi.boolean().default(true),
});

const updateSubcategoryValidationSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const createSubcategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = subcategoryValidationSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    const { name, description, isActive } = value;

    // Check if subcategory with same name already exists
    const existingSubcategory = await Subcategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existingSubcategory) {
      return next(
        new AppError("Subcategory with this name already exists", 400)
      );
    }

    const subcategoryData: any = {
      name,
      description,
      isActive,
    };

    const subcategory = await Subcategory.create(subcategoryData);

    return res.status(201).json({
      status: "success",
      data: {
        subcategory,
      },
    });
  }
);

export const getSubcategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = req.paginationQuery.page;
    const limit = req.paginationQuery.limit;
    const skip = (page - 1) * limit;
    const sort = req.paginationQuery.sort;

    const queryObj: any = {};

    // Add search functionality
    if (req.paginationQuery.query) {
      queryObj.name = { $regex: req.paginationQuery.query, $options: "i" };
    }

    const subcategories = await Subcategory.find(queryObj)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select("-__v")
      .lean();

    const totalDocuments = await Subcategory.countDocuments(queryObj);
    const totalPages = Math.ceil(totalDocuments / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      status: "success",
      data: {
        subcategories,
      },
      pagination: {
        total: totalDocuments,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        currentPage: page,
        limit,
      },
    });
  }
);

export const getSubcategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new AppError("Subcategory ID is required", 400));

    const subcategory = await Subcategory.findById(id).select("-__v").lean();

    if (!subcategory) return next(new AppError("Subcategory not found", 404));

    return res.status(200).json({
      status: "success",
      data: {
        subcategory,
      },
    });
  }
);

export const updateSubcategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { error, value } = updateSubcategoryValidationSchema.validate(
      req.body
    );

    if (error) {
      return next(new AppError(error.message, 400));
    }

    if (!id) return next(new AppError("Subcategory ID is required", 400));

    const subcategory = await Subcategory.findById(id);
    if (!subcategory) return next(new AppError("Subcategory not found", 404));

    const { name, description, isActive } = value;

    // Check for name conflicts if name is being updated
    if (name && name !== subcategory.name) {
      const existingSubcategory = await Subcategory.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
        _id: { $ne: id },
      });
      if (existingSubcategory) {
        return next(
          new AppError("Subcategory with this name already exists", 400)
        );
      }
      subcategory.name = name;
    }

    if (description !== undefined) subcategory.description = description;
    if (isActive !== undefined) subcategory.isActive = isActive;

    await subcategory.save();

    return res.status(200).json({
      status: "success",
      data: {
        subcategory,
      },
    });
  }
);

export const deleteSubcategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new AppError("Subcategory ID is required", 400));

    // Check if any products are using this subcategory
    const productsUsingSubcategory = await Product.countDocuments({
      subcategory: id,
    });
    if (productsUsingSubcategory > 0) {
      return next(
        new AppError(
          `Cannot delete subcategory. ${productsUsingSubcategory} product(s) are using this subcategory.`,
          400
        )
      );
    }

    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) return next(new AppError("Subcategory not found", 404));

    return res.status(204).json({
      status: "success",
      message: "Subcategory deleted successfully",
    });
  }
);

export const getProductsBySubcategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new AppError("Subcategory ID is required", 400));

    // Verify subcategory exists
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) return next(new AppError("Subcategory not found", 404));

    const page = req.paginationQuery.page || 1;
    const limit = req.paginationQuery.limit || 10;
    const skip = (page - 1) * limit;

    // Build query object for additional filters
    const queryObj: any = { subcategory: id };

    if (req.paginationQuery.query) {
      queryObj.name = { $regex: req.paginationQuery.query, $options: "i" };
    }
    if (req.paginationQuery.category) {
      queryObj.category = req.paginationQuery.category;
    }
    if (req.paginationQuery.inStock !== undefined) {
      queryObj.inStock = req.paginationQuery.inStock;
    }
    if (req.paginationQuery.featured !== undefined) {
      queryObj.featured = req.paginationQuery.featured;
    }
    if (req.paginationQuery.minPrice) {
      queryObj.price = { $gte: req.paginationQuery.minPrice };
    }
    if (req.paginationQuery.maxPrice) {
      queryObj.price = {
        ...(queryObj.price || {}),
        $lte: req.paginationQuery.maxPrice,
      };
    }

    const products = await Product.find(queryObj)
      .populate("category", "name slug description")
      .populate("subcategory", "name slug description")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(queryObj);
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      status: "success",
      data: {
        subcategory: {
          _id: subcategory._id,
          name: subcategory.name,
          slug: subcategory.slug,
          description: subcategory.description,
        },
        products,
      },
      pagination: {
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        currentPage: page,
        limit,
      },
    });
  }
);

export const getSubcategoriesByName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    if (!name) return next(new AppError("Subcategory name is required", 400));

    const subcategories = await Subcategory.findByNameAcrossCategories(name);

    if (subcategories.length === 0) {
      return next(new AppError("No subcategories found with this name", 404));
    }

    // Get products for each subcategory instance
    const subcategoriesWithProducts = await Promise.all(
      subcategories.map(async (subcat) => {
        const productCount = await Product.countDocuments({
          subcategory: subcat._id,
        });
        const sampleProducts = await Product.find({ subcategory: subcat._id })
          .populate("category", "name slug")
          .limit(5)
          .select("name price images category");

        return {
          subcategory: subcat,
          productCount,
          sampleProducts,
        };
      })
    );

    return res.status(200).json({
      status: "success",
      data: {
        subcategoryName: name,
        instances: subcategoriesWithProducts,
      },
    });
  }
);
