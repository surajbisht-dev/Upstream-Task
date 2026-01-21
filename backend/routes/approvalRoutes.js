import { Router } from "express";
import {
  createApproval,
  getApprovalById,
  listApprovals,
  approvalAction,
} from "../controllers/approvalController.js";
import { validateBody } from "../middlewares/validateMiddleware.js";
import { createApprovalSchema } from "../validators/approvalValidator.js";
import { validateObjectIdParam } from "../middlewares/validateObjectIdMiddleware.js";

const router = Router();

router.post("/", validateBody(createApprovalSchema), createApproval);
router.get("/", listApprovals);
router.get("/action", approvalAction);
router.get("/:id", validateObjectIdParam("id"), getApprovalById);

export default router;
