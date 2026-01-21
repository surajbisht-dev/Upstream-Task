import { Task } from "../models/taskModel.js";
import {
  computeAllRisks,
  computeRiskForTask,
} from "../services/riskService.js";

export const listRisks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    const risks = computeAllRisks(tasks);

    res.json(risks);
  } catch (err) {
    next(err);
  }
};

export const getRiskByTaskId = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    const idToTask = new Map();
    tasks.forEach((t) => idToTask.set(String(t._id), t));

    const task = idToTask.get(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const risk = computeRiskForTask(task, idToTask);
    res.json({ taskId: String(task._id), ...risk });
  } catch (err) {
    next(err);
  }
};
