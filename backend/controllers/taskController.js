import { Task } from "../models/taskModel.js";
import {
  checkCycle,
  computeBlockedInfo,
} from "../services/dependencyService.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, status, dueDate, dependencies = [] } = req.body;

    const task = await Task.create({
      title,
      status: status || "Not Started",
      dueDate: dueDate ? new Date(dueDate) : null,
      dependencies,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, status, dueDate, dependencies } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (status !== undefined) update.status = status;
    if (dueDate !== undefined)
      update.dueDate = dueDate ? new Date(dueDate) : null;
    if (dependencies !== undefined) update.dependencies = dependencies;

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    const cycleInfo = checkCycle(tasks);
    const blockedInfo = computeBlockedInfo(tasks);

    res.json({ tasks, blockedInfo, cycleInfo });
  } catch (err) {
    next(err);
  }
};
