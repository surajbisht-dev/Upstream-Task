import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, "Title too short"),
  status: z.enum(["Not Started", "In Progress", "Blocked", "Done"]).optional(),
  dueDate: z.string().optional(), // we convert in controller
  dependencies: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
