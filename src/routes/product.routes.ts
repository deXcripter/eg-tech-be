import express from "express";
import { createProduct } from "../controllers/product.controller";
import { uploadMultipleImages } from "../utils/multer";

const router = express.Router();

router.post("", uploadMultipleImages(), createProduct);

export { router as productRouter };
