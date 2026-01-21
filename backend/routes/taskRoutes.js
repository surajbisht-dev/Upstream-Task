import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  listTasks,
} from "../controllers/taskController.js";
import { validateBody } from "../middlewares/validateMiddleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator.js";
import { validateObjectIdParam } from "../middlewares/validateObjectIdMiddleware.js";

const router = Router();

router.post("/", validateBody(createTaskSchema), createTask);
router.get("/", listTasks);

router.get("/:id", validateObjectIdParam("id"), getTaskById);
router.put(
  "/:id",
  validateObjectIdParam("id"),
  validateBody(updateTaskSchema),
  updateTask,
);
router.delete("/:id", validateObjectIdParam("id"), deleteTask);

export default router;
