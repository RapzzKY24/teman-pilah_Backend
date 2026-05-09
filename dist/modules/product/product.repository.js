"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const error_middleware_1 = require("@/middlewares/error.middleware");
const product_validation_1 = require("./product.validation");
class ProductRepository {
    prisma;
    constructor(prisma) {
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
    async generateProductCode(category) {
        const prefixMap = {
            [product_validation_1.Category.UPCYCLED_GOODS]: "UP",
            [product_validation_1.Category.ORGANIC]: "OR",
            [product_validation_1.Category.ZERO_WASTE]: "ZW",
        };
        const prefix = prefixMap[category];
        const count = await this.prisma.product.count({
            where: { category },
        });
        const sequence = String(count + 1).padStart(3, "0");
        return `TP-${prefix}-${sequence}`;
    }
    /**
     * Mengambil semua produk dengan support pagination, filter kategori,
     * filter stockLabel, dan pencarian berdasarkan nama produk.
     *
     * @param options - Opsi filter, pencarian, dan pagination
     * @returns Object berisi array produk dan total count
     */
    async findAll(options) {
        const { skip, take, category, stockLabel, search } = options;
        const where = {
            ...(category && { category }),
            ...(stockLabel && { stockLabel }),
            ...(search && {
                name: { contains: search, mode: "insensitive" },
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
    async findById(id) {
        return this.prisma.product.findUnique({ where: { id } });
    }
    /**
     * Mengambil satu produk berdasarkan product code.
     *
     * @param productCode - Kode unik produk, contoh: TP-UP-001
     * @returns Produk yang ditemukan atau null
     */
    async findByProductCode(productCode) {
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
    async create(data, imagePath) {
        const existingProduct = await this.prisma.product.findFirst({
            where: {
                name: data.name,
            },
        });
        if (existingProduct) {
            throw new error_middleware_1.AppError("Produk sudah ditambahkan", 400);
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
    async update(id, data, imagePath) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.priceUnit !== undefined)
            updateData.priceUnit = data.priceUnit;
        if (data.stock !== undefined)
            updateData.stock = data.stock;
        if (data.stockLabel !== undefined)
            updateData.stockLabel = data.stockLabel;
        if (data.whatsappLink !== undefined)
            updateData.whatsappLink = data.whatsappLink || null;
        if (imagePath !== undefined)
            updateData.image = imagePath;
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
    async delete(id) {
        return this.prisma.product.delete({ where: { id } });
    }
}
exports.ProductRepository = ProductRepository;
