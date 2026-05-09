import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import productRoutes from "../modules/product/product.routes";
import newsRoutes from "../modules/news/news.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/news", newsRoutes);

console.log("Routes registered: auth, products, news");

export default router;