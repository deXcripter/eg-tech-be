import { NextFunction, Request, Response } from "express";
import { AppError } from "./app.error";

export const GlobalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "ValidationError") err = handleValidationErrors(err, res);
  if (err.code === 11000) err = handleDuplicateErrors(err, res);

  // handle app errors first
  if (err.isOperational) handleOperationalErrors(err, res);
  else {
    // handle programming errors
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

function handleOperationalErrors(err: AppError, res: Response) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

function handleValidationErrors(err: any, res: Response): AppError {
  const message = Object.values(err.errors)
    .map((el: any) => el.message)
    .join("\n ");
  return new AppError(message, 400);
}

function handleDuplicateErrors(err: any, res: Response): AppError {
  const message = `Duplicate field value: ${err.keyValue.email}. Please use another value!`;
  return new AppError(message, 400);
}
