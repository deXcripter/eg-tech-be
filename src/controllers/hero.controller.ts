import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-wrapper";

/**
 * @desc This controller creates a hero banner
 * @auth It should only be callable by someone with admin privileges
 * @route POST /api/v1/hero
 */
export const createHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllHeroBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
