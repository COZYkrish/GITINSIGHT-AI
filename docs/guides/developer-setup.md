# Local Developer Setup Guide

Follow this guide to get GitInsight AI running locally on your workstation.

## Prerequisites
- **Node.js**: v20.x or v22.x+
- **MongoDB**: v6.0+ local daemon or MongoDB Atlas URI
- **Redis**: v7.0+ for BullMQ background job queues
- **GitHub OAuth App**: Registered in GitHub Developer Settings
- **Gemini API Key**: Google AI Studio API key

## Step 1: Clone and Install
```bash
git clone https://github.com/COZYkrish/GITINSIGHT-AI.git
cd GITINSIGHT-AI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Environment Configuration
Copy `.env.example` in both `backend` and `frontend` directories:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Step 3: Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` to view the application.
