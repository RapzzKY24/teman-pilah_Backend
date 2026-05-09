"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsQuerySchema = exports.updateNewsSchema = exports.createNewsSchema = exports.NewsVisibility = exports.NewsStatus = void 0;
const zod_1 = require("zod");
var NewsStatus;
(function (NewsStatus) {
    NewsStatus["PUBLISHED"] = "PUBLISHED";
    NewsStatus["DRAFT"] = "DRAFT";
    NewsStatus["ARCHIVED"] = "ARCHIVED";
})(NewsStatus || (exports.NewsStatus = NewsStatus = {}));
var NewsVisibility;
(function (NewsVisibility) {
    NewsVisibility["PUBLIC"] = "PUBLIC";
    NewsVisibility["PRIVATE"] = "PRIVATE";
})(NewsVisibility || (exports.NewsVisibility = NewsVisibility = {}));
exports.createNewsSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Judul berita wajib diisi")
        .min(3, "Judul berita minimal 3 karakter")
        .max(200, "Judul berita maksimal 200 karakter")
        .trim(),
    slug: zod_1.z
        .string()
        .min(1, "Slug wajib diisi")
        .max(200, "Slug maksimal 200 karakter")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format slug tidak valid")
        .trim(),
    content: zod_1.z.string().min(1, "Konten berita wajib diisi").trim(),
    summary: zod_1.z
        .string()
        .max(300, "Summary maksimal 300 karakter")
        .trim()
        .optional(),
    category: zod_1.z
        .string()
        .min(1, "Kategori wajib diisi")
        .max(100, "Kategori maksimal 100 karakter")
        .trim(),
    authors: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string().trim()),
        zod_1.z.string().transform((val) => val.split(",").map((a) => a.trim()).filter(Boolean)),
    ])
        .optional()
        .default(["Admin Teman Pilah"]),
    tags: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string().trim()),
        zod_1.z.string().transform((val) => val.split(",").map((t) => t.trim()).filter(Boolean)),
    ])
        .optional()
        .default([]),
    status: zod_1.z.nativeEnum(NewsStatus).optional().default(NewsStatus.DRAFT),
    visibility: zod_1.z.nativeEnum(NewsVisibility).optional().default(NewsVisibility.PUBLIC),
    publishDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : null)),
});
exports.updateNewsSchema = exports.createNewsSchema.partial();
exports.newsQuerySchema = zod_1.z.object({
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
    category: zod_1.z.string().trim().optional(),
    status: zod_1.z.nativeEnum(NewsStatus).optional(),
    visibility: zod_1.z.nativeEnum(NewsVisibility).optional(),
    search: zod_1.z
        .string()
        .max(100, "Keyword pencarian terlalu panjang")
        .trim()
        .optional(),
});
