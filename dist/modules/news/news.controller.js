"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const response_1 = require("../../utils/response");
const news_validation_1 = require("./news.validation");
class NewsController {
    newsService;
    constructor(newsService) {
        this.newsService = newsService;
    }
    getAll = async (req, res, next) => {
        try {
            const query = news_validation_1.newsQuerySchema.parse(req.query);
            const { data, meta } = await this.newsService.getAllNews(query);
            (0, response_1.paginatedResponse)({
                res,
                message: "Berhasil mengambil data berita",
                data,
                meta,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params["id"];
            const news = await this.newsService.getNewsById(id);
            (0, response_1.successResponse)({
                res,
                message: "Berhasil mengambil detail berita",
                data: news,
            });
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const data = news_validation_1.createNewsSchema.parse(req.body);
            const news = await this.newsService.createNews(data, req.file);
            (0, response_1.successResponse)({
                res,
                statusCode: 201,
                message: "Berita berhasil ditambahkan",
                data: news,
            });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params["id"];
            const data = news_validation_1.updateNewsSchema.parse(req.body);
            const news = await this.newsService.updateNews(id, data, req.file);
            (0, response_1.successResponse)({
                res,
                message: "Berita berhasil diupdate",
                data: news,
            });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params["id"];
            await this.newsService.deleteNews(id);
            (0, response_1.successResponse)({
                res,
                message: "Berita berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.NewsController = NewsController;
