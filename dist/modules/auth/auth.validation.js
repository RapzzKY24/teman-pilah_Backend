"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.changePasswordSchema = exports.loginSchema = exports.Role = void 0;
const zod_1 = require("zod");
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
/**
 * Schema validasi untuk login.
 * Memastikan email valid dan password tidak kosong.
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid")
        .trim()
        .toLowerCase(),
    password: zod_1.z.string().min(1, "Password wajib diisi"),
});
/**
 * Schema validasi untuk ganti password.
 * Memastikan password baru berbeda dari konfirmasi.
 */
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: zod_1.z
        .string()
        .min(8, "Password baru minimal 8 karakter")
        .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
        .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),
    confirmPassword: zod_1.z.string().min(1, "Konfirmasi password wajib diisi"),
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
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Nama minimal 2 karakter")
        .max(100, "Nama maksimal 100 karakter")
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email("Format email tidak valid")
        .trim()
        .toLowerCase()
        .optional(),
});
