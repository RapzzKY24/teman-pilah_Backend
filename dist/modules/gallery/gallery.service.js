"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pagination_1 = require("../../utils/pagination");
const error_middleware_1 = require("@/middlewares/error.middleware");
class GalleryService {
    galleryRepository;
    constructor(galleryRepository) {
        this.galleryRepository = galleryRepository;
    }
    deleteImageFile(imagePath) {
        const fullPath = path_1.default.join(process.cwd(), imagePath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
    }
    async getAllGallery(query) {
        const { skip, take, page, limit } = (0, pagination_1.parsePagination)(query);
        const { data, total } = await this.galleryRepository.findAll({
            skip,
            take,
            search: query.search,
        });
        return {
            data,
            meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
        };
    }
    async getGalleryById(id) {
        const gallery = await this.galleryRepository.findById(id);
        if (!gallery) {
            throw new error_middleware_1.AppError("Gallery tidak ditemukan", 404);
        }
        return gallery;
    }
    async createGallery(data, file) {
        if (!file) {
            throw new error_middleware_1.AppError("Gambar wajib diupload", 400);
        }
        const image = `uploads/gallery/${file.filename}`;
        return this.galleryRepository.create({
            image,
            description: data.description,
        });
    }
    async updateGallery(id, data, file) {
        const existing = await this.getGalleryById(id);
        let image;
        if (file) {
            if (existing.image) {
                this.deleteImageFile(existing.image);
            }
            image = `uploads/gallery/${file.filename}`;
        }
        return this.galleryRepository.update(id, {
            image,
            description: data.description,
        });
    }
    async deleteGallery(id) {
        const existing = await this.getGalleryById(id);
        if (existing.image) {
            this.deleteImageFile(existing.image);
        }
        await this.galleryRepository.delete(id);
    }
}
exports.GalleryService = GalleryService;
