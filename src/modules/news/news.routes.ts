import { Router } from "express";
import { prisma } from "@/lib/prisma";
import { NewsRepository } from "./news.repository";
import { NewsService } from "./news.service";
import { NewsController } from "./news.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { uploadNews } from "@/middlewares/upload.middleware";

const router: Router = Router();

const newsRepository = new NewsRepository(prisma);
const newsService = new NewsService(newsRepository);
const newsController = new NewsController(newsService);

router.get("/", (req, res, next) => {
  newsController.getAll(req as any, res, next);
});

router.get("/:id", newsController.getById);

router.post(
  "/",
  authenticate,
  uploadNews.single("imageUrl"),
  newsController.create,
);

router.patch(
  "/:id",
  authenticate,
  uploadNews.single("imageUrl"),
  newsController.update,
);

router.delete("/:id", authenticate, newsController.delete);
// router.delete("/:id", newsController.delete);

export default router;
