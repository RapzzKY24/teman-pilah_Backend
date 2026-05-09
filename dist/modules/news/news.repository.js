"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRepository = void 0;
const error_middleware_1 = require("@/middlewares/error.middleware");
const news_validation_1 = require("./news.validation");
class NewsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(options) {
        const { skip, take, category, status, visibility, search } = options;
        const where = {
            ...(category && { category }),
            ...(status && { status }),
            ...(visibility && { visibility }),
            ...(search && {
                title: { contains: search, mode: "insensitive" },
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
    async findById(id) {
        return this.prisma.news.findUnique({ where: { id } });
    }
    async findBySlug(slug) {
        return this.prisma.news.findUnique({ where: { slug } });
    }
    async create(data, imageUrl) {
        const existingSlug = await this.prisma.news.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            throw new error_middleware_1.AppError("Slug sudah digunakan, gunakan slug lain", 400);
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
                status: data.status ?? news_validation_1.NewsStatus.DRAFT,
                visibility: data.visibility ?? news_validation_1.NewsVisibility.PUBLIC,
                publishDate: data.publishDate ?? null,
                imageUrl: imageUrl ?? null,
            },
        });
    }
    async update(id, data, imageUrl) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.slug !== undefined)
            updateData.slug = data.slug;
        if (data.content !== undefined)
            updateData.content = data.content;
        if (data.summary !== undefined)
            updateData.summary = data.summary;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.authors !== undefined)
            updateData.authors = data.authors;
        if (data.tags !== undefined)
            updateData.tags = data.tags;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.visibility !== undefined)
            updateData.visibility = data.visibility;
        if (data.publishDate !== undefined)
            updateData.publishDate = data.publishDate;
        if (imageUrl !== undefined)
            updateData.imageUrl = imageUrl;
        return this.prisma.news.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        return this.prisma.news.delete({ where: { id } });
    }
}
exports.NewsRepository = NewsRepository;
