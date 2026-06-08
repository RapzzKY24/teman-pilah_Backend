import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import productRoutes from "../modules/product/product.routes";
import newsRoutes from "../modules/news/news.routes";
import educationRoutes from "../modules/education/education.routes";
import galleryRoutes from "../modules/gallery/gallery.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/news", newsRoutes);
router.use("/education", educationRoutes);
router.use("/gallery", galleryRoutes);

console.log("Routes registered: auth, products, news, education, gallery");

export default router;