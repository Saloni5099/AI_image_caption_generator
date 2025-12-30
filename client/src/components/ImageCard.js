import React, { useState } from 'react';
import './ImageCard.css';
import axios from 'axios';

const ImageCard = ({ image, onCaptionUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(image.caption || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveCaption = async () => {
    try {
      setSaving(true);
      await axios.patch(`/api/images/${image._id}/caption`, { caption });
      setIsEditing(false);
      if (onCaptionUpdate) {
        onCaptionUpdate();
      }
    } catch (error) {
      alert('Failed to update caption: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setDeleting(true);
      await axios.delete(`/api/images/${image._id}`);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      alert('Failed to delete image: ' + (error.response?.data?.error || error.message));
      setDeleting(false);
    }
  };

  const imageUrl = `/api/images/${image._id}/file`;

  return (
    <div className="image-card">
      <div className="image-container">
        <img src={imageUrl} alt={image.filename} className="card-image" />
      </div>
      
      <div className="card-content">
        <h3 className="card-filename">{image.filename}</h3>
        
        {isEditing ? (
          <div className="caption-edit">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter caption..."
              className="caption-input"
              rows="3"
            />
            <div className="caption-actions">
              <button 
                onClick={handleSaveCaption} 
                disabled={saving}
                className="save-button"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setCaption(image.caption || '');
                }}
                disabled={saving}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="caption-display">
            <p className="caption-text">
              {image.caption || <em>No caption</em>}
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              ✏️ Edit Caption
            </button>
          </div>
        )}

        {/* Display AI-detected labels with confidence scores */}
        {image.labels && image.labels.length > 0 && (
          <div className="labels-container">
            <strong>🤖 AI Detected Labels:</strong>
            <div className="labels-list">
              {image.labels.map((label, index) => (
                <div key={index} className="label-item">
                  <span className="label-name">{label.description}</span>
                  <span className="label-score">
                    {(label.score * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display tags (derived from labels) */}
        {image.tags && image.tags.length > 0 && (
          <div className="tags-container">
            <strong>Tags:</strong>
            <div className="tags-list">
              {image.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card-actions">
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="delete-button"
          >
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>

        <div className="card-meta">
          <small>Uploaded: {new Date(image.uploadDate).toLocaleDateString()}</small>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

