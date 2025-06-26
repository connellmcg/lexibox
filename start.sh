#!/bin/bash

echo "🚀 Starting LexiBox - PDF Text Extraction & Search"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing backend dependencies..."
source venv/bin/activate
if ! pip install -r requirements.txt; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "📦 Setting up frontend..."
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
if ! npm install; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Check if Tailwind CSS PostCSS plugin is installed
if ! npm list @tailwindcss/postcss > /dev/null 2>&1; then
    echo "Installing Tailwind CSS PostCSS plugin..."
    npm install -D @tailwindcss/postcss
fi

echo ""
echo "🎯 Starting servers..."
echo ""

# Start backend in background
echo "🔧 Starting FastAPI backend on http://localhost:8000"
cd ../backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ Backend failed to start properly"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "🎨 Starting Vite frontend on http://localhost:5173"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "⚠️  Frontend may still be starting up..."
fi

echo ""
echo "✅ LexiBox is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 