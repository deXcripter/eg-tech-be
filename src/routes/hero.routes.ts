import express from "express";
import {
  createHeroBanner,
  getAllHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../controllers/hero.controller";
import { uploadSingleImage } from "../utils/multer";
import { onlyAdmin } from "../middlewares/admin.pass";
import { protect } from "../middlewares/protection";
import { validateQuery } from "../middlewares/query";

const router = express.Router();

router
  .route("/")
  .post(protect, onlyAdmin, uploadSingleImage("image"), createHeroBanner)
  .get(validateQuery, getAllHeroBanner);

router
  .route("/:id")
  .patch(protect, onlyAdmin, uploadSingleImage("image"), updateHeroBanner)
  .delete(protect, onlyAdmin, deleteHeroBanner);

export { router as heroRouter };
