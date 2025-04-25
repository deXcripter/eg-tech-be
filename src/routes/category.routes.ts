import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { uploadSingleImage } from "../utils/multer";
import { validateQuery } from "../middlewares/query";

const router = express.Router();

router
  .route("/")
  .post(uploadSingleImage("coverImage"), createCategory)
  .get(validateQuery, getCategories);

export { router as categoryRouter };
