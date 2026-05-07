import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import productRoutes from "../modules/product/product.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

export default router;
