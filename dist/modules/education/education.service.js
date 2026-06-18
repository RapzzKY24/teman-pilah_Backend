"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pagination_1 = require("../../utils/pagination");
const error_middleware_1 = require("@/middlewares/error.middleware");
class EducationService {
    educationRepository;
    constructor(educationRepository) {
        this.educationRepository = educationRepository;
    }
    deleteThumbnailFile(thumbnailPath) {
        const fullPath = path_1.default.join(process.cwd(), thumbnailPath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
    }
    async getAllEducation(query) {
        const { skip, take, page, limit } = (0, pagination_1.parsePagination)(query);
        const { data, total } = await this.educationRepository.findAll({
            skip,
            take,
            status: query.status,
            search: query.search,
        });
        return {
            data,
            meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
        };
    }
    async getEducationById(id) {
        const education = await this.educationRepository.findById(id);
        if (!education) {
            throw new error_middleware_1.AppError("Konten edukasi tidak ditemukan", 404);
        }
        return education;
    }
    async getEducationBySlug(slug) {
        const education = await this.educationRepository.findBySlug(slug);
        if (!education) {
            throw new error_middleware_1.AppError("Konten edukasi tidak ditemukan", 404);
        }
        return education;
    }
    async createEducation(data, file) {
        const thumbnail = file
            ? `uploads/education/${file.filename}`
            : undefined;
        return this.educationRepository.create(data, thumbnail);
    }
    async updateEducation(id, data, file) {
        const existingEducation = await this.getEducationById(id);
        let thumbnail;
        if (file) {
            if (existingEducation.thumbnail) {
                this.deleteThumbnailFile(existingEducation.thumbnail);
            }
            thumbnail = `uploads/education/${file.filename}`;
        }
        return this.educationRepository.update(id, data, thumbnail);
    }
    async deleteEducation(id) {
        const existingEducation = await this.getEducationById(id);
        if (existingEducation.thumbnail) {
            this.deleteThumbnailFile(existingEducation.thumbnail);
        }
        await this.educationRepository.delete(id);
    }
}
exports.EducationService = EducationService;
