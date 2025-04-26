import express from "express";
import { createProduct, getProduct } from "../controllers/product.controller";
import { uploadMultipleImages } from "../utils/multer";

const router = express.Router();

router.post("", uploadMultipleImages(), createProduct);
router.route("/:id").get(getProduct);

export { router as productRouter };
