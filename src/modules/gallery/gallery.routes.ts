import { Router } from "express";
import { prisma } from "@/lib/prisma";
import { GalleryRepository } from "./gallery.repository";
import { GalleryService } from "./gallery.service";
import { GalleryController } from "./gallery.controller";
import { createUpload } from "@/middlewares/upload.middleware";
import { authenticate } from "@/middlewares/auth.middleware";

const upload = createUpload("gallery", "gallery");

const router: Router = Router();

const galleryRepository = new GalleryRepository(prisma);
const galleryService = new GalleryService(galleryRepository);
const galleryController = new GalleryController(galleryService);

router.get("/", (req, res, next) => {
  galleryController.getAll(req as any, res, next);
});

router.get("/:id", galleryController.getById);

router.post(
  "/",
  authenticate,
  upload.single("image"),
  galleryController.create,
);

router.patch(
  "/:id",
  authenticate,
  upload.single("image"),
  galleryController.update,
);

router.delete("/:id", authenticate, galleryController.delete);

export default router;
