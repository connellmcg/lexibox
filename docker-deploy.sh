#!/bin/bash

# LexiBox Docker Deployment Script

set -e

echo "🐳 LexiBox Docker Deployment"
echo "============================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose down
}

# Set trap to cleanup on script exit
trap cleanup EXIT

echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are healthy
echo "🏥 Checking service health..."
if docker-compose ps | grep -q "healthy"; then
    echo "✅ All services are healthy!"
else
    echo "⚠️  Some services may still be starting up..."
fi

echo ""
echo "🎉 LexiBox is now running!"
echo "📱 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "To stop the services, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
echo ""

# Keep the script running to maintain the trap
echo "Press Ctrl+C to stop the services..."
while true; do
    sleep 1
done 