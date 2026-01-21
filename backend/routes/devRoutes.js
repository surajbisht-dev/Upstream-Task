import { Router } from "express";
import { Task } from "../models/taskModel.js";
import { Approval } from "../models/approvalModel.js";

const router = Router();

router.post("/seed", async (req, res) => {
  await Task.deleteMany({});
  await Approval.deleteMany({});

  const tasks = await Task.insertMany([
    { title: "Project kickoff", status: "Done" },
    { title: "Design spec", status: "In Progress", dueDate: "2025-08-20" },
    { title: "Backend API", status: "Not Started", dueDate: "2025-08-25" },
    { title: "Frontend UI", status: "Not Started", dueDate: "2025-08-27" },
    { title: "E2E tests", status: "Not Started", dueDate: "2025-08-30" },
  ]);

  const approvals = await Approval.insertMany([
    {
      title: "Budget sign-off",
      approverEmail: "exec@example.com",
      status: "Pending",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ]);

  res.json({ message: "Seeded", tasks, approvals });
});

export default router;
