"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pagination_1 = require("../../utils/pagination");
const error_middleware_1 = require("@/middlewares/error.middleware");
class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    deleteImageFile(imagePath) {
        const fullPath = path_1.default.join(process.cwd(), imagePath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
    }
    /**
     * Mengambil daftar produk dengan pagination, filter, dan pencarian.
     *
     * @param query - Query parameter dari request (page, limit, category, search, stockLabel)
     * @returns Daftar produk beserta meta pagination
     */
    async getAllProducts(query) {
        const { skip, take, page, limit } = (0, pagination_1.parsePagination)(query);
        const { data, total } = await this.productRepository.findAll({
            skip,
            take,
            category: query.category,
            stockLabel: query.stockLabel,
            search: query.search,
        });
        return {
            data,
            meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
        };
    }
    /**
     * Mengambil detail satu produk berdasarkan ID.
     * Melempar error 404 jika produk tidak ditemukan.
     *
     * @param id - ID produk (cuid)
     * @returns Data produk yang ditemukan
     * @throws AppError 404 jika produk tidak ada
     */
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new error_middleware_1.AppError("Produk tidak ditemukan", 404);
        }
        return product;
    }
    /**
     * Membuat produk baru.
     * Menyimpan path gambar jika ada file yang diupload.
     *
     * @param data - Data produk yang sudah divalidasi
     * @param file - File gambar dari multer (opsional)
     * @returns Produk yang baru dibuat
     */
    async createProduct(data, file) {
        const imagePath = file
            ? `uploads/products/${file.filename}`
            : undefined;
        return this.productRepository.create(data, imagePath);
    }
    /**
     * Mengupdate produk berdasarkan ID.
     * Jika ada gambar baru yang diupload, gambar lama akan otomatis dihapus dari disk.
     * Melempar error 404 jika produk tidak ditemukan.
     *
     * @param id - ID produk yang akan diupdate
     * @param data - Field yang ingin diupdate (semua opsional)
     * @param file - File gambar baru dari multer (opsional)
     * @returns Produk yang telah diupdate
     * @throws AppError 404 jika produk tidak ada
     */
    async updateProduct(id, data, file) {
        const existingProduct = await this.getProductById(id);
        let imagePath;
        if (file) {
            // Hapus gambar lama dari disk sebelum replace dengan yang baru
            if (existingProduct.image) {
                this.deleteImageFile(existingProduct.image);
            }
            imagePath = `uploads/products/${file.filename}`;
        }
        return this.productRepository.update(id, data, imagePath);
    }
    /**
     * Menghapus produk berdasarkan ID secara permanen.
     * Gambar produk di disk juga ikut dihapus jika ada.
     * Melempar error 404 jika produk tidak ditemukan.
     *
     * @param id - ID produk yang akan dihapus
     * @returns Void
     * @throws AppError 404 jika produk tidak ada
     */
    async deleteProduct(id) {
        const existingProduct = await this.getProductById(id);
        if (existingProduct.image) {
            this.deleteImageFile(existingProduct.image);
        }
        await this.productRepository.delete(id);
    }
}
exports.ProductService = ProductService;
