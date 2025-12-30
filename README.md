# Image Management System

A full-stack image management application with AI-powered tagging using OpenRouter (OpenAI-compatible) vision models, MongoDB GridFS, and React.

## Architecture

```
Browser (React Frontend)
    ↓ HTTP (Image upload, fetch list, edit caption)
Node.js + Express (Backend API Server)
    - Multer (upload)
    - GridFS (store)
    - Vision API call
    ↓ Store image chunks + metadata
MongoDB
    - fs.files (GridFS image chunks)
    - fs.chunks
    - images (tags, caption, fileId)
    ↓ Call external AI
Vision API (AI)
    - Detect labels
    - Generate tags
```

## Features

- **Image Upload**: Upload images with automatic AI-powered tagging
- **Auto Tagging**: Uses OpenRouter vision models to detect labels and generate tags
- **AI Caption Generation**: Automatically generates captions using OpenRouter
- **Caption Editing**: Edit captions for uploaded images
- **Image List**: View all uploaded images with their tags and captions
- **Image Deletion**: Delete images from both GridFS and metadata
- **GridFS Storage**: Efficient storage of large image files in MongoDB

### Development Mode (runs both server and client):

```bash
npm run dev
```

### Run Server Only:

```bash
npm run server
```

### Run Client Only:

```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
.
├── server/
│   ├── index.js              # Express server entry point
│   ├── config/
│   │   ├── gridfs.js         # GridFS configuration
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   └── Image.js          # Image metadata model
│   ├── routes/
│   │   └── images.js         # Image API routes
│   └── services/
│       └── visionService.js  # Vision API integration
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── ImageUpload.js
│   │   │   ├── ImageList.js
│   │   │   └── ImageCard.js
│   │   └── index.js
│   └── package.json
├── .env.example
└── README.md
```

## Technologies Used

### Backend
- **Express.js**: Web framework
- **MongoDB + Mongoose**: Database and ODM
- **GridFS**: Large file storage
- **Multer**: File upload handling
- **OpenRouter Vision Models**: AI image analysis and caption generation via OpenRouter chat completions API

### Frontend
- **React**: UI framework
- **Axios**: HTTP client
- **CSS3**: Styling with modern gradients and effects

## Notes

- Images are stored in MongoDB GridFS for efficient handling of large files
- OpenRouter vision models analyze images and generate tags automatically
- AI also generates captions for each uploaded image
- Only labels with confidence scores above 0.7 are included as tags
- Maximum file size is 10MB (configurable in `server/routes/images.js`)
- Uses `openai/gpt-4o` model on OpenRouter by default (can be changed via `OPENROUTER_VISION_MODEL`)


