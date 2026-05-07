"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.paginatedResponse = exports.successResponse = void 0;
const successResponse = ({ res, statusCode = 200, message, data, }) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data: data ?? null,
    });
};
exports.successResponse = successResponse;
const paginatedResponse = ({ res, message, data, meta, }) => {
    return res.status(200).json({
        status: "success",
        message,
        data,
        meta,
    });
};
exports.paginatedResponse = paginatedResponse;
const errorResponse = ({ res, statusCode = 500, message, }) => {
    return res.status(statusCode).json({
        status: "error",
        message,
    });
};
exports.errorResponse = errorResponse;
