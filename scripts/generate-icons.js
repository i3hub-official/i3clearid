import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, "../public/logo.png");
const dest = path.join(__dirname, "../public/icons");
const ogDest = path.join(__dirname, "../public");

// Ensure destination folder exists
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

// Define all icon sizes
const icons = [
    { size: 16, name: "favicon-16x16.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 48, name: "favicon-48x48.png" },
    { size: 57, name: "apple-touch-icon-57x57.png" },
    { size: 60, name: "apple-touch-icon-60x60.png" },
    { size: 72, name: "apple-touch-icon-72x72.png" },
    { size: 76, name: "apple-touch-icon-76x76.png" },
    { size: 96, name: "favicon-96x96.png" },
    { size: 114, name: "apple-touch-icon-114x114.png" },
    { size: 120, name: "apple-touch-icon-120x120.png" },
    { size: 144, name: "apple-touch-icon-144x144.png" },
    { size: 152, name: "apple-touch-icon-152x152.png" },
    { size: 180, name: "apple-touch-icon.png" },
    { size: 192, name: "android-chrome-192x192.png" },
    { size: 512, name: "android-chrome-512x512.png" },
];

async function generateIcons() {
    // Generate each PNG icon
    for (const icon of icons) {
        await sharp(src)
            .resize(icon.size, icon.size, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent padding if not square
            })
            .toFile(path.join(dest, icon.name));
        console.log(`Generated: ${icon.name}`);
    }

    // Generate multi-size favicon.ico (16x16 + 32x32 + 48x48)
    const icoSizes = [16, 32, 48];
    const buffers = await Promise.all(
        icoSizes.map((size) => sharp(src).resize(size, size).toBuffer())
    );
    await sharp({ create: { width: 48, height: 48, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite(buffers.map((buf, i) => ({ input: buf })))
        .toFile(path.join(dest, "favicon.ico"));
    console.log("Generated: favicon.ico");

    // Generate og-image.jpg (1200x630)
    await sharp(src)
        .resize(1200, 630, { fit: "cover" })
        .jpeg({ quality: 90 })
        .toFile(path.join(ogDest, "og-image.jpg"));
    console.log("Generated: og-image.jpg");
}

generateIcons()
    .then(() => console.log("All assets generated successfully!"))
    .catch((err) => console.error(err));
