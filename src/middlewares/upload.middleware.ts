import multer, { FileFilterCallback, StorageEngine, Multer } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { AppError } from "./error.middleware";

const MAX_FILE_SIZE: number = 2 * 1024 * 1024;
const ALLOWED_TYPES: string[] = ["image/jpeg", "image/png", "image/webp"];

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

/**
 * Membuat multer upload instance untuk folder tujuan tertentu.
 * @param folder - Subfolder di dalam 'uploads/', misal 'products' atau 'news'
 */
function createUpload(folder: string): Multer {
  const uploadDir: string = path.join(process.cwd(), `uploads/${folder}`);

  // Pastikan folder tujuan ada
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage: StorageEngine = multer.diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: DestinationCallback,
    ): void => {
      cb(null, uploadDir);
    },
    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: FilenameCallback,
    ): void => {
      const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext: string = path.extname(file.originalname);
      cb(null, `${folder}-${uniqueSuffix}${ext}`);
    },
  });

  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP",
          400,
        ),
      );
    }
  };

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
  });
}

// Upload instance per module
export const upload: Multer = createUpload("products");
export const uploadNews: Multer = createUpload("news");
