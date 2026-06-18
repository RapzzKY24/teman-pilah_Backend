"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.educationQuerySchema = exports.updateEducationSchema = exports.createEducationSchema = exports.ContentStatus = void 0;
const zod_1 = require("zod");
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
exports.createEducationSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Judul edukasi wajib diisi")
        .min(3, "Judul edukasi minimal 3 karakter")
        .max(200, "Judul edukasi maksimal 200 karakter")
        .trim(),
    slug: zod_1.z
        .string()
        .min(1, "Slug wajib diisi")
        .max(200, "Slug maksimal 200 karakter")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format slug tidak valid")
        .trim(),
    overview: zod_1.z.string().min(1, "Overview edukasi wajib diisi").trim(),
    description: zod_1.z.string().min(1, "Deskripsi edukasi wajib diisi").trim(),
    tags: zod_1.z
        .union([
        zod_1.z.array(zod_1.z.string().trim()),
        zod_1.z.string().transform((val) => val.split(",").map((t) => t.trim()).filter(Boolean)),
    ])
        .optional()
        .default([]),
    status: zod_1.z.nativeEnum(ContentStatus).optional().default(ContentStatus.DRAFT),
    publishDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : null)),
});
exports.updateEducationSchema = exports.createEducationSchema.partial();
exports.educationQuerySchema = zod_1.z.object({
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
    status: zod_1.z.nativeEnum(ContentStatus).optional(),
    search: zod_1.z
        .string()
        .max(100, "Keyword pencarian terlalu panjang")
        .trim()
        .optional(),
});
