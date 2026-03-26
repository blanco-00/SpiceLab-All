#!/bin/bash
set -e

echo "=== SpiceLab Deploy Script ==="

cd "$(dirname "$0")/.."

if [ "$1" = "dev" ]; then
    echo "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    echo ""
    echo "Development environment started!"
    echo "MySQL: localhost:3306"
    echo "Username: spicelab"
    echo "Password: spicelab123"
    echo ""
    echo "Backend: cd SpiceLab-Private/apps/backend && mvn spring-boot:run"
    echo "Frontend: cd SpiceLab/apps/web && npm run dev"
elif [ "$1" = "build" ]; then
    echo "Building for production..."
    
    echo "Building backend..."
    cd SpiceLab-Private/apps/backend
    mvn clean package -DskipTests
    
    echo "Building frontend..."
    cd ../../SpiceLab/apps/web
    npm run build
    
    echo ""
    echo "Build complete!"
    echo "Backend JAR: SpiceLab-Private/apps/backend/target/backend-0.0.1-SNAPSHOT.jar"
    echo "Frontend dist: SpiceLab/apps/web/dist/"
elif [ "$1" = "prod" ]; then
    echo "Starting production environment..."
    docker-compose -f docker-compose.yml up -d --build
    echo ""
    echo "Production environment started!"
    echo "Access at http://localhost"
else
    echo "Usage: $0 {dev|build|prod}"
    echo "  dev  - Start development environment (MySQL only)"
    echo "  build - Build for production"
    echo "  prod - Start production environment with Docker"
fi
