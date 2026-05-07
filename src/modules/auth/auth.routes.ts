import { Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/middlewares/auth.middleware";

const router: Router = Router();

// Dependency injection
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

/**
 * @route   POST /api/auth/login
 * @desc    Login admin dan mendapatkan JWT token
 * @access  ADMIN
 * @body    { email: string, password: string }
 */
router.post("/login", authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Mengambil profil admin yang sedang login
 */
router.get("/me", authenticate, authController.getProfile);

/**
 * @route   PATCH /api/auth/me
 * @desc    Mengupdate profil admin (nama dan/atau email)
 * @body    { name?: string, email?: string }
 */
router.patch("/me", authenticate, authController.updateProfile);

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Mengganti password admin
 * @body    { currentPassword: string, newPassword: string, confirmPassword: string }
 */
router.patch("/change-password", authenticate, authController.changePassword);

export default router;
