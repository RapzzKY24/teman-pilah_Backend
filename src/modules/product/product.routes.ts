import { Router } from "express";

import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

import { prisma } from "@/lib/prisma";
import { authenticate } from "@/middlewares/auth.middleware";
import { createUpload } from "@/middlewares/upload.middleware";

const upload = createUpload("products", "product");

const router: Router = Router();

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

/**
 * @route   GET /api/products
 * @desc    Mengambil semua produk dengan pagination, filter, dan pencarian
 * @query   page, limit, category, stockLabel, search
 */
router.get("/", productController.getAll);

/**
 * @route   GET /api/products/:id
 * @desc    Mengambil detail produk berdasarkan ID
 * @param   id - Product ID (cuid)
 */
router.get("/:id", productController.getById);

/**
 * @route   POST /api/products
 * @desc    Membuat produk baru
 * @access  Private (Admin)
 * @body    multipart/form-data — name, category, price, stock, stockLabel, (opsional: description, priceUnit, whatsappLink, image)
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  productController.create,
);

/**
 * @route   PATCH /api/products/:id
 * @desc    Mengupdate produk berdasarkan ID (partial update)
 * @access  Private (Admin)
 * @param   id - Product ID (cuid)
 * @body    multipart/form-data — field yang ingin diupdate (semua opsional)
 */
router.patch(
  "/:id",
  authenticate,
  upload.single("image"),
  productController.update,
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Menghapus produk berdasarkan ID secara permanen
 * @access  Private (Admin)
 * @param   id - Product ID (cuid)
 */
router.delete("/:id", authenticate, productController.delete);

export default router;
