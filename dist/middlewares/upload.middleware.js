"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpload = createUpload;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const error_middleware_1 = require("./error.middleware");
const BASE_UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
function createUpload(subDir, prefix) {
    const uploadDir = path_1.default.join(BASE_UPLOAD_DIR, subDir);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${prefix}-${uniqueSuffix}${ext}`);
        },
    });
    const fileFilter = (_req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new error_middleware_1.AppError("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP", 400));
        }
    };
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter,
    });
}
