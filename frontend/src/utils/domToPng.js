import * as htmlToImage from "html-to-image";

export const captureElementToPng = async (element) => {
  if (!element) return null;

  // 2x pixelRatio gives better look in PPT
  const pngDataUrl = await htmlToImage.toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "white",
  });

  return pngDataUrl;
};
