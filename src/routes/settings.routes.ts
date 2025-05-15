import express from "express";
import {
  getSiteSettings,
  updateSitesSettings,
} from "../controllers/site.settings.controller";

const router = express.Router();

router.route("/").patch(updateSitesSettings).get(getSiteSettings);

export { router as settingsRouter };
