import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../generated/prisma";
import { AuthRepository } from "./auth.repository";
import {
  ChangePasswordInput,
  LoginInput,
  UpdateProfileInput,
} from "./auth.validation";
import { AppError } from "@/middlewares/error.middleware";

const SALT_ROUNDS = 12;
const JWT_EXPIRES = "7d";

interface LoginResult {
  token: string;
  user: SafeUser;
}

export type SafeUser = Omit<User, "password">;

/**
 * Strip field `password` dari object user sebelum dikirim ke response.
 *
 * @param user - Object User dari Prisma
 * @returns User tanpa field password
 */
const toSafeUser = (user: User): SafeUser => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
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
  async login(data: LoginInput): Promise<LoginResult> {
    const user: User | null = await this.authRepository.findByEmail(data.email);

    // Tetap jalankan bcrypt.compare meski user tidak ada
    // untuk mencegah timing attack (response time tidak berbeda)
    const dummyHash = "$2b$12$dummyhashfortimingattackprevention123456789012";
    const passwordToCheck = user?.password ?? dummyHash;

    const isPasswordValid: boolean = await bcrypt.compare(
      data.password,
      passwordToCheck,
    );

    if (!user || !isPasswordValid) {
      throw new AppError("Email atau password salah", 401);
    }

    const token: string = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES },
    );

    return { token, user: toSafeUser(user) };
  }

  /**
   * Mengambil profil user yang sedang login berdasarkan ID dari token.
   *
   * @param userId - ID user dari JWT payload
   * @returns Data user tanpa password
   * @throws AppError 404 jika user tidak ditemukan
   */
  async getProfile(userId: string): Promise<SafeUser> {
    const user: User | null = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError("User tidak ditemukan", 404);
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
  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<SafeUser> {
    const user: User | null = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError("User tidak ditemukan", 404);
    }

    if (data.email && data.email !== user.email) {
      const emailTaken = await this.authRepository.findByEmailExcludeId(
        data.email,
        userId,
      );

      if (emailTaken) {
        throw new AppError("Email sudah digunakan", 409);
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
  async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ): Promise<void> {
    const user: User | null = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError("User tidak ditemukan", 404);
    }

    const isCurrentPasswordValid: boolean = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new AppError("Password saat ini salah", 401);
    }

    const hashedPassword: string = await bcrypt.hash(
      data.newPassword,
      SALT_ROUNDS,
    );

    await this.authRepository.updatePassword(userId, hashedPassword);
  }
}
