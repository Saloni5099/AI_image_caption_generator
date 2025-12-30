import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import ImageList from './components/ImageList';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      setError('Failed to fetch images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUploaded = () => {
    fetchImages();
  };

  const handleCaptionUpdated = () => {
    fetchImages();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🖼️ Image Management System</h1>
        <p>Upload images with AI-powered tagging</p>
      </header>

      <main className="App-main">
        <ImageUpload onUpload={handleImageUploaded} />
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading images...</div>
        ) : (
          <ImageList 
            images={images} 
            onCaptionUpdate={handleCaptionUpdated}
            onImageDelete={handleImageUploaded}
          />
        )}
      </main>
    </div>
  );
}

export default App;

