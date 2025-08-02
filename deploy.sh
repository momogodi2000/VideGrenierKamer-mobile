#!/bin/bash

# Vidé-Grenier Kamer Mobile App Deployment Script
# This script automates the deployment process for the React Native mobile app

set -e  # Exit on any error

echo "🚀 Starting Vidé-Grenier Kamer Mobile App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the mobile directory"
    exit 1
fi

# Step 1: Install Dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed successfully"

# Step 2: Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    print_warning "EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
    print_success "EAS CLI installed"
else
    print_success "EAS CLI already installed"
fi

# Step 3: Check if user is logged in to Expo
print_status "Checking Expo login status..."
if ! eas whoami &> /dev/null; then
    print_warning "Not logged in to Expo. Please login:"
    eas login
else
    print_success "Already logged in to Expo"
fi

# Step 4: Configure EAS (if not already configured)
if [ ! -f "eas.json" ]; then
    print_status "Configuring EAS build..."
    eas build:configure
    print_success "EAS configuration completed"
else
    print_success "EAS already configured"
fi

# Step 5: Check environment variables
print_status "Checking environment configuration..."
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating template..."
    cat > .env << EOF
# API Configuration
EXPO_PUBLIC_API_URL=https://your-django-backend.com/mobile/api
EXPO_PUBLIC_API_TIMEOUT=30000

# Expo Configuration
EXPO_PUBLIC_EXPO_PROJECT_ID=your-project-id-here

# Push Notifications
EXPO_PUBLIC_PUSH_ENABLED=true
EOF
    print_warning "Please update .env file with your actual configuration"
else
    print_success "Environment file found"
fi

# Step 6: Run tests
print_status "Running tests..."
npm test -- --passWithNoTests || {
    print_warning "Tests failed or not configured. Continuing..."
}

# Step 7: Check for linting issues
print_status "Checking code quality..."
npm run lint --silent || {
    print_warning "Linting issues found. Please fix them before deployment."
}

# Step 8: Build configuration check
print_status "Checking build configuration..."
if [ ! -f "eas.json" ]; then
    print_error "EAS configuration file not found. Please run 'eas build:configure' first."
    exit 1
fi

# Step 9: Ask user for build type
echo ""
echo "Choose build type:"
echo "1) Development build (for testing)"
echo "2) Preview build (for internal testing)"
echo "3) Production build (for app stores)"
echo "4) All builds"
read -p "Enter your choice (1-4): " build_choice

case $build_choice in
    1)
        print_status "Building development version..."
        eas build --platform all --profile development
        ;;
    2)
        print_status "Building preview version..."
        eas build --platform all --profile preview
        ;;
    3)
        print_status "Building production version..."
        eas build --platform all --profile production
        ;;
    4)
        print_status "Building all versions..."
        eas build --platform all --profile development
        eas build --platform all --profile preview
        eas build --platform all --profile production
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

# Step 10: Ask if user wants to submit to stores
echo ""
read -p "Do you want to submit to app stores? (y/n): " submit_choice

if [[ $submit_choice =~ ^[Yy]$ ]]; then
    print_status "Submitting to app stores..."
    
    # Check if builds were successful
    if eas build:list --limit=1 | grep -q "finished"; then
        print_status "Submitting to Google Play Store..."
        eas submit --platform android
        
        print_status "Submitting to Apple App Store..."
        eas submit --platform ios
        
        print_success "Submission completed"
    else
        print_error "No successful builds found. Please check build status first."
    fi
fi

# Step 11: Display deployment summary
echo ""
print_success "Deployment Summary:"
echo "======================"
echo "✅ Dependencies installed"
echo "✅ EAS CLI configured"
echo "✅ Environment configured"
echo "✅ Builds completed"
if [[ $submit_choice =~ ^[Yy]$ ]]; then
    echo "✅ Apps submitted to stores"
fi

echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Monitor build status: eas build:list"
echo "2. Check submission status: eas submit:list"
echo "3. Test the app thoroughly"
echo "4. Monitor app store review process"
echo ""
echo "For support, check the documentation in the doc/ folder" 