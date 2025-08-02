# Vidé-Grenier Kamer Mobile App

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clean Installation (Recommended)**
   ```bash
   # Run the clean install script
   ./clean-install.bat
   ```

2. **Manual Installation**
   ```bash
   # Remove existing node_modules and lock files
   rm -rf node_modules package-lock.json
   
   # Clear npm cache
   npm cache clean --force
   
   # Install dependencies
   npm install --legacy-peer-deps
   ```

### Running the App

1. **Start Expo Development Server**
   ```bash
   npm start
   ```

2. **Run on Android Emulator**
   ```bash
   npm run android
   ```

3. **Run on iOS Simulator** (macOS only)
   ```bash
   npm run ios
   ```

4. **Run on Web**
   ```bash
   npm run web
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. Network Connection Errors (ECONNRESET)
- **Solution**: Use the provided `.npmrc` configuration
- **Alternative**: Try using a VPN or different network
- **Command**: `npm install --legacy-peer-deps`

#### 2. Permission Errors (EPERM)
- **Solution**: Run PowerShell as Administrator
- **Alternative**: Use the clean-install.bat script
- **Command**: `npm cache clean --force`

#### 3. Metro Bundler Issues
- **Solution**: Clear Metro cache
- **Command**: `npx expo start --clear`

#### 4. Android Emulator Not Starting
- **Check**: Android Studio is properly installed
- **Check**: AVD (Android Virtual Device) is created
- **Command**: `adb devices` to verify connection

#### 5. iOS Simulator Issues (macOS)
- **Check**: Xcode is installed and updated
- **Command**: `xcrun simctl list devices`

### Development Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test

# Build for production
npm run build:android
npm run build:ios
```

## 📱 App Features

- **Authentication**: Login, registration, password recovery
- **Product Management**: Browse, search, filter products
- **Shopping Cart**: Add, remove, manage cart items
- **User Profiles**: Personal information management
- **Chat System**: Real-time messaging between users
- **Admin Dashboard**: Product moderation and analytics
- **Payment Integration**: Secure payment processing
- **Location Services**: Find products near you

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and external services
├── store/              # Redux store and slices
├── utils/              # Utility functions
├── constants/          # App constants
├── types/              # TypeScript type definitions
└── assets/             # Images, fonts, etc.
```

## 🔒 Environment Configuration

Create a `.env` file in the root directory:

```env
API_URL=http://192.168.1.100:8000/mobile/api
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/mobile/api
```

## 📦 Dependencies

### Core Dependencies
- **React Native**: 0.73.6
- **Expo**: 50.0.0
- **React Navigation**: 6.x
- **Redux Toolkit**: 2.0.1
- **Axios**: 1.6.2

### Key Features
- **AsyncStorage**: Local data persistence
- **NetInfo**: Network connectivity monitoring
- **Image Picker**: Photo selection and capture
- **Notifications**: Push notifications
- **Charts**: Data visualization
- **Vector Icons**: Icon library

## 🚀 Deployment

### Android
1. Build APK: `npm run build:android`
2. Submit to Play Store: `npm run submit:android`

### iOS
1. Build IPA: `npm run build:ios`
2. Submit to App Store: `npm run submit:ios`

## 📊 Performance Optimization

- **Code Splitting**: Lazy loading of screens
- **Image Optimization**: Compressed images and lazy loading
- **Memory Management**: Proper cleanup of resources
- **Network Optimization**: Request caching and retry logic

## 🔍 SEO and App Store Optimization

### Keywords
- marketplace, cameroon, cameroun, vide-grenier
- second-hand, occasion, achat, vente
- artisanat, local, africa, afrique
- e-commerce, shopping, classifieds

### App Store Listing
- **Name**: Vidé-Grenier Kamer - Marketplace Camerounais
- **Description**: La première marketplace en ligne du Cameroun
- **Category**: Shopping, Business, Lifestyle
- **Language**: French (Primary), English (Secondary)

## 🛠️ Development Tools

- **TypeScript**: Type safety and better development experience
- **ESLint**: Code quality and consistency
- **Jest**: Unit testing framework
- **Expo DevTools**: Development and debugging tools

## 📞 Support

For technical support or questions:
- Check the troubleshooting section above
- Review Expo documentation: https://docs.expo.dev/
- Review React Native documentation: https://reactnative.dev/

## 📄 License

This project is proprietary software for Vidé-Grenier Kamer.