import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error("System Error:", err);
    }
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }


  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid data format",
      details: err.issues,
    });
  }

 
  logger.error(`[UNHANDLED ERROR] ${err.name}: ${err.message}`, err);

  return res.status(500).json({
    status: "error",
    message: "An unexpected server error occurred",
  });
};
