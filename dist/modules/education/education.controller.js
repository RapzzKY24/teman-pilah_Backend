"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationController = void 0;
const response_1 = require("../../utils/response");
const education_validation_1 = require("./education.validation");
class EducationController {
    educationService;
    constructor(educationService) {
        this.educationService = educationService;
    }
    getAll = async (req, res, next) => {
        try {
            const query = education_validation_1.educationQuerySchema.parse(req.query);
            const { data, meta } = await this.educationService.getAllEducation(query);
            (0, response_1.paginatedResponse)({
                res,
                message: "Berhasil mengambil data edukasi",
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
            const education = await this.educationService.getEducationById(id);
            (0, response_1.successResponse)({
                res,
                message: "Berhasil mengambil detail edukasi",
                data: education,
            });
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const data = education_validation_1.createEducationSchema.parse(req.body);
            const education = await this.educationService.createEducation(data, req.file);
            (0, response_1.successResponse)({
                res,
                statusCode: 201,
                message: "Konten edukasi berhasil ditambahkan",
                data: education,
            });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params["id"];
            const data = education_validation_1.updateEducationSchema.parse(req.body);
            const education = await this.educationService.updateEducation(id, data, req.file);
            (0, response_1.successResponse)({
                res,
                message: "Konten edukasi berhasil diupdate",
                data: education,
            });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params["id"];
            await this.educationService.deleteEducation(id);
            (0, response_1.successResponse)({
                res,
                message: "Konten edukasi berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.EducationController = EducationController;
