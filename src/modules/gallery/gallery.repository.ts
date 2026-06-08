import { Gallery, PrismaClient } from "../../../generated/prisma";

interface FindAllOptions {
  skip: number;
  take: number;
  search?: string;
}

interface FindAllResult {
  data: Gallery[];
  total: number;
}

export class GalleryRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const { skip, take, search } = options;

    const where: Record<string, unknown> = {};

    if (search) {
      where.description = { contains: search, mode: "insensitive" as const };
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

  async findById(id: string): Promise<Gallery | null> {
    return this.prisma.gallery.findUnique({ where: { id } });
  }

  async create(data: { image: string; description?: string | null }): Promise<Gallery> {
    return this.prisma.gallery.create({
      data: {
        image: data.image,
        description: data.description ?? null,
      },
    });
  }

  async update(
    id: string,
    data: { image?: string; description?: string | null },
  ): Promise<Gallery> {
    const updateData: Record<string, unknown> = {};

    if (data.image !== undefined) updateData.image = data.image;
    if (data.description !== undefined) updateData.description = data.description;

    return this.prisma.gallery.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Gallery> {
    return this.prisma.gallery.delete({ where: { id } });
  }
}
