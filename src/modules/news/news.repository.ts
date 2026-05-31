import { AppError } from "@/middlewares/error.middleware";
import { News, PrismaClient } from "../../../generated/prisma";
import {
  NewsStatus,
  NewsVisibility,
  CreateNewsInput,
  UpdateNewsInput,
} from "./news.validation";

interface FindAllOptions {
  skip: number;
  take: number;
  category?: string;
  status?: NewsStatus;
  visibility?: NewsVisibility;
  search?: string;
}

interface FindAllResult {
  data: News[];
  total: number;
}

interface NewsWhereClause {
  category?: string;
  status?: NewsStatus;
  visibility?: NewsVisibility;
  title?: {
    contains: string;
    mode: "insensitive";
  };
}

export class NewsRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const { skip, take, category, status, visibility, search } = options;

    const where: NewsWhereClause = {
      ...(category && { category }),
      ...(status && { status }),
      ...(visibility && { visibility }),
      ...(search && {
        title: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.news.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<News | null> {
    return this.prisma.news.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<News | null> {
    return this.prisma.news.findUnique({ where: { slug } });
  }

  async create(data: CreateNewsInput, imageUrl?: string): Promise<News> {
    const existingSlug = await this.prisma.news.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new AppError("Slug sudah digunakan, gunakan slug lain", 400);
    }

    return this.prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        summary: data.summary ?? null,
        category: data.category,
        authors: data.authors ?? ["Admin Teman Pilah"],
        tags: data.tags ?? [],
        status: data.status ?? NewsStatus.DRAFT,
        visibility: data.visibility ?? NewsVisibility.PUBLIC,
        publishDate: data.publishDate ?? null,
        endDate: data.endDate ?? null,
        partnership: data.partnership ?? null,
        imageUrl: imageUrl ?? null,
      },
    });
  }

  async update(
    id: string,
    data: UpdateNewsInput,
    imageUrl?: string,
  ): Promise<News> {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.authors !== undefined) updateData.authors = data.authors;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.publishDate !== undefined) updateData.publishDate = data.publishDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.partnership !== undefined) updateData.partnership = data.partnership;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    return this.prisma.news.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<News> {
    return this.prisma.news.delete({ where: { id } });
  }
}