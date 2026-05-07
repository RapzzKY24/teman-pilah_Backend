import { z } from "zod";

export enum Category {
  UPCYCLED_GOODS = "UPCYCLED_GOODS",
  ORGANIC = "ORGANIC",
  ZERO_WASTE = "ZERO_WASTE",
}

export enum StockLabel {
  IN_STOCK = "IN_STOCK",
  BULK_AVAILABLE = "BULK_AVAILABLE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .min(3, "Nama produk minimal 3 karakter")
    .max(100, "Nama produk maksimal 100 karakter")
    .trim(),

  category: z.nativeEnum(Category, {
    error:
      "Kategori tidak valid. Pilih: UPCYCLED_GOODS, ORGANIC, atau ZERO_WASTE",
  }),

  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .trim()
    .optional(),

  price: z
    .string()
    .min(1, "Harga wajib diisi")
    .regex(/^\d+(\.\d{1,2})?$/, "Format harga tidak valid")
    .transform((val) => parseFloat(val)),

  priceUnit: z
    .string()
    .max(20, "Satuan harga maksimal 20 karakter")
    .trim()
    .optional(),

  stock: z
    .string()
    .min(1, "Stok wajib diisi")
    .regex(/^\d+$/, "Stok harus berupa angka")
    .transform((val) => parseInt(val, 10)),

  stockLabel: z.nativeEnum(StockLabel, {
    error:
      "Label stok tidak valid. Pilih: IN_STOCK, BULK_AVAILABLE, atau OUT_OF_STOCK",
  }),

  whatsappLink: z
    .union([z.string().url("Format WhatsApp link tidak valid"), z.literal("")])
    .optional(),
});

/**
 * Schema validasi untuk update produk.
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Schema validasi untuk query parameter pagination & filter produk.
 */
export const productQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page harus berupa angka")
    .optional()
    .default("1"),

  limit: z
    .string()
    .regex(/^\d+$/, "Limit harus berupa angka")
    .optional()
    .default("10"),

  category: z.nativeEnum(Category).optional(),

  search: z
    .string()
    .max(100, "Keyword pencarian terlalu panjang")
    .trim()
    .optional(),

  stockLabel: z.nativeEnum(StockLabel).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
