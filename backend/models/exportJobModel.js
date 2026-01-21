import mongoose from "mongoose";

const exportJobSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      enum: ["queued", "processing", "ready", "error"],
      default: "queued",
    },

    scope: { type: String, enum: ["board", "dashboard"], default: "dashboard" },

    widgetIds: [{ type: String }],

    template: {
      primaryColor: { type: String, default: "#1F6FEB" },
      footerText: { type: String, default: "Upstream • Internal" },
      title: { type: String, default: "Dashboard Export" },

      logoDataUrl: { type: String, default: "" },
    },

    widgets: [
      {
        id: String,
        title: String,
        pngDataUrl: String,
      },
    ],

    filePath: { type: String, default: "" },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ExportJob = mongoose.model("ExportJob", exportJobSchema);
