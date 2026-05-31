import { Router } from "express";
import { prisma } from "@/lib/prisma";
import { EducationRepository } from "./education.repository";
import { EducationService } from "./education.service";
import { EducationController } from "./education.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { createUpload } from "@/middlewares/upload.middleware";

const upload = createUpload("education", "education");

const router: Router = Router();

const educationRepository = new EducationRepository(prisma);
const educationService = new EducationService(educationRepository);
const educationController = new EducationController(educationService);

router.get("/", (req, res, next) => {
  educationController.getAll(req as any, res, next);
});

router.get("/:id", educationController.getById);

router.post(
  "/",
  authenticate,
  upload.single("thumbnail"),
  educationController.create,
);

router.patch(
  "/:id",
  authenticate,
  upload.single("thumbnail"),
  educationController.update,
);

router.delete("/:id", authenticate, educationController.delete);

export default router;
