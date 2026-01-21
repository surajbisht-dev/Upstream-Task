import fs from "fs";
import path from "path";

export const ensureExportsDir = () => {
  const dir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
};
