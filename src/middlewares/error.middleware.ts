import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError | Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const errorMessages = (err as any).errors.map((e: any) => e.message).join(", ");
    res.status(400).json({
      status: "error",
      message: errorMessages,
    });
    return;
  }

  if (err.name === "MulterError") {
    res.status(400).json({
      status: "error",
      message: `Upload error: ${err.message}`,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  if (err.message?.includes("Record to update not found")) {
    res.status(404).json({
      status: "error",
      message: "Data tidak ditemukan",
    });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
