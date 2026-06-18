"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const response_1 = require("../../utils/response");
const gallery_validation_1 = require("./gallery.validation");
class GalleryController {
    galleryService;
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    getAll = async (req, res, next) => {
        try {
            const query = gallery_validation_1.galleryQuerySchema.parse(req.query);
            const { data, meta } = await this.galleryService.getAllGallery(query);
            (0, response_1.paginatedResponse)({
                res,
                message: "Berhasil mengambil data gallery",
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
            const gallery = await this.galleryService.getGalleryById(id);
            (0, response_1.successResponse)({
                res,
                message: "Berhasil mengambil detail gallery",
                data: gallery,
            });
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const data = gallery_validation_1.createGallerySchema.parse(req.body);
            const gallery = await this.galleryService.createGallery(data, req.file);
            (0, response_1.successResponse)({
                res,
                statusCode: 201,
                message: "Gallery berhasil ditambahkan",
                data: gallery,
            });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params["id"];
            const data = gallery_validation_1.updateGallerySchema.parse(req.body);
            const gallery = await this.galleryService.updateGallery(id, data, req.file);
            (0, response_1.successResponse)({
                res,
                message: "Gallery berhasil diupdate",
                data: gallery,
            });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params["id"];
            await this.galleryService.deleteGallery(id);
            (0, response_1.successResponse)({
                res,
                message: "Gallery berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.GalleryController = GalleryController;
