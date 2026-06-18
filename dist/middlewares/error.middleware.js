"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        const errorMessages = err.errors.map((e) => e.message).join(", ");
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
exports.errorHandler = errorHandler;
