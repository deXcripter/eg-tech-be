import { RequestHandler } from "express";

export const notFoundRoute: RequestHandler = (req, res, next) => {
  // Im not using AppError here because it's not a server error and this is slightly faster since its a direct response
  // and not a middleware

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
