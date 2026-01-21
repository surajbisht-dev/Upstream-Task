import PptxGenJS from "pptxgenjs";

import path from "path";
import fs from "fs";
import { ensureExportsDir } from "../config/storage.js";

const saveDataUrlToFile = (dataUrl, filename) => {
  const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1].split("/")[1];
  const data = matches[2];

  const exportsDir = ensureExportsDir();
  const filePath = path.join(exportsDir, `${filename}.${ext}`);
  fs.writeFileSync(filePath, Buffer.from(data, "base64"));
  return filePath;
};

export const generatePptForWidgets = async ({
  widgets,
  template,
  exportId,
}) => {
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";

  const primaryColor = template?.primaryColor || "#1F6FEB";
  const footerText = template?.footerText || "Upstream • Internal";
  const deckTitle = template?.title || "Dashboard Export";

  let logoPath = null;
  if (template?.logoDataUrl) {
    logoPath = saveDataUrlToFile(template.logoDataUrl, `logo-${exportId}`);
  }

  const now = new Date().toLocaleString();

  const maxWidgets = 20;
  const safeWidgets = widgets.slice(0, maxWidgets);

  for (const w of safeWidgets) {
    const slide = pptx.addSlide();

    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.35,
      fill: { color: primaryColor },
      line: { color: primaryColor },
    });

    // title
    slide.addText(`${deckTitle} — ${w.title}`, {
      x: 0.5,
      y: 0.45,
      w: 12.3,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: "111111",
    });

    // timestamp added here
    slide.addText(`Generated: ${now}`, {
      x: 0.5,
      y: 1.0,
      w: 12.3,
      h: 0.3,
      fontSize: 10,
      color: "444444",
    });

    if (logoPath) {
      slide.addImage({
        path: logoPath,
        x: 11.7,
        y: 0.42,
        w: 1.1,
        h: 0.6,
      });
    }

    const imgPath = saveDataUrlToFile(
      w.pngDataUrl,
      `widget-${exportId}-${w.id}`,
    );
    if (imgPath) {
      slide.addImage({
        path: imgPath,
        x: 0.7,
        y: 1.4,
        w: 12.0,
        h: 5.2,
      });
    } else {
      slide.addText("Unsupported widget image", {
        x: 0.7,
        y: 2.5,
        w: 12.0,
        h: 0.5,
        fontSize: 18,
        color: "cc0000",
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 7.1,
      w: 13.33,
      h: 0.4,
      fill: { color: primaryColor },
      line: { color: primaryColor },
    });

    slide.addText(footerText, {
      x: 0.5,
      y: 7.17,
      w: 12.3,
      h: 0.25,
      fontSize: 10,
      color: "FFFFFF",
    });
  }

  if (widgets.length > maxWidgets) {
    const slide = pptx.addSlide();
    slide.addText(
      `Note: You selected ${widgets.length} widgets.\nOnly first ${maxWidgets} were exported to keep file size safe.`,
      { x: 0.7, y: 1.5, w: 12, h: 2, fontSize: 18, color: "111111" },
    );
  }

  const exportsDir = ensureExportsDir();
  const filePath = path.join(exportsDir, `export-${exportId}.pptx`);

  await pptx.writeFile({ fileName: filePath });
  return filePath;
};
