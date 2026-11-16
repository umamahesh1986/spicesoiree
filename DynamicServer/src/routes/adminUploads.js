// POST /api/admin/uploads  (multipart/form-data, field "image") -> 201 { url }
// Mounted under the admin router, so role = admin is enforced.
const express = require('express');
const multer = require('multer');
const { upload, saveImage, UploadError, MAX_BYTES } = require('../uploads');

const router = express.Router();

router.post('/', (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? `Image is too large (max ${MAX_BYTES / 1024 / 1024} MB).`
          : 'Upload failed. Please choose one image file.';
      return res.status(400).json({ error: message });
    }
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ error: 'Please choose an image to upload.' });

    try {
      res.status(201).json({ url: await saveImage(req.file.buffer, req.file.originalname) });
    } catch (saveErr) {
      if (saveErr instanceof UploadError) return res.status(400).json({ error: saveErr.message });
      next(saveErr);
    }
  });
});

module.exports = router;
