import mongoose from "mongoose";

const tokenInfoSchema = new mongoose.Schema(
  {
    hash: { type: String },
    consumedAt: { type: Date, default: null },
  },
  { _id: false },
);

const approvalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    approverEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "On Hold"],
      default: "Pending",
    },

    tokens: {
      approve: { type: tokenInfoSchema, default: () => ({}) },
      reject: { type: tokenInfoSchema, default: () => ({}) },
      hold: { type: tokenInfoSchema, default: () => ({}) },
    },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Approval = mongoose.model("Approval", approvalSchema);
