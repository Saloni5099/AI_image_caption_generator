# Quick Start Guide

## Important: Always run commands from the ROOT directory (D:\check)

## Step 1: Install Dependencies
```bash
npm run install-all
```

## Step 2: Set up Environment
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/imageDB
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your\credentials.json
```

## Step 3: Run the Application

### Option A: Run Both Server and Client Together
```bash
npm run dev
```

### Option B: Run Separately

**Terminal 1 (Server):**
```bash
npm run server
```

**Terminal 2 (Client):**
```bash
npm run client
```

## Troubleshooting

### If "npm run client" doesn't work:

1. **Check your current directory:**
   ```powershell
   Get-Location
   ```
   Should show: `D:\check`

2. **If you're in the wrong directory:**
   ```powershell
   cd D:\check
   ```

3. **Verify scripts exist:**
   ```powershell
   npm run
   ```
   Should show: `client` in the list

4. **Alternative - Run client directly:**
   ```powershell
   cd client
   npm start
   ```

### If you get "Missing script: client" error:

- You're probably in the `client` folder
- Go back to root: `cd ..` or `cd D:\check`
- Then run: `npm run client`

