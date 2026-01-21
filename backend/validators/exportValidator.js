import { z } from "zod";

export const createPptExportSchema = z.object({
  widgetIds: z.array(z.string()).min(1, "Select at least one widget"),
  scope: z.enum(["board", "dashboard"]).optional(),

  widgets: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        pngDataUrl: z.string().min(10),
      }),
    )
    .min(1, "No widget images found"),

  template: z
    .object({
      primaryColor: z.string().optional(),
      footerText: z.string().optional(),
      title: z.string().optional(),
      logoDataUrl: z.string().optional(), // optional logo upload as dataUrl
    })
    .optional(),
});
