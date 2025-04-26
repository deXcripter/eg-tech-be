import { RequestHandler } from "express";
import { AppError } from "./app.error";

export const notFoundRoute: RequestHandler = (req, res, next) => {
  res
    .status(404)
    .json({ status: "fail", message: `${req.url} not found on this server` });
};

export const homeRoute: RequestHandler = (_, res, next) => {
  if (_.originalUrl === "/" || _.originalUrl === "/api/v1") {
    return res.send("Welcome to the API") as any as void;
  }
  return next();
};
