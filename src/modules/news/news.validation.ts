import { z } from "zod";

export enum NewsStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}

export enum NewsVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(1, "Judul berita wajib diisi")
    .min(3, "Judul berita minimal 3 karakter")
    .max(200, "Judul berita maksimal 200 karakter")
    .trim(),

  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format slug tidak valid")
    .trim(),

  content: z.string().min(1, "Konten berita wajib diisi").trim(),

  summary: z
    .string()
    .max(300, "Summary maksimal 300 karakter")
    .trim()
    .optional(),

  category: z
    .string()
    .min(1, "Kategori wajib diisi")
    .max(100, "Kategori maksimal 100 karakter")
    .trim(),

  authors: z
    .union([
      z.array(z.string().trim()),
      z.string().transform((val) =>
        val.split(",").map((a) => a.trim()).filter(Boolean)
      ),
    ])
    .optional()
    .default(["Admin Teman Pilah"]),

  tags: z
    .union([
      z.array(z.string().trim()),
      z.string().transform((val) =>
        val.split(",").map((t) => t.trim()).filter(Boolean)
      ),
    ])
    .optional()
    .default([]),

  status: z.nativeEnum(NewsStatus).optional().default(NewsStatus.DRAFT),

  visibility: z.nativeEnum(NewsVisibility).optional().default(NewsVisibility.PUBLIC),

  publishDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),

  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),

  partnership: z
    .string()
    .trim()
    .optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export const newsQuerySchema = z.object({
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

  category: z.string().trim().optional(),

  status: z.nativeEnum(NewsStatus).optional(),

  visibility: z.nativeEnum(NewsVisibility).optional(),

  search: z
    .string()
    .max(100, "Keyword pencarian terlalu panjang")
    .trim()
    .optional(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type NewsQueryInput = z.infer<typeof newsQuerySchema>;