import express from "express";
import morgan from "morgan";
import { authRouter } from "./routes/auth.routes";
import { GlobalErrorHandler } from "./utils/global.error";
import { productRouter } from "./routes/product.routes";
import { categoryRouter } from "./routes/category.routes";
import { homeRoute, notFoundRoute } from "./utils/default.routes";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/", homeRoute);
app.use("/api/v1", homeRoute);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/", notFoundRoute);
app.use(GlobalErrorHandler);

export default app;
