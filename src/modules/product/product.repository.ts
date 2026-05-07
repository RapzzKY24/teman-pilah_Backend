import { AppError } from "@/middlewares/error.middleware";
import { PrismaClient, Product } from "../../../generated/prisma";
import {
  Category,
  StockLabel,
  CreateProductInput,
  UpdateProductInput,
} from "./product.validation";

interface FindAllOptions {
  skip: number;
  take: number;
  category?: Category;
  stockLabel?: StockLabel;
  search?: string;
}

interface FindAllResult {
  data: Product[];
  total: number;
}

interface ProductWhereClause {
  category?: Category;
  stockLabel?: StockLabel;
  name?: {
    contains: string;
    mode: "insensitive";
  };
}

export class ProductRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Membuat product code unik berdasarkan kategori.
   * Format: TP-{PREFIX}-{3 digit angka urut}
   * Contoh: TP-UP-001, TP-OR-042, TP-ZW-015
   *
   * @param category - Kategori produk untuk menentukan prefix
   * @returns Product code yang unik
   */
  private async generateProductCode(category: Category): Promise<string> {
    const prefixMap: Record<Category, string> = {
      [Category.UPCYCLED_GOODS]: "UP",
      [Category.ORGANIC]: "OR",
      [Category.ZERO_WASTE]: "ZW",
    };

    const prefix: string = prefixMap[category];

    const count: number = await this.prisma.product.count({
      where: { category } as ProductWhereClause,
    });

    const sequence: string = String(count + 1).padStart(3, "0");
    return `TP-${prefix}-${sequence}`;
  }

  /**
   * Mengambil semua produk dengan support pagination, filter kategori,
   * filter stockLabel, dan pencarian berdasarkan nama produk.
   *
   * @param options - Opsi filter, pencarian, dan pagination
   * @returns Object berisi array produk dan total count
   */
  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const { skip, take, category, stockLabel, search } = options;

    const where: ProductWhereClause = {
      ...(category && { category }),
      ...(stockLabel && { stockLabel }),
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count({ where: where }),
    ]);

    return { data, total };
  }

  /**
   * Mengambil satu produk berdasarkan ID.
   *
   * @param id - ID produk (cuid)
   * @returns Produk yang ditemukan atau null
   */
  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  /**
   * Mengambil satu produk berdasarkan product code.
   *
   * @param productCode - Kode unik produk, contoh: TP-UP-001
   * @returns Produk yang ditemukan atau null
   */
  async findByProductCode(productCode: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { productCode },
    });
  }

  /**
   * Membuat produk baru ke database.
   * Product code di-generate otomatis berdasarkan kategori.
   *
   * @param data - Data produk yang sudah divalidasi
   * @param imagePath - Path file gambar hasil upload (opsional)
   * @returns Produk yang baru dibuat
   */
  async create(data: CreateProductInput, imagePath?: string): Promise<Product> {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingProduct) {
      throw new AppError("Produk sudah ditambahkan", 400);
    }

    const productCode = await this.generateProductCode(data.category);

    return this.prisma.product.create({
      data: {
        productCode,
        name: data.name,
        category: data.category,
        description: data.description ?? null,
        price: data.price,
        priceUnit: data.priceUnit ?? null,
        stock: data.stock,
        stockLabel: data.stockLabel,
        whatsappLink: data.whatsappLink || null,
        image: imagePath ?? null,
      },
    });
  }

  /**
   * Mengupdate data produk berdasarkan ID.
   * Hanya field yang dikirim yang akan diupdate (partial update).
   *
   * @param id - ID produk yang akan diupdate
   * @param data - Field yang ingin diupdate (semua opsional)
   * @param imagePath - Path file gambar baru (opsional, hanya jika ada upload baru)
   * @returns Produk yang telah diupdate
   */
  async update(
    id: string,
    data: UpdateProductInput,
    imagePath?: string,
  ): Promise<Product> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.priceUnit !== undefined) updateData.priceUnit = data.priceUnit;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.stockLabel !== undefined) updateData.stockLabel = data.stockLabel;
    if (data.whatsappLink !== undefined)
      updateData.whatsappLink = data.whatsappLink || null;
    if (imagePath !== undefined) updateData.image = imagePath;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Menghapus produk berdasarkan ID secara permanen dari database.
   *
   * @param id - ID produk yang akan dihapus
   * @returns Produk yang telah dihapus
   */
  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
