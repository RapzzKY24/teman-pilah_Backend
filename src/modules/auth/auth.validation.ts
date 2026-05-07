import { z } from "zod";

export enum Role {
  ADMIN = "ADMIN",
}

/**
 * Schema validasi untuk login.
 * Memastikan email valid dan password tidak kosong.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .trim()
    .toLowerCase(),

  password: z.string().min(1, "Password wajib diisi"),
});

/**
 * Schema validasi untuk ganti password.
 * Memastikan password baru berbeda dari konfirmasi.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),

    newPassword: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),

    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Password baru tidak boleh sama dengan password saat ini",
    path: ["newPassword"],
  });

/**
 * Schema validasi untuk update profil admin.
 * Semua field opsional
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim()
    .optional(),

  email: z
    .string()
    .email("Format email tidak valid")
    .trim()
    .toLowerCase()
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
