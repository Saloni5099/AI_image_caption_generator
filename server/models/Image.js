const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'images.files'
  },
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  caption: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  labels: [{
    description: String,
    score: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);

