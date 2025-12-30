const express = require('express');
const multer = require('multer');
const { getGridFS } = require('../config/gridfs');
const Image = require('../models/Image');
const { analyzeImage } = require('../services/visionService');
const { generateCaption } = require('../services/captionService');

const router = express.Router();

// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

// Upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const gridFS = getGridFS();
    const { buffer, originalname, mimetype } = req.file;

    // Vision API via OpenRouter
    const { labels, tags } = await analyzeImage(buffer, mimetype);

    // OpenRouter caption
    const caption = await generateCaption(buffer, mimetype);

    // Upload to GridFS
    const uploadStream = gridFS.openUploadStream(originalname, { contentType: mimetype });
    uploadStream.end(buffer);

    uploadStream.on('finish', async () => {
      const imageDoc = new Image({
        fileId: uploadStream.id,
        filename: originalname,
        contentType: mimetype,
        tags,
        labels,
        caption
      });

      await imageDoc.save();

      res.status(201).json({
        message: 'Image uploaded successfully',
        image: {
          id: imageDoc._id,
          fileId: imageDoc.fileId,
          filename: imageDoc.filename,
          caption: imageDoc.caption,
          tags: imageDoc.tags,
          labels: imageDoc.labels,
          uploadDate: imageDoc.uploadDate
        }
      });
    });

    uploadStream.on('error', err => {
      console.error(err);
      res.status(500).json({ error: 'GridFS upload failed' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// List images
router.get('/', async (req, res) => {
  const images = await Image.find().sort({ uploadDate: -1 }).select('-__v');
  res.json({ images, count: images.length });
});

// Get image metadata
router.get('/:id', async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) return res.status(404).json({ error: 'Not found' });
  res.json({ image });
});

// Stream image file
router.get('/:id/file', async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) return res.status(404).json({ error: 'Not found' });

  const gridFS = getGridFS();
  const stream = gridFS.openDownloadStream(image.fileId);

  res.setHeader('Content-Type', image.contentType);
  stream.pipe(res);
});

// Update caption
router.patch('/:id/caption', async (req, res) => {
  const { caption } = req.body;
  const image = await Image.findByIdAndUpdate(req.params.id, { caption }, { new: true });
  if (!image) return res.status(404).json({ error: 'Not found' });

  res.json({ message: 'Caption updated', image });
});

// Delete image
router.delete('/:id', async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) return res.status(404).json({ error: 'Not found' });

  const gridFS = getGridFS();
  await gridFS.delete(image.fileId);
  await Image.findByIdAndDelete(req.params.id);

  res.json({ message: 'Image deleted' });
});

module.exports = router;
