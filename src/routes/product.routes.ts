import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getFeaturedProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import { uploadMultipleImages } from "../utils/multer";
import { validateQuery } from "../middlewares/query";
import { protect } from "../middlewares/protection";
import { onlyAdmin } from "../middlewares/admin.pass";

const router = express.Router();

router.route("/featured").get(validateQuery, getFeaturedProducts);
router
  .route("/")
  .post(protect, onlyAdmin, uploadMultipleImages("images"), createProduct)
  .get(validateQuery, getAllProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(protect, onlyAdmin, deleteProduct)
  .patch(protect, onlyAdmin, uploadMultipleImages("images"), updateProduct);

router.delete("/image/:id", protect, onlyAdmin, deleteProductImage);

export { router as productRouter };
