"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const product_repository_1 = require("./product.repository");
const product_service_1 = require("./product.service");
const prisma_1 = require("@/lib/prisma");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const upload_middleware_1 = require("@/middlewares/upload.middleware");
const router = (0, express_1.Router)();
const productRepository = new product_repository_1.ProductRepository(prisma_1.prisma);
const productService = new product_service_1.ProductService(productRepository);
const productController = new product_controller_1.ProductController(productService);
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
router.post("/", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), productController.create);
/**
 * @route   PATCH /api/products/:id
 * @desc    Mengupdate produk berdasarkan ID (partial update)
 * @access  Private (Admin)
 * @param   id - Product ID (cuid)
 * @body    multipart/form-data — field yang ingin diupdate (semua opsional)
 */
router.patch("/:id", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), productController.update);
/**
 * @route   DELETE /api/products/:id
 * @desc    Menghapus produk berdasarkan ID secara permanen
 * @access  Private (Admin)
 * @param   id - Product ID (cuid)
 */
router.delete("/:id", auth_middleware_1.authenticate, productController.delete);
exports.default = router;
