import React, { useState } from 'react';
import './ImageUpload.css';
import axios from 'axios';

const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus({ type: 'error', message: 'Please select an image file' });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setUploadStatus({ type: 'info', message: 'Uploading and analyzing image...' });

      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Format labels for display
      const labelsText = response.data.image.labels && response.data.image.labels.length > 0
        ? response.data.image.labels.map(l => `${l.description} (${(l.score * 100).toFixed(0)}%)`).join(', ')
        : 'None detected';
      
      setUploadStatus({ 
        type: 'success', 
        message: `✅ Image uploaded successfully! AI detected: ${labelsText}` 
      });
      
      // Reset form
      setFile(null);
      setPreview(null);
      e.target.reset();
      
      // Notify parent
      if (onUpload) {
        onUpload();
      }
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to upload image' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Image</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
          />
          <label htmlFor="image-upload" className="file-label">
            {file ? file.name : 'Choose Image File'}
          </label>
        </div>

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}

        <button 
          type="submit" 
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload & Analyze'}
        </button>

        {uploadStatus && (
          <div className={`upload-status ${uploadStatus.type}`}>
            {uploadStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ImageUpload;

