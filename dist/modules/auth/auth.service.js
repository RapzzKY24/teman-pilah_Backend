"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("@/middlewares/error.middleware");
const SALT_ROUNDS = 12;
const JWT_EXPIRES = "7d";
/**
 * Strip field `password` dari object user sebelum dikirim ke response.
 *
 * @param user - Object User dari Prisma
 * @returns User tanpa field password
 */
const toSafeUser = (user) => {
    const { password: _password, ...safeUser } = user;
    return safeUser;
};
class AuthService {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    /**
     * Memproses login admin.
     * Memverifikasi email dan password, lalu menghasilkan JWT token.
     * Pesan error dibuat generik ("Email atau password salah") untuk
     * menghindari user enumeration attack.
     *
     * @param data - Kredensial login (email & password)
     * @returns JWT token dan data user tanpa password
     * @throws AppError 401 jika email tidak ditemukan atau password salah
     */
    async login(data) {
        const user = await this.authRepository.findByEmail(data.email);
        // Tetap jalankan bcrypt.compare meski user tidak ada
        // untuk mencegah timing attack (response time tidak berbeda)
        const dummyHash = "$2b$12$dummyhashfortimingattackprevention123456789012";
        const passwordToCheck = user?.password ?? dummyHash;
        const isPasswordValid = await bcrypt_1.default.compare(data.password, passwordToCheck);
        if (!user || !isPasswordValid) {
            throw new error_middleware_1.AppError("Email atau password salah", 401);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });
        return { token, user: toSafeUser(user) };
    }
    /**
     * Mengambil profil user yang sedang login berdasarkan ID dari token.
     *
     * @param userId - ID user dari JWT payload
     * @returns Data user tanpa password
     * @throws AppError 404 jika user tidak ditemukan
     */
    async getProfile(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new error_middleware_1.AppError("User tidak ditemukan", 404);
        }
        return toSafeUser(user);
    }
    /**
     * Mengupdate profil admin (nama dan/atau email).
     * Memvalidasi email baru tidak sudah dipakai user lain sebelum update.
     *
     * @param userId - ID user dari JWT payload
     * @param data - Data profil yang ingin diupdate
     * @returns Data user yang telah diupdate tanpa password
     * @throws AppError 404 jika user tidak ditemukan
     * @throws AppError 409 jika email sudah digunakan user lain
     */
    async updateProfile(userId, data) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new error_middleware_1.AppError("User tidak ditemukan", 404);
        }
        if (data.email && data.email !== user.email) {
            const emailTaken = await this.authRepository.findByEmailExcludeId(data.email, userId);
            if (emailTaken) {
                throw new error_middleware_1.AppError("Email sudah digunakan", 409);
            }
        }
        const updated = await this.authRepository.updateProfile(userId, data);
        return toSafeUser(updated);
    }
    /**
     * Mengganti password admin.
     * Memverifikasi password saat ini sebelum meng-hash dan menyimpan yang baru.
     *
     * @param userId - ID user dari JWT payload
     * @param data - Data ganti password (currentPassword, newPassword, confirmPassword)
     * @returns Void
     * @throws AppError 404 jika user tidak ditemukan
     * @throws AppError 401 jika password saat ini salah
     */
    async changePassword(userId, data) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new error_middleware_1.AppError("User tidak ditemukan", 404);
        }
        const isCurrentPasswordValid = await bcrypt_1.default.compare(data.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new error_middleware_1.AppError("Password saat ini salah", 401);
        }
        const hashedPassword = await bcrypt_1.default.hash(data.newPassword, SALT_ROUNDS);
        await this.authRepository.updatePassword(userId, hashedPassword);
    }
}
exports.AuthService = AuthService;
