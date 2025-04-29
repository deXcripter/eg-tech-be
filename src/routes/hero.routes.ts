import express from "express";
import {
  createHeroBanner,
  getAllHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../controllers/hero.controller";

const router = express.Router();

router
  .route("/")
  .move((req, res, next) => {
    console.log("move");
    next();
  })
  .post(createHeroBanner)
  .get(getAllHeroBanner);

export { router as heroRouter };
