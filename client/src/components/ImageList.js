import React, { useState } from 'react';
import './ImageList.css';
import ImageCard from './ImageCard';

const ImageList = ({ images, onCaptionUpdate, onImageDelete }) => {
  if (images.length === 0) {
    return (
      <div className="image-list empty">
        <p>No images uploaded yet. Upload your first image to get started!</p>
      </div>
    );
  }

  return (
    <div className="image-list">
      <h2>Your Images ({images.length})</h2>
      <div className="image-grid">
        {images.map(image => (
          <ImageCard
            key={image._id}
            image={image}
            onCaptionUpdate={onCaptionUpdate}
            onDelete={onImageDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageList;

