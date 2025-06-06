import express from "express";
import morgan from "morgan";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { GlobalErrorHandler } from "./utils/global.error";
import { productRouter } from "./routes/product.routes";
import { categoryRouter } from "./routes/category.routes";
import { subcategoryRouter } from "./routes/subcategory.routes";
import { homeRoute, notFoundRoute } from "./routes/default.routes";
import { heroRouter } from "./routes/hero.routes";
import { settingsRouter } from "./routes/settings.routes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/", homeRoute);
app.use("/api/v1", homeRoute);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/hero", heroRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/", notFoundRoute);
app.use(GlobalErrorHandler);

export default app;
