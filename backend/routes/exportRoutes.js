import { Router } from "express";
import {
  createPptExport,
  getExportStatus,
  downloadExport,
} from "../controllers/exportController.js";
import { validateBody } from "../middlewares/validateMiddleware.js";
import { createPptExportSchema } from "../validators/exportValidator.js";
import { validateObjectIdParam } from "../middlewares/validateObjectIdMiddleware.js";

const router = Router();

router.post("/ppt", validateBody(createPptExportSchema), createPptExport);

router.get("/:id/status", validateObjectIdParam("id"), getExportStatus);
router.get("/:id/download", validateObjectIdParam("id"), downloadExport);

export default router;
