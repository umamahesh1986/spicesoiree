// Image storage: every item image lives in one folder (UPLOAD_DIR, default
// Server/uploads) and is served at /uploads/<file>. Uploads are re-encoded as
// WebP (max 1200px) so phones don't download multi-megabyte photos.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// sharp is a native module. Load it on first use so that, if the hosting
// machine can't run it, the website still works and only uploads are disabled.
let sharpModule;
function loadSharp() {
  if (sharpModule === undefined) {
    try {
      sharpModule = require('sharp');
    } catch (err) {
      console.error('Image processing unavailable (sharp failed to load):', err.message);
      sharpModule = null;
    }
  }
  return sharpModule;
}

function imageProcessingAvailable() {
  return Boolean(loadSharp());
}

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));
const PUBLIC_PREFIX = '/uploads';
const MAX_BYTES = 8 * 1024 * 1024; // before compression
const ALLOWED_FORMATS = ['jpeg', 'png', 'webp', 'gif', 'heif', 'avif']; // no SVG (can carry scripts)

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Kept in memory only long enough to validate and re-encode
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
});

function slugify(name) {
  return (
    String(name || '')
      .replace(/\.[a-z0-9]+$/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'image'
  );
}

class UploadError extends Error {}

// Validates by decoding the actual bytes (not the browser-supplied MIME type),
// then saves a compressed WebP. Returns the public path, e.g. /uploads/butter-naan-3f9a1c.webp
async function saveImage(buffer, originalName) {
  const sharp = loadSharp();
  if (!sharp) {
    throw new UploadError('Image uploads are not available on this server right now. Please contact support.');
  }
  let metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new UploadError('That file is not a valid image.');
  }
  if (!ALLOWED_FORMATS.includes(metadata.format)) {
    throw new UploadError('Please upload a JPG, PNG, WebP or GIF image.');
  }

  const output = await sharp(buffer, { animated: false })
    .rotate() // respect phone camera orientation
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${slugify(originalName)}-${crypto.randomBytes(4).toString('hex')}.webp`;
  await fs.promises.writeFile(path.join(UPLOAD_DIR, fileName), output);
  return `${PUBLIC_PREFIX}/${fileName}`;
}

module.exports = {
  UPLOAD_DIR,
  PUBLIC_PREFIX,
  upload,
  saveImage,
  UploadError,
  MAX_BYTES,
  imageProcessingAvailable,
};
