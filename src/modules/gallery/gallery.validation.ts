import { z } from "zod";

export const createGallerySchema = z.object({
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .trim()
    .optional(),
});

export const updateGallerySchema = createGallerySchema.partial();

export const galleryQuerySchema = z.object({
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

  search: z
    .string()
    .max(100, "Keyword pencarian terlalu panjang")
    .trim()
    .optional(),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type GalleryQueryInput = z.infer<typeof galleryQuerySchema>;
