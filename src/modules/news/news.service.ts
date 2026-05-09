import { News } from "../../../generated/prisma";
import fs from "fs";
import path from "path";
import {
  buildPaginationMeta,
  parsePagination,
  PaginationMeta,
} from "../../utils/pagination";
import { NewsRepository } from "./news.repository";
import {
  CreateNewsInput,
  NewsQueryInput,
  UpdateNewsInput,
} from "./news.validation";
import { AppError } from "@/middlewares/error.middleware";

interface NewsListResult {
  data: News[];
  meta: PaginationMeta;
}

export class NewsService {
  private readonly newsRepository: NewsRepository;

  constructor(newsRepository: NewsRepository) {
    this.newsRepository = newsRepository;
  }

  private deleteImageFile(imagePath: string): void {
    const fullPath: string = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getAllNews(query: NewsQueryInput): Promise<NewsListResult> {
    const { skip, take, page, limit } = parsePagination(query);

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
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getNewsById(id: string): Promise<News> {
    const news: News | null = await this.newsRepository.findById(id);

    if (!news) {
      throw new AppError("Berita tidak ditemukan", 404);
    }

    return news;
  }

  async getNewsBySlug(slug: string): Promise<News> {
    const news: News | null = await this.newsRepository.findBySlug(slug);

    if (!news) {
      throw new AppError("Berita tidak ditemukan", 404);
    }

    return news;
  }

  async createNews(
    data: CreateNewsInput,
    file?: Express.Multer.File,
  ): Promise<News> {
    const imageUrl: string | undefined = file
      ? `uploads/news/${file.filename}`
      : undefined;

    return this.newsRepository.create(data, imageUrl);
  }

  async updateNews(
    id: string,
    data: UpdateNewsInput,
    file?: Express.Multer.File,
  ): Promise<News> {
    const existingNews: News = await this.getNewsById(id);

    let imageUrl: string | undefined;

    if (file) {
      if (existingNews.imageUrl) {
        this.deleteImageFile(existingNews.imageUrl);
      }
      imageUrl = `uploads/news/${file.filename}`;
    }

    return this.newsRepository.update(id, data, imageUrl);
  }

  async deleteNews(id: string): Promise<void> {
    const existingNews: News = await this.getNewsById(id);

    if (existingNews.imageUrl) {
      this.deleteImageFile(existingNews.imageUrl);
    }

    await this.newsRepository.delete(id);
  }
}