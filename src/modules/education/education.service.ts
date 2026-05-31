import { EducationContent } from "../../../generated/prisma";
import fs from "fs";
import path from "path";
import {
  buildPaginationMeta,
  parsePagination,
  PaginationMeta,
} from "../../utils/pagination";
import { EducationRepository } from "./education.repository";
import {
  CreateEducationInput,
  EducationQueryInput,
  UpdateEducationInput,
} from "./education.validation";
import { AppError } from "@/middlewares/error.middleware";

interface EducationListResult {
  data: EducationContent[];
  meta: PaginationMeta;
}

export class EducationService {
  private readonly educationRepository: EducationRepository;

  constructor(educationRepository: EducationRepository) {
    this.educationRepository = educationRepository;
  }

  private deleteThumbnailFile(thumbnailPath: string): void {
    const fullPath: string = path.join(process.cwd(), thumbnailPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getAllEducation(
    query: EducationQueryInput,
  ): Promise<EducationListResult> {
    const { skip, take, page, limit } = parsePagination(query);

    const { data, total } = await this.educationRepository.findAll({
      skip,
      take,
      status: query.status,
      search: query.search,
    });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getEducationById(id: string): Promise<EducationContent> {
    const education: EducationContent | null =
      await this.educationRepository.findById(id);

    if (!education) {
      throw new AppError("Konten edukasi tidak ditemukan", 404);
    }

    return education;
  }

  async getEducationBySlug(slug: string): Promise<EducationContent> {
    const education: EducationContent | null =
      await this.educationRepository.findBySlug(slug);

    if (!education) {
      throw new AppError("Konten edukasi tidak ditemukan", 404);
    }

    return education;
  }

  async createEducation(
    data: CreateEducationInput,
    file?: Express.Multer.File,
  ): Promise<EducationContent> {
    const thumbnail: string | undefined = file
      ? `uploads/education/${file.filename}`
      : undefined;

    return this.educationRepository.create(data, thumbnail);
  }

  async updateEducation(
    id: string,
    data: UpdateEducationInput,
    file?: Express.Multer.File,
  ): Promise<EducationContent> {
    const existingEducation: EducationContent =
      await this.getEducationById(id);

    let thumbnail: string | undefined;

    if (file) {
      if (existingEducation.thumbnail) {
        this.deleteThumbnailFile(existingEducation.thumbnail);
      }
      thumbnail = `uploads/education/${file.filename}`;
    }

    return this.educationRepository.update(id, data, thumbnail);
  }

  async deleteEducation(id: string): Promise<void> {
    const existingEducation: EducationContent =
      await this.getEducationById(id);

    if (existingEducation.thumbnail) {
      this.deleteThumbnailFile(existingEducation.thumbnail);
    }

    await this.educationRepository.delete(id);
  }
}
