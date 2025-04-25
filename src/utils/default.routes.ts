import { RequestHandler } from "express";
import { AppError } from "./app.error";

export const notFoundRoute: RequestHandler = (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
};

export const homeRoute: RequestHandler = (_, res, next) => {
  if (_.originalUrl === "/") {
    return res.send("Welcome to the API") as any as void;
  }
  return next();
};
