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
import { protect } from "../middlewares/protection";
import { onlyAdmin } from "../middlewares/admin.pass";

const router = express.Router();

router
  .route("/")
  .post(protect, onlyAdmin, uploadSingleImage("coverImage"), createCategory)
  .get(validateQuery, getCategories);

router
  .route("/:id")
  .get(getCategory)
  .patch(protect, onlyAdmin, uploadSingleImage("coverImage"), updateCategory)
  .delete(protect, onlyAdmin, deleteCategory);

export { router as categoryRouter };
