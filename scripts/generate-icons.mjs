import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconDir = join(root, "public", "icons");

async function generate() {
  const svgBuffer = readFileSync(join(iconDir, "icon-192.svg"));

  await sharp(svgBuffer)
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(join(iconDir, "icon-192.png"));
  console.log("✓ icon-192.png");

  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(join(iconDir, "icon-512.png"));
  console.log("✓ icon-512.png");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
