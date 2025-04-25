import { NextFunction, request, Request, Response } from "express";
import { asyncHandler } from "../utils/async-wrapper";
import { signupValidation } from "../validations/auth.validation";
import { AppError } from "../utils/app.error";
import User from "../models/user.model";
import sendToken from "../utils/send-jwt";

export const signup = asyncHandler(
  // validate the request body
  async (req: Request, res: Response, next: NextFunction) => {
    let { value, error } = signupValidation.validate(req.body);
    if (error) {
      return new AppError(value.error.message, 400);
    }

    // Destructure the validated value
    let { email, password, username } = value;
    const user = await User.create({ email, password, username });

    return sendToken(user._id, 201, res);
  }
);

export const login = asyncHandler(
  async (request: Request, response: Response) => {
    const { email, password } = request.body;

    // Check if email and password are provided
    if (!email || !password) {
      return new AppError("Please provide email and password", 400);
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return new AppError("Incorrect email or password", 401);
    }

    // Send JWT token
    return sendToken(user._id, 200, response);
  }
);

// export const login = asyncHandler()
