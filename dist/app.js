"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL ?? "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use("/api", index_1.default);
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
        env: process.env.NODE_ENV ?? "development",
    });
});
app.use((_req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route tidak ditemukan",
    });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
