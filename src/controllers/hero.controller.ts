import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { AppError } from "../utils/app.error";
import Hero from "../models/hero.model";
import { uploadImage } from "../utils/cloudinary";
import Joi, { link } from "joi";

const FOLDER = "hero";

/**
 * @desc This controller creates a hero banner
 * @auth It should only be callable by someone with admin privileges
 * @route POST /api/v1/hero
 */
export const createHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      highlight: Joi.string().required(),
      link: Joi.string().uri().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error || !value) {
      return next(
        new AppError(error?.message || "No body passed to the request", 400)
      );
    }
    const { title, description, highlight, link } = value;

    if (!req.file) {
      return new AppError("Please provide a file", 400);
    }

    const image = await uploadImage(req.file, FOLDER);
    if (typeof image !== "string") return next(image);

    const banner = new Hero({
      title,
      description,
      highlight,
      image,
      link,
    });

    await banner.save();

    res.status(201).json({
      status: "success",
      data: {
        banner,
      },
    });
  }
);

export const updateHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      highlight: Joi.string(),
      link: Joi.string().uri().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) return next(new AppError(error.message, 400));

    const hero = await Hero.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!hero) return next(new AppError("No hero found with that id", 404));

    if (req.file) {
      const image = await uploadImage(req.file, FOLDER);
      if (typeof image !== "string") return next(image);

      hero.image = image;
      await hero.save();
    }

    res.status(200).json({
      status: "success",
      data: {
        hero,
      },
    });
  }
);

export const deleteHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const hero = await Hero.findByIdAndDelete(id);
    if (!hero) return next(new AppError("No hero found with that id", 404));

    res.status(204).json({
      status: "success",
      message: "Hero deleted successfully",
    });
  }
);

export const getAllHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.paginationQuery;
    const skip = (page - 1) * limit;

    const heros = await Hero.find().sort({ createdAt: -1 }).skip(skip);

    const total = await Hero.countDocuments();

    const hasNextPage = page * limit + limit < total;
    const hasPreviousPage = page > 1;
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      status: "success",
      data: {
        heros,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  }
);
