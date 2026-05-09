"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pagination_1 = require("../../utils/pagination");
const error_middleware_1 = require("@/middlewares/error.middleware");
class NewsService {
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    deleteImageFile(imagePath) {
        const fullPath = path_1.default.join(process.cwd(), imagePath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
    }
    async getAllNews(query) {
        const { skip, take, page, limit } = (0, pagination_1.parsePagination)(query);
        const { data, total } = await this.newsRepository.findAll({
            skip,
            take,
            category: query.category,
            status: query.status,
            visibility: query.visibility,
            search: query.search,
        });
        return {
            data,
            meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
        };
    }
    async getNewsById(id) {
        const news = await this.newsRepository.findById(id);
        if (!news) {
            throw new error_middleware_1.AppError("Berita tidak ditemukan", 404);
        }
        return news;
    }
    async getNewsBySlug(slug) {
        const news = await this.newsRepository.findBySlug(slug);
        if (!news) {
            throw new error_middleware_1.AppError("Berita tidak ditemukan", 404);
        }
        return news;
    }
    async createNews(data, file) {
        const imageUrl = file
            ? `uploads/news/${file.filename}`
            : undefined;
        return this.newsRepository.create(data, imageUrl);
    }
    async updateNews(id, data, file) {
        const existingNews = await this.getNewsById(id);
        let imageUrl;
        if (file) {
            if (existingNews.imageUrl) {
                this.deleteImageFile(existingNews.imageUrl);
            }
            imageUrl = `uploads/news/${file.filename}`;
        }
        return this.newsRepository.update(id, data, imageUrl);
    }
    async deleteNews(id) {
        const existingNews = await this.getNewsById(id);
        if (existingNews.imageUrl) {
            this.deleteImageFile(existingNews.imageUrl);
        }
        await this.newsRepository.delete(id);
    }
}
exports.NewsService = NewsService;
