import { Response } from "express";
import { PaginationMeta } from "./pagination";

interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
}

interface PaginatedResponseOptions<T> {
  res: Response;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
}

export const successResponse = <T>({
  res,
  statusCode = 200,
  message,
  data,
}: SuccessResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data: data ?? null,
  });
};

export const paginatedResponse = <T>({
  res,
  message,
  data,
  meta,
}: PaginatedResponseOptions<T>): Response => {
  return res.status(200).json({
    status: "success",
    message,
    data,
    meta,
  });
};

export const errorResponse = ({
  res,
  statusCode = 500,
  message,
}: ErrorResponseOptions): Response => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};
