import express from "express";
import {
  createHeroBanner,
  getAllHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../controllers/hero.controller";
import { uploadSingleImage } from "../utils/multer";

const router = express.Router();

router
  .route("/")
  .post(uploadSingleImage("image"), createHeroBanner)
  .get(getAllHeroBanner);

export { router as heroRouter };
