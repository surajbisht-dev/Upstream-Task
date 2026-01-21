import { z } from "zod";

export const createApprovalSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  approverEmail: z.string().email("Valid email required"),
});
