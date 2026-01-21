import fs from "fs";
import path from "path";
import { ExportJob } from "../models/exportJobModel.js";
import { generatePptForWidgets } from "../services/pptService.js";

export const createPptExport = async (req, res, next) => {
  try {
    const { widgetIds, scope = "dashboard", template = {}, widgets } = req.body;

    // extra safety
    if (!widgetIds || widgetIds.length === 0) {
      return res.status(400).json({ message: "Select at least one widget" });
    }

    const job = await ExportJob.create({
      state: "queued",
      scope,
      widgetIds,
      template,
      widgets,
    });

    job.state = "processing";
    await job.save();

    try {
      const filePath = await generatePptForWidgets({
        widgets,
        template,
        exportId: job._id.toString(),
      });

      job.filePath = filePath;
      job.state = "ready";
      await job.save();
    } catch (e) {
      job.state = "error";
      job.errorMessage = e.message;
      await job.save();
    }

    res.status(201).json({ exportId: job._id });
  } catch (err) {
    next(err);
  }
};

export const getExportStatus = async (req, res, next) => {
  try {
    const job = await ExportJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Export not found" });

    res.json({
      state: job.state,
      errorMessage: job.state === "error" ? job.errorMessage : "",
    });
  } catch (err) {
    next(err);
  }
};

export const downloadExport = async (req, res, next) => {
  try {
    const job = await ExportJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Export not found" });

    if (job.state !== "ready") {
      return res
        .status(400)
        .json({ message: `Export not ready. Current: ${job.state}` });
    }

    if (!job.filePath || !fs.existsSync(job.filePath)) {
      return res.status(404).json({ message: "PPT file missing" });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(job.filePath)}"`,
    );

    fs.createReadStream(job.filePath).pipe(res);
  } catch (err) {
    next(err);
  }
};
