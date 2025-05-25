import express from "express";
import {
  createSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getProductsBySubcategory,
  getSubcategoriesByName,
} from "../controllers/subcategory.controller";
import { validateQuery } from "../middlewares/query";
import { protect } from "../middlewares/protection";
import { onlyAdmin } from "../middlewares/admin.pass";

const router = express.Router();

// Special routes first
router.get("/name/:name", getSubcategoriesByName);
router.get("/:id/products", validateQuery, getProductsBySubcategory);

// Standard CRUD routes
router
  .route("/")
  .post(protect, onlyAdmin, createSubcategory)
  .get(validateQuery, getSubcategories);

router
  .route("/:id")
  .get(getSubcategory)
  .patch(protect, onlyAdmin, updateSubcategory)
  .delete(protect, onlyAdmin, deleteSubcategory);

export { router as subcategoryRouter };
