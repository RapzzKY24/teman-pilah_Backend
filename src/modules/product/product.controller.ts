import { NextFunction, Response } from "express";
import { paginatedResponse, successResponse } from "../../utils/response";
import { ProductService } from "./product.service";
import {
  createProductSchema,
  productQuerySchema,
  updateProductSchema,
} from "./product.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class ProductController {
  private readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  /**
   * Mengambil daftar semua produk dengan dukungan pagination, filter, dan pencarian.
   * Query params yang tersedia: page, limit, category, stockLabel, search.
   *
   * @param req - Express request dengan query params (AuthRequest)
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON daftar produk beserta meta pagination
   */
  getAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = productQuerySchema.parse(req.query);
      const { data, meta } = await this.productService.getAllProducts(query);

      paginatedResponse({
        res,
        message: "Berhasil mengambil data produk",
        data,
        meta,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil detail satu produk berdasarkan ID.
   *
   * @param req - Express request dengan `params.id` berisi ID produk
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON detail produk atau 404 jika tidak ditemukan
   */
  getById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const product = await this.productService.getProductById(id);

      successResponse({
        res,
        message: "Berhasil mengambil detail produk",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Membuat produk baru.
   * Mendukung upload gambar melalui multipart/form-data dengan field `image`.
   *
   * @param req - Express request dengan body data produk dan `req.file` dari multer
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON produk yang baru dibuat dengan status 201
   */
  create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await this.productService.createProduct(data, req.file);

      successResponse({
        res,
        statusCode: 201,
        message: "Produk berhasil ditambahkan",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengupdate produk berdasarkan ID.
   * Semua field bersifat opsional  hanya field yang dikirim yang diupdate.
   * Mendukung upload gambar baru melalui multipart/form-data dengan field `image`.
   *
   * @param req - Express request dengan `params.id`, body data update, dan `req.file` dari multer
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON produk yang telah diupdate atau 404 jika tidak ditemukan
   */
  update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const data = updateProductSchema.parse(req.body);
      const product = await this.productService.updateProduct(
        id,
        data,
        req.file,
      );

      successResponse({
        res,
        message: "Produk berhasil diupdate",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Menghapus produk berdasarkan ID secara permanen.
   * Gambar produk di disk akan ikut dihapus otomatis.
   *
   * @param req - Express request dengan `params.id` berisi ID produk
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON pesan sukses atau 404 jika tidak ditemukan
   */
  delete = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      await this.productService.deleteProduct(id);

      successResponse({
        res,
        message: "Produk berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  };
}
