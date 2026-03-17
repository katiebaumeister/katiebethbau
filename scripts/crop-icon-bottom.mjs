import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const iconPath = path.join(root, "icon.png");
const appIconPath = path.join(root, "app", "icon.png");
const cropPx = 120; // crop this many pixels off the bottom

const img = await Jimp.read(originalPath);
const w = img.bitmap.width;
const h = img.bitmap.height;
const newHeight = h - cropPx;

const cropped = img.crop({ x: 0, y: 0, w, h: newHeight });
await cropped.write(iconPath);
if (fs.existsSync(appIconPath)) {
  await cropped.write(appIconPath);
}
console.log(`Cropped ${cropPx}px off the bottom. New height: ${newHeight}`);
process.exit(0);
