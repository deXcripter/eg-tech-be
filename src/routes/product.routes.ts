import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../controllers/product.controller";
import { uploadMultipleImages } from "../utils/multer";
import { validateQuery } from "../middlewares/query";

const router = express.Router();

router
  .route("/")
  .post(uploadMultipleImages(), createProduct)
  .get(validateQuery, getAllProducts);
router.route("/:id").get(getProduct).delete(deleteProduct);

export { router as productRouter };
