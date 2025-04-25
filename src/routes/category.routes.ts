import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { uploadSingleImage } from "../utils/multer";

const router = express.Router();

router.post("/", uploadSingleImage("coverImage"), createCategory);

export { router as categoryRouter };
