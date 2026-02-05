import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/index.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  console.error("[Error]", err);

  return res.status(500).json({
    message: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
