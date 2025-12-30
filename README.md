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

- 📤 **Image Upload**: Upload images with automatic AI-powered tagging
- 🏷️ **Auto Tagging**: Uses OpenRouter vision models to detect labels and generate tags
- 🤖 **AI Caption Generation**: Automatically generates captions using OpenRouter
- 📝 **Caption Editing**: Edit captions for uploaded images
- 📋 **Image List**: View all uploaded images with their tags and captions
- 🗑️ **Image Deletion**: Delete images from both GridFS and metadata
- 💾 **GridFS Storage**: Efficient storage of large image files in MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- OpenRouter account with credits/billing set up

## Installation

1. **Install all dependencies (root and client):**

```bash
npm run install-all
```

This will install both server and client dependencies. Alternatively, you can install them manually:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

**Important:** Make sure both `node_modules` folders exist:
- `D:\check\node_modules` (server dependencies)
- `D:\check\client\node_modules` (client dependencies including react-scripts)

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/imageDB
PORT=5000
OPENROUTER_API_KEY=your-openrouter-api-key-here
# Optional overrides (these defaults are usually fine)
# OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
# OPENROUTER_VISION_MODEL=openai/gpt-4o-mini
```

3. **Set up OpenRouter API:**

   - Go to [OpenRouter](https://openrouter.ai/keys)
   - Sign up or log in to your account
   - Create a new API key
   - Copy the API key and paste it in your `.env` file as `OPENROUTER_API_KEY`
   - Note: You'll need to have credits/billing set up in your OpenRouter account

## Running the Application

**Important:** All commands should be run from the **root directory** (`d:\check`), not from the `client` folder.

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

**Note:** If you're already in the `client` directory, use `npm start` instead of `npm run client`.

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Upload Image
```
POST /api/images/upload
Content-Type: multipart/form-data
Body: { image: File }
```

### Get All Images
```
GET /api/images
```

### Get Single Image
```
GET /api/images/:id
```

### Get Image File
```
GET /api/images/:id/file
```

### Update Caption
```
PATCH /api/images/:id/caption
Body: { caption: string }
```

### Delete Image
```
DELETE /api/images/:id
```

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
- Uses `openai/gpt-4o-mini` model on OpenRouter by default (can be changed via `OPENROUTER_VISION_MODEL`)

## Troubleshooting

### "nodemon is not recognised" Error

If you see this error, you're trying to run `nodemon` directly from the command line. Since nodemon is installed locally (not globally), you should use npm scripts instead:

**✅ Correct:**
```bash
npm run server
```

**❌ Incorrect:**
```bash
nodemon server/index.js
```

Alternatively, you can use:
```bash
npx nodemon server/index.js
```

Or run the production version without nodemon:
```bash
npm run server:start
```

### "Missing script: client" Error

If you see this error, you're trying to run `npm run client` from inside the `client` directory. 

**✅ Correct (from root directory):**
```bash
npm run client
```

**✅ Also correct (if you're in client directory):**
```bash
npm start
```

**❌ Incorrect:**
```bash
cd client
npm run client  # This won't work!
```

Always run `npm run client` from the **root directory** of the project, or use `npm start` if you're already in the `client` folder.

### "'react-scripts' is not recognized" Error

This means the client dependencies haven't been installed yet.

**Solution:**
```bash
# From root directory
npm run install-all

# Or manually
cd client
npm install
cd ..
```

After installing, try running the client again:
```bash
npm run client
```

### Other Common Issues

- **MongoDB Connection Error**: Make sure MongoDB is running and the connection string in `.env` is correct
- **OpenRouter API Error**: 
  - Ensure `OPENROUTER_API_KEY` is set correctly in your `.env` file
  - Make sure you have credits/billing set up in your OpenRouter account
  - Check that your API key has the necessary permissions
- **Port Already in Use**: Change the `PORT` in `.env` if port 5000 is already in use

## License

ISC

