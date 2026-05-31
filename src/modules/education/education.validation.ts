import { z } from "zod";

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export const createEducationSchema = z.object({
  title: z
    .string()
    .min(1, "Judul edukasi wajib diisi")
    .min(3, "Judul edukasi minimal 3 karakter")
    .max(200, "Judul edukasi maksimal 200 karakter")
    .trim(),

  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format slug tidak valid")
    .trim(),

  overview: z.string().min(1, "Overview edukasi wajib diisi").trim(),

  description: z.string().min(1, "Deskripsi edukasi wajib diisi").trim(),

  tags: z
    .union([
      z.array(z.string().trim()),
      z.string().transform((val) =>
        val.split(",").map((t) => t.trim()).filter(Boolean),
      ),
    ])
    .optional()
    .default([]),

  status: z.nativeEnum(ContentStatus).optional().default(ContentStatus.DRAFT),

  publishDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
});

export const updateEducationSchema = createEducationSchema.partial();

export const educationQuerySchema = z.object({
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

  status: z.nativeEnum(ContentStatus).optional(),

  search: z
    .string()
    .max(100, "Keyword pencarian terlalu panjang")
    .trim()
    .optional(),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
export type EducationQueryInput = z.infer<typeof educationQuerySchema>;
