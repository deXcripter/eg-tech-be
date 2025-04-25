import express from "express";
import morgan from "morgan";
import { authRouter } from "./routes/auth.routes";
import { GlobalErrorHandler } from "./utils/global.error";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRouter);
app.use(GlobalErrorHandler);

export default app;
