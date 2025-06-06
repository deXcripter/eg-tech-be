import { NextFunction, request, Request, Response } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import {
  loginValidation,
  signupValidation,
} from "../validations/auth.validation";
import { AppError } from "../utils/app.error";
import User from "../models/user.model";
import sendToken from "../utils/send-jwt";

export const signup = asyncHandler(
  // validate the request body
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = signupValidation.validate(req.body);
    if (error) {
      return next(new AppError(value.error.message, 400));
    }

    const existingUsers = await User.findOne();

    // Destructure the validated value
    let { email, password, username } = value;
    const user = await User.create({
      email,
      password,
      username,
      role: existingUsers ? "user" : "admin",
    });

    sendToken(user._id, 201, res);
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // validaet the request body
    const { value, error, warning } = loginValidation.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    const { email, password } = value;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Send JWT token
    sendToken(user._id, 200, res);
  }
);

export const adminLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // validaet the request body
    const { value, error, warning } = loginValidation.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }

    const { email, password } = value;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    if (user.role !== "admin")
      return next(new AppError("You are not an admin", 401));

    // Send JWT token
    sendToken(user._id, 200, res);
  }
);
