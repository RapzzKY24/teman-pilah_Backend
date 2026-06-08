import { Gallery } from "../../../generated/prisma";
import fs from "fs";
import path from "path";
import {
  buildPaginationMeta,
  parsePagination,
  PaginationMeta,
} from "../../utils/pagination";
import { GalleryRepository } from "./gallery.repository";
import {
  CreateGalleryInput,
  GalleryQueryInput,
  UpdateGalleryInput,
} from "./gallery.validation";
import { AppError } from "@/middlewares/error.middleware";

interface GalleryListResult {
  data: Gallery[];
  meta: PaginationMeta;
}

export class GalleryService {
  private readonly galleryRepository: GalleryRepository;

  constructor(galleryRepository: GalleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  private deleteImageFile(imagePath: string): void {
    const fullPath: string = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getAllGallery(query: GalleryQueryInput): Promise<GalleryListResult> {
    const { skip, take, page, limit } = parsePagination(query);

    const { data, total } = await this.galleryRepository.findAll({
      skip,
      take,
      search: query.search,
    });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getGalleryById(id: string): Promise<Gallery> {
    const gallery: Gallery | null = await this.galleryRepository.findById(id);

    if (!gallery) {
      throw new AppError("Gallery tidak ditemukan", 404);
    }

    return gallery;
  }

  async createGallery(
    data: CreateGalleryInput,
    file?: Express.Multer.File,
  ): Promise<Gallery> {
    if (!file) {
      throw new AppError("Gambar wajib diupload", 400);
    }

    const image: string = `uploads/gallery/${file.filename}`;

    return this.galleryRepository.create({
      image,
      description: data.description,
    });
  }

  async updateGallery(
    id: string,
    data: UpdateGalleryInput,
    file?: Express.Multer.File,
  ): Promise<Gallery> {
    const existing: Gallery = await this.getGalleryById(id);

    let image: string | undefined;

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

  async deleteGallery(id: string): Promise<void> {
    const existing: Gallery = await this.getGalleryById(id);

    if (existing.image) {
      this.deleteImageFile(existing.image);
    }

    await this.galleryRepository.delete(id);
  }
}
