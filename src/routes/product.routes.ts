import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import { uploadMultipleImages } from "../utils/multer";
import { validateQuery } from "../middlewares/query";

const router = express.Router();

router
  .route("/")
  .post(uploadMultipleImages(), createProduct)
  .get(validateQuery, getAllProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(deleteProduct)
  .patch(uploadMultipleImages("images"), updateProduct);

router.delete("/image/:id", deleteProductImage);

export { router as productRouter };
