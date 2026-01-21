import { Router } from "express";
import { listRisks, getRiskByTaskId } from "../controllers/riskController.js";

const router = Router();

router.get("/", listRisks);
router.get("/:taskId", getRiskByTaskId);

export default router;
