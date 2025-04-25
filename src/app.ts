import express from "express";
import morgan from "morgan";
import { authRouter } from "./routes/auth.routes";
import { GlobalErrorHandler } from "./utils/global.error";
import { productRouter } from "./routes/product.routes";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use(GlobalErrorHandler);

export default app;
