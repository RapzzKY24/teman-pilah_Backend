import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/response";
import { AuthService } from "./auth.service";
import {
  changePasswordSchema,
  loginSchema,
  updateProfileSchema,
} from "./auth.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Memproses request login admin.
   * Mengembalikan JWT token dan data user jika kredensial valid.
   *
   * @param req - Express request dengan body `{ email, password }`
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON berisi token dan data user dengan status 200
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.authService.login(data);

      successResponse({
        res,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil profil admin yang sedang login.
   * Membutuhkan JWT token yang valid di header Authorization.
   *
   * @param req - AuthRequest dengan `userId` dari JWT payload
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON data profil user tanpa password
   */
  getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.userId as string);

      successResponse({
        res,
        message: "Berhasil mengambil profil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengupdate profil admin (nama dan/atau email).
   * Hanya field yang dikirim yang akan diupdate.
   *
   * @param req - AuthRequest dengan `userId` dari JWT payload dan body `{ name?, email? }`
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON data profil yang telah diupdate
   */
  updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = updateProfileSchema.parse(req.body);
      const user = await this.authService.updateProfile(
        req.userId as string,
        data,
      );

      successResponse({
        res,
        message: "Profil berhasil diupdate",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengganti password admin.
   * Memerlukan password saat ini untuk verifikasi sebelum update.
   *
   * @param req - AuthRequest dengan `userId` dari JWT payload dan body
   *              `{ currentPassword, newPassword, confirmPassword }`
   * @param res - Express response
   * @param next - Express next function untuk error handling
   * @returns JSON pesan sukses
   */
  changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = changePasswordSchema.parse(req.body);
      await this.authService.changePassword(req.userId as string, data);

      successResponse({
        res,
        message: "Password berhasil diubah",
      });
    } catch (error) {
      next(error);
    }
  };
}
