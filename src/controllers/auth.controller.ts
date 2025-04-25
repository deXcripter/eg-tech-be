import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { signupValidation } from "../validations/auth.validation";
import { AppError } from "../utils/app.error";
import User from "../models/user.model";

export const signup = asyncHandler(
  // validate the request body
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = signupValidation.validate(req.body);
    if (error) {
      return new AppError(value.error.message, 400);
    }

    // Destructure the validated value
    let { email, password, username } = value;
    await User.create({ email, password, username });

    return res.status(201).json({ message: "Account created successfully" });
  }
);
