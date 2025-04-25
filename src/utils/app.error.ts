import mongoose from "mongoose";

export class AppError extends Error {
  public isOperational: boolean;
  public status: string;
  public code: number | undefined;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = true;
    this.status = this.statusCode < 400 ? "success" : "fail";
    this.code = undefined;

    Error.captureStackTrace(this, this.constructor);
  }
}
