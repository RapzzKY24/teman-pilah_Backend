"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationRepository = void 0;
const error_middleware_1 = require("@/middlewares/error.middleware");
const education_validation_1 = require("./education.validation");
class EducationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(options) {
        const { skip, take, status, search } = options;
        const where = {
            ...(status && { status }),
            ...(search && {
                title: { contains: search, mode: "insensitive" },
            }),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.educationContent.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.educationContent.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id) {
        return this.prisma.educationContent.findUnique({ where: { id } });
    }
    async findBySlug(slug) {
        return this.prisma.educationContent.findUnique({ where: { slug } });
    }
    async create(data, thumbnail) {
        const existingSlug = await this.prisma.educationContent.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            throw new error_middleware_1.AppError("Slug sudah digunakan, gunakan slug lain", 400);
        }
        return this.prisma.educationContent.create({
            data: {
                title: data.title,
                slug: data.slug,
                overview: data.overview,
                description: data.description,
                tags: data.tags ?? [],
                status: data.status ?? education_validation_1.ContentStatus.DRAFT,
                publishDate: data.publishDate ?? null,
                thumbnail: thumbnail ?? null,
            },
        });
    }
    async update(id, data, thumbnail) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.slug !== undefined)
            updateData.slug = data.slug;
        if (data.overview !== undefined)
            updateData.overview = data.overview;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.tags !== undefined)
            updateData.tags = data.tags;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.publishDate !== undefined)
            updateData.publishDate = data.publishDate;
        if (thumbnail !== undefined)
            updateData.thumbnail = thumbnail;
        return this.prisma.educationContent.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        return this.prisma.educationContent.delete({ where: { id } });
    }
}
exports.EducationRepository = EducationRepository;
