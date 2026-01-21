import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Blocked", "Done"],
      default: "Not Started",
    },

    dueDate: { type: Date, default: null },

    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
