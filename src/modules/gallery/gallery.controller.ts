import { NextFunction, Response } from "express";
import { paginatedResponse, successResponse } from "../../utils/response";
import { GalleryService } from "./gallery.service";
import {
  createGallerySchema,
  galleryQuerySchema,
  updateGallerySchema,
} from "./gallery.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class GalleryController {
  private readonly galleryService: GalleryService;

  constructor(galleryService: GalleryService) {
    this.galleryService = galleryService;
  }

  getAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = galleryQuerySchema.parse(req.query);
      const { data, meta } = await this.galleryService.getAllGallery(query);

      paginatedResponse({
        res,
        message: "Berhasil mengambil data gallery",
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
      const gallery = await this.galleryService.getGalleryById(id);

      successResponse({
        res,
        message: "Berhasil mengambil detail gallery",
        data: gallery,
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
      const data = createGallerySchema.parse(req.body);
      const gallery = await this.galleryService.createGallery(data, req.file);

      successResponse({
        res,
        statusCode: 201,
        message: "Gallery berhasil ditambahkan",
        data: gallery,
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
      const data = updateGallerySchema.parse(req.body);
      const gallery = await this.galleryService.updateGallery(id, data, req.file);

      successResponse({
        res,
        message: "Gallery berhasil diupdate",
        data: gallery,
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
      await this.galleryService.deleteGallery(id);

      successResponse({
        res,
        message: "Gallery berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  };
}
