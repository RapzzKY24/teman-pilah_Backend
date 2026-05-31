import { NextFunction, Response } from "express";
import { paginatedResponse, successResponse } from "../../utils/response";
import { EducationService } from "./education.service";
import {
  createEducationSchema,
  educationQuerySchema,
  updateEducationSchema,
} from "./education.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class EducationController {
  private readonly educationService: EducationService;

  constructor(educationService: EducationService) {
    this.educationService = educationService;
  }

  getAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = educationQuerySchema.parse(req.query);
      const { data, meta } = await this.educationService.getAllEducation(query);

      paginatedResponse({
        res,
        message: "Berhasil mengambil data edukasi",
        data,
        meta,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const education = await this.educationService.getEducationById(id);

      successResponse({
        res,
        message: "Berhasil mengambil detail edukasi",
        data: education,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = createEducationSchema.parse(req.body);
      const education = await this.educationService.createEducation(
        data,
        req.file,
      );

      successResponse({
        res,
        statusCode: 201,
        message: "Konten edukasi berhasil ditambahkan",
        data: education,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const data = updateEducationSchema.parse(req.body);
      const education = await this.educationService.updateEducation(
        id,
        data,
        req.file,
      );

      successResponse({
        res,
        message: "Konten edukasi berhasil diupdate",
        data: education,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      await this.educationService.deleteEducation(id);

      successResponse({
        res,
        message: "Konten edukasi berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  };
}
