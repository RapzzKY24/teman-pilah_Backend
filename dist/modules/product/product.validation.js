"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = exports.StockLabel = exports.Category = void 0;
const zod_1 = require("zod");
var Category;
(function (Category) {
    Category["UPCYCLED_GOODS"] = "UPCYCLED_GOODS";
    Category["ORGANIC"] = "ORGANIC";
    Category["ZERO_WASTE"] = "ZERO_WASTE";
})(Category || (exports.Category = Category = {}));
var StockLabel;
(function (StockLabel) {
    StockLabel["IN_STOCK"] = "IN_STOCK";
    StockLabel["BULK_AVAILABLE"] = "BULK_AVAILABLE";
    StockLabel["OUT_OF_STOCK"] = "OUT_OF_STOCK";
})(StockLabel || (exports.StockLabel = StockLabel = {}));
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Nama produk wajib diisi")
        .min(3, "Nama produk minimal 3 karakter")
        .max(100, "Nama produk maksimal 100 karakter")
        .trim(),
    category: zod_1.z.nativeEnum(Category, {
        error: "Kategori tidak valid. Pilih: UPCYCLED_GOODS, ORGANIC, atau ZERO_WASTE",
    }),
    description: zod_1.z
        .string()
        .max(1000, "Deskripsi maksimal 1000 karakter")
        .trim()
        .optional(),
    price: zod_1.z
        .string()
        .min(1, "Harga wajib diisi")
        .regex(/^\d+(\.\d{1,2})?$/, "Format harga tidak valid")
        .transform((val) => parseFloat(val)),
    priceUnit: zod_1.z
        .string()
        .max(20, "Satuan harga maksimal 20 karakter")
        .trim()
        .optional(),
    stock: zod_1.z
        .string()
        .min(1, "Stok wajib diisi")
        .regex(/^\d+$/, "Stok harus berupa angka")
        .transform((val) => parseInt(val, 10)),
    stockLabel: zod_1.z.nativeEnum(StockLabel, {
        error: "Label stok tidak valid. Pilih: IN_STOCK, BULK_AVAILABLE, atau OUT_OF_STOCK",
    }),
    whatsappLink: zod_1.z
        .union([zod_1.z.string().url("Format WhatsApp link tidak valid"), zod_1.z.literal("")])
        .optional(),
});
/**
 * Schema validasi untuk update produk.
 */
exports.updateProductSchema = exports.createProductSchema.partial();
/**
 * Schema validasi untuk query parameter pagination & filter produk.
 */
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .regex(/^\d+$/, "Page harus berupa angka")
        .optional()
        .default("1"),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, "Limit harus berupa angka")
        .optional()
        .default("10"),
    category: zod_1.z.nativeEnum(Category).optional(),
    search: zod_1.z
        .string()
        .max(100, "Keyword pencarian terlalu panjang")
        .trim()
        .optional(),
    stockLabel: zod_1.z.nativeEnum(StockLabel).optional(),
});
