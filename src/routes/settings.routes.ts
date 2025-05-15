import express from "express";
import { updateSitesSettings } from "../controllers/site.settings.controller";

const router = express.Router();

router.route("/").patch(updateSitesSettings);

export { router as settingsRouter };
