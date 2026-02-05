import sharp from "sharp";
import fs from "fs";
import path from "path";

const SVG_PATH = path.join(__dirname, "../public/svg_icons/dragon-svgrepo-com.svg");
const ICONS_DIR = path.join(__dirname, "../public/icons");
const PUBLIC_DIR = path.join(__dirname, "../public");

const SIZES = [
  { size: 192, output: path.join(ICONS_DIR, "icon-192x192.png") },
  { size: 512, output: path.join(ICONS_DIR, "icon-512x512.png") },
  { size: 180, output: path.join(PUBLIC_DIR, "apple-touch-icon.png") },
];

async function generateIcons() {
  // Ensure icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  // Read the SVG file
  const svgBuffer = fs.readFileSync(SVG_PATH);

  console.log("Generating PWA icons from dragon SVG...\n");

  for (const { size, output } of SIZES) {
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: "contain",
        background: { r: 26, g: 26, b: 46, alpha: 1 }, // #1a1a2e
      })
      .png()
      .toFile(output);

    console.log(`  Created: ${path.basename(output)} (${size}x${size})`);
  }

  console.log("\nIcon generation complete!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
