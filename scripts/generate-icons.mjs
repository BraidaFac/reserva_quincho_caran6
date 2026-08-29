import sharp from "sharp";
import { readFileSync, copyFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconDir = join(root, "public", "icons");
const publicDir = join(root, "public");

// icon-192.svg: 192x192 viewBox, full-bleed bg — fuente para todos los tamaños PWA
const svgBuffer = readFileSync(join(iconDir, "icon-192.svg"));
// favicon.svg: 64x64 viewBox — más legible en tamaños pequeños
const faviconSvgBuffer = readFileSync(join(publicDir, "favicon.svg"));

const sizes = [48, 72, 96, 144, 152, 167, 180, 192, 512];

async function generate() {
  // PNGs estándar
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(iconDir, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }

  // maskable-512: misma imagen (ya tiene fondo full-bleed y safe zone correcta)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(join(iconDir, "maskable-512.png"));
  console.log("✓ maskable-512.png");

  // apple-touch-icon en public/ (legacy compatibility)
  copyFileSync(join(iconDir, "icon-180.png"), join(publicDir, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png → public/");

  // favicon PNGs (para convertir a .ico manualmente)
  const fav32 = await sharp(faviconSvgBuffer).resize(32, 32).png({ compressionLevel: 9 }).toBuffer();
  const fav16 = await sharp(faviconSvgBuffer).resize(16, 16).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(join(publicDir, "favicon-32.png"), fav32);
  writeFileSync(join(publicDir, "favicon-16.png"), fav16);
  console.log("✓ favicon-32.png / favicon-16.png → public/");

  console.log(`
Siguiente paso para favicon.ico:
  1. Subir public/favicon-32.png a https://favicon.io/favicon-converter/
  2. Descargar el .ico resultante
  3. Copiarlo a src/app/favicon.ico
  `);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
