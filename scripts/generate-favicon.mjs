import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconPath = path.join(root, "app", "icon.png");
const outPath = path.join(root, "app", "favicon.ico");

const png = await sharp(iconPath)
  .resize(256, 256)
  .png()
  .toBuffer();

const ico = await toIco([png], { resize: true, sizes: [16, 32, 48] });
fs.writeFileSync(outPath, ico);
console.log("Wrote app/favicon.ico");
process.exit(0);
