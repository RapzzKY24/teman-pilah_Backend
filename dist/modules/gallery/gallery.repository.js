"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRepository = void 0;
class GalleryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(options) {
        const { skip, take, search } = options;
        const where = {};
        if (search) {
            where.description = { contains: search, mode: "insensitive" };
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.gallery.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.gallery.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id) {
        return this.prisma.gallery.findUnique({ where: { id } });
    }
    async create(data) {
        return this.prisma.gallery.create({
            data: {
                image: data.image,
                description: data.description ?? null,
            },
        });
    }
    async update(id, data) {
        const updateData = {};
        if (data.image !== undefined)
            updateData.image = data.image;
        if (data.description !== undefined)
            updateData.description = data.description;
        return this.prisma.gallery.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        return this.prisma.gallery.delete({ where: { id } });
    }
}
exports.GalleryRepository = GalleryRepository;
