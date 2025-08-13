#!/bin/bash

# News Paper API Setup Script
# This script helps set up the development and production environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_success "Docker is running"
}

# Check if bun is installed
check_bun() {
    if ! command -v bun &> /dev/null; then
        log_error "Bun is not installed. Please install Bun from https://bun.sh"
        exit 1
    fi
    log_success "Bun is installed: $(bun --version)"
}

# Install dependencies
install_deps() {
    log_info "Installing dependencies..."
    bun install
    log_success "Dependencies installed"
}

# Setup environment files
setup_env() {
    log_info "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        log_success "Created .env from .env.example"
    else
        log_warning ".env already exists, skipping..."
    fi
    
    if [ ! -f .env.prod ]; then
        log_warning ".env.prod already exists with default values"
        log_warning "Please update it with your production database credentials"
    fi
}

# Start development environment
start_dev() {
    log_info "Starting development environment..."
    check_docker
    
    # Stop any existing containers
    docker compose down -v 2>/dev/null || true
    
    # Start containers
    docker compose up --build -d
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    log_info "Running database migrations..."
    bun run db:generate
    bun run db:migrate
    
    # Seed database
    log_info "Seeding database..."
    bun run db:seed
    
    log_success "Development environment is ready!"
    log_info "API is running at: http://localhost:3000"
    log_info "Health check: http://localhost:3000/health"
    log_info "API docs: http://localhost:3000/api"
}

# Start production environment
start_prod() {
    log_info "Starting production environment..."
    check_docker
    
    if [ ! -f .env.prod ]; then
        log_error ".env.prod file not found. Please create it with production settings."
        exit 1
    fi
    
    # Stop any existing containers
    docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true
    
    # Start production containers
    log_info "Building and starting production containers..."
    docker compose -f docker-compose.prod.yml up --build -d
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    sleep 10
    
    log_success "Production environment is ready!"
    log_info "API is running at: http://localhost:3000"
    log_warning "Remember to:"
    log_warning "  1. Run migrations: docker compose -f docker-compose.prod.yml exec app bun run db:migrate"
    log_warning "  2. Seed database: docker compose -f docker-compose.prod.yml exec app bun run db:seed"
    log_warning "  3. Update CORS_ORIGIN in .env.prod with your domain"
}

# Reset development environment
reset_dev() {
    log_warning "This will destroy all data in the development database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Resetting development environment..."
        docker compose down -v
        docker volume prune -f
        start_dev
        log_success "Development environment reset complete!"
    else
        log_info "Reset cancelled"
    fi
}

# Show logs
show_logs() {
    local env=${1:-dev}
    if [ "$env" = "prod" ]; then
        docker compose -f docker-compose.prod.yml logs -f
    else
        docker compose logs -f
    fi
}

# Stop environments
stop_env() {
    local env=${1:-dev}
    if [ "$env" = "prod" ]; then
        log_info "Stopping production environment..."
        docker compose -f docker-compose.prod.yml down
        log_success "Production environment stopped"
    else
        log_info "Stopping development environment..."
        docker compose down
        log_success "Development environment stopped"
    fi
}

# Database operations
db_studio() {
    log_info "Opening Drizzle Studio..."
    log_info "Studio will be available at: https://local.drizzle.studio"
    bun run db:studio
}

# Health check
health_check() {
    log_info "Checking API health..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "API is healthy!"
        curl -s http://localhost:3000/health | bun run -
    else
        log_error "API health check failed"
        exit 1
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup         Setup the project (install deps, setup env files)"
    echo "  dev           Start development environment"
    echo "  prod          Start production environment"
    echo "  stop [env]    Stop environment (dev/prod, default: dev)"
    echo "  reset         Reset development environment (destroys data)"
    echo "  logs [env]    Show logs (dev/prod, default: dev)"
    echo "  studio        Open Drizzle Studio"
    echo "  health        Check API health"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup      # Initial project setup"
    echo "  $0 dev        # Start development"
    echo "  $0 logs prod  # Show production logs"
    echo "  $0 stop prod  # Stop production environment"
}

# Main script
main() {
    case ${1:-help} in
        setup)
            check_bun
            install_deps
            setup_env
            log_success "Setup complete! Run '$0 dev' to start development environment."
            ;;
        dev|development)
            check_bun
            start_dev
            ;;
        prod|production)
            check_bun
            start_prod
            ;;
        stop)
            stop_env $2
            ;;
        reset)
            reset_dev
            ;;
        logs)
            show_logs $2
            ;;
        studio)
            check_bun
            db_studio
            ;;
        health)
            health_check
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            log_error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
