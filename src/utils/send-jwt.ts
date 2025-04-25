import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

const signToken = (id: Types.ObjectId, res: Response) => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn =
    Date.now() + 1000 * 60 * 60 * 24 * parseInt(process.env.JWT_EXPIRES_IN!);

  const cookieDetails = {
    expires: new Date(expiresIn),
    secure: false,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieDetails.secure = true;

  const token = jwt.sign({ id }, secret, {
    expiresIn,
  });

  res.cookie("jwt", token, cookieDetails);
  return token;
};

const sendToken = (
  userId: Types.ObjectId,
  statusCode: number,
  res: Response
) => {
  const token = signToken(userId, res);
  return res.status(statusCode).json({ status: "success", token });
};

export = sendToken;
