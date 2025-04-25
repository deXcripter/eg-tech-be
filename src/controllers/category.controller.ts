import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-wrapper";

const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
