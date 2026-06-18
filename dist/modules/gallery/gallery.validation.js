"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryQuerySchema = exports.updateGallerySchema = exports.createGallerySchema = void 0;
const zod_1 = require("zod");
exports.createGallerySchema = zod_1.z.object({
    description: zod_1.z
        .string()
        .max(500, "Deskripsi maksimal 500 karakter")
        .trim()
        .optional(),
});
exports.updateGallerySchema = exports.createGallerySchema.partial();
exports.galleryQuerySchema = zod_1.z.object({
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
    search: zod_1.z
        .string()
        .max(100, "Keyword pencarian terlalu panjang")
        .trim()
        .optional(),
});
