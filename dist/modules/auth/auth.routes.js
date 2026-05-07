"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_repository_1 = require("./auth.repository");
const auth_service_1 = require("./auth.service");
const prisma_1 = require("@/lib/prisma");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Dependency injection
const authRepository = new auth_repository_1.AuthRepository(prisma_1.prisma);
const authService = new auth_service_1.AuthService(authRepository);
const authController = new auth_controller_1.AuthController(authService);
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
router.get("/me", auth_middleware_1.authenticate, authController.getProfile);
/**
 * @route   PATCH /api/auth/me
 * @desc    Mengupdate profil admin (nama dan/atau email)
 * @body    { name?: string, email?: string }
 */
router.patch("/me", auth_middleware_1.authenticate, authController.updateProfile);
/**
 * @route   PATCH /api/auth/change-password
 * @desc    Mengganti password admin
 * @body    { currentPassword: string, newPassword: string, confirmPassword: string }
 */
router.patch("/change-password", auth_middleware_1.authenticate, authController.changePassword);
exports.default = router;
