import { Product } from "../../../generated/prisma";
import fs from "fs";
import path from "path";
import {
  buildPaginationMeta,
  parsePagination,
  PaginationMeta,
} from "../../utils/pagination";
import { ProductRepository } from "./product.repository";
import {
  CreateProductInput,
  ProductQueryInput,
  UpdateProductInput,
} from "./product.validation";
import { AppError } from "@/middlewares/error.middleware";

interface ProductListResult {
  data: Product[];
  meta: PaginationMeta;
}

export class ProductService {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  private deleteImageFile(imagePath: string): void {
    const fullPath: string = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  /**
   * Mengambil daftar produk dengan pagination, filter, dan pencarian.
   *
   * @param query - Query parameter dari request (page, limit, category, search, stockLabel)
   * @returns Daftar produk beserta meta pagination
   */
  async getAllProducts(query: ProductQueryInput): Promise<ProductListResult> {
    const { skip, take, page, limit } = parsePagination(query);

    const { data, total } = await this.productRepository.findAll({
      skip,
      take,
      category: query.category,
      stockLabel: query.stockLabel,
      search: query.search,
    });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
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
  async getProductById(id: string): Promise<Product> {
    const product: Product | null = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError("Produk tidak ditemukan", 404);
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
  async createProduct(
    data: CreateProductInput,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const imagePath: string | undefined = file
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
  async updateProduct(
    id: string,
    data: UpdateProductInput,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const existingProduct: Product = await this.getProductById(id);

    let imagePath: string | undefined;

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
  async deleteProduct(id: string): Promise<void> {
    const existingProduct: Product = await this.getProductById(id);

    if (existingProduct.image) {
      this.deleteImageFile(existingProduct.image);
    }

    await this.productRepository.delete(id);
  }
}
