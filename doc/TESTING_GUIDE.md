# Mobile App Testing Guide

## 🧪 **Comprehensive Testing Strategy**

This guide provides step-by-step instructions for testing all features of the Vidé-Grenier Kamer mobile app before deployment.

## 📱 **Pre-Testing Setup**

### **1. Environment Setup**
```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start development server
npm start
```

### **2. Device Setup**
- **Android**: Use Android Studio emulator or physical device
- **iOS**: Use Xcode simulator or physical device
- **Web**: Use browser for basic testing

## 🔐 **Authentication Testing**

### **1. Login Flow**
```bash
# Test normal login
1. Open app
2. Navigate to Login screen
3. Enter valid credentials
4. Verify successful login
5. Check token storage

# Test 2FA login
1. Login with 2FA-enabled account
2. Verify 2FA code is sent
3. Enter 2FA code
4. Verify successful login
```

### **2. Registration Flow**
```bash
# Test user registration
1. Navigate to Register screen
2. Fill registration form
3. Submit registration
4. Verify phone verification
5. Complete verification
6. Verify account creation
```

### **3. Token Management**
```bash
# Test token refresh
1. Login successfully
2. Wait for token expiration
3. Make API call
4. Verify automatic token refresh
5. Verify seamless user experience

# Test logout
1. Login to app
2. Navigate to logout
3. Verify token removal
4. Verify redirect to login
```

## 🛍️ **Product Management Testing**

### **1. Product Browsing**
```bash
# Test product listing
1. Open app as visitor
2. Navigate to products
3. Verify product list loads
4. Test pagination
5. Test filtering options

# Test product details
1. Tap on product
2. Verify product details load
3. Check images display
4. Verify seller information
5. Test favorite button
```

### **2. Product Creation (Authenticated Users)**
```bash
# Test product creation
1. Login as client
2. Navigate to create product
3. Fill product form
4. Upload images
5. Submit product
6. Verify product appears in list

# Test product editing
1. Navigate to my products
2. Select product to edit
3. Modify details
4. Save changes
5. Verify updates
```

### **3. Search and Filtering**
```bash
# Test search functionality
1. Use search bar
2. Enter search terms
3. Verify results
4. Test advanced filters
5. Verify filter combinations
```

## 🛒 **Shopping Experience Testing**

### **1. Visitor Cart**
```bash
# Test add to cart
1. Browse as visitor
2. Add product to cart
3. Verify cart updates
4. Test quantity changes
5. Test remove items

# Test guest checkout
1. Proceed to checkout
2. Fill customer information
3. Select pickup point
4. Complete order
5. Verify order confirmation
```

### **2. Authenticated Shopping**
```bash
# Test authenticated cart
1. Login as client
2. Add products to cart
3. Proceed to checkout
4. Complete purchase
5. Verify order history
```

## 👤 **User Management Testing**

### **1. Profile Management**
```bash
# Test profile viewing
1. Login to app
2. Navigate to profile
3. Verify profile information
4. Check statistics display

# Test profile editing
1. Edit profile information
2. Save changes
3. Verify updates
4. Test image upload
```

### **2. User Statistics**
```bash
# Test statistics display
1. Navigate to profile
2. Check products count
3. Check orders count
4. Check favorites count
5. Verify loyalty points
```

## 🔧 **Admin Features Testing**

### **1. Admin Dashboard**
```bash
# Test admin access
1. Login as admin
2. Navigate to admin dashboard
3. Verify statistics display
4. Check user management
5. Test product moderation
```

### **2. User Management**
```bash
# Test user listing
1. Navigate to user management
2. Verify user list loads
3. Test user search
4. Test user filtering
5. Test user actions
```

### **3. Product Moderation**
```bash
# Test product approval
1. Navigate to pending products
2. Review product details
3. Approve product
4. Verify status change

# Test product rejection
1. Select product to reject
2. Provide rejection reason
3. Submit rejection
4. Verify status change
```

## 📱 **Offline Functionality Testing**

### **1. Offline Mode**
```bash
# Test offline detection
1. Disconnect internet
2. Verify offline banner appears
3. Test cached data access
4. Test offline actions

# Test reconnection
1. Reconnect internet
2. Verify offline banner disappears
3. Test data synchronization
4. Verify queued requests process
```

### **2. Caching**
```bash
# Test data caching
1. Load products
2. Disconnect internet
3. Navigate to products
4. Verify cached data displays
5. Check cache expiration
```

## 🔔 **Push Notifications Testing**

### **1. Notification Setup**
```bash
# Test notification permissions
1. Open app first time
2. Verify permission request
3. Grant permissions
4. Verify token registration

# Test notification categories
1. Configure notification settings
2. Test different notification types
3. Verify action buttons
4. Test deep linking
```

### **2. Notification Delivery**
```bash
# Test local notifications
1. Trigger local notification
2. Verify notification appears
3. Test notification tap
4. Verify navigation

# Test remote notifications
1. Send test notification
2. Verify delivery
3. Test notification actions
4. Verify app state
```

## 🎨 **UI/UX Testing**

### **1. Responsive Design**
```bash
# Test different screen sizes
1. Test on various devices
2. Verify layout adaptation
3. Test orientation changes
4. Verify touch targets

# Test accessibility
1. Test with screen readers
2. Verify color contrast
3. Test keyboard navigation
4. Verify focus indicators
```

### **2. Performance Testing**
```bash
# Test app performance
1. Monitor app startup time
2. Test image loading
3. Verify smooth scrolling
4. Test memory usage

# Test battery usage
1. Monitor battery consumption
2. Test background processes
3. Verify efficient API calls
4. Test caching effectiveness
```

## 🔒 **Security Testing**

### **1. Data Protection**
```bash
# Test secure storage
1. Verify token encryption
2. Test sensitive data storage
3. Verify data cleanup on logout
4. Test app uninstall cleanup

# Test API security
1. Verify HTTPS usage
2. Test token validation
3. Verify request signing
4. Test authorization checks
```

### **2. Input Validation**
```bash
# Test form validation
1. Test invalid inputs
2. Verify error messages
3. Test SQL injection attempts
4. Verify XSS protection
```

## 📊 **Analytics Testing**

### **1. Event Tracking**
```bash
# Test user events
1. Track user actions
2. Verify event logging
3. Test conversion tracking
4. Verify analytics data

# Test crash reporting
1. Trigger test crashes
2. Verify crash reports
3. Test error logging
4. Verify debugging info
```

## 🧪 **Automated Testing**

### **1. Unit Tests**
```bash
# Run unit tests
npm test

# Test specific components
npm test -- --testNamePattern="Auth"

# Test with coverage
npm test -- --coverage
```

### **2. Integration Tests**
```bash
# Test API integration
npm run test:integration

# Test navigation flows
npm run test:navigation

# Test state management
npm run test:redux
```

## 📋 **Testing Checklist**

### **✅ Pre-Deployment Checklist**
- [ ] All authentication flows work
- [ ] Product browsing and creation work
- [ ] Shopping cart functionality works
- [ ] Offline mode works correctly
- [ ] Push notifications work
- [ ] Admin features work
- [ ] Performance is acceptable
- [ ] Security measures are in place
- [ ] Error handling works
- [ ] UI/UX is polished

### **✅ Device Testing Checklist**
- [ ] Android (various versions)
- [ ] iOS (various versions)
- [ ] Different screen sizes
- [ ] Different orientations
- [ ] Low-end devices
- [ ] High-end devices

### **✅ Network Testing Checklist**
- [ ] Fast internet connection
- [ ] Slow internet connection
- [ ] Intermittent connection
- [ ] No internet connection
- [ ] WiFi to mobile data switch

## 🚨 **Common Issues and Solutions**

### **1. Build Issues**
```bash
# Clear cache
npm start -- --clear

# Reset Metro bundler
npm start -- --reset-cache

# Clean and reinstall
rm -rf node_modules
npm install
```

### **2. API Issues**
```bash
# Check API connectivity
curl -X GET https://your-api-url.com/mobile/api/health/

# Verify CORS settings
# Check authentication tokens
# Verify API endpoints
```

### **3. Performance Issues**
```bash
# Monitor memory usage
# Check for memory leaks
# Optimize images
# Reduce bundle size
```

## 📈 **Performance Benchmarks**

### **Target Metrics**
- **App Startup**: < 3 seconds
- **API Response**: < 500ms
- **Image Loading**: < 2 seconds
- **Memory Usage**: < 100MB
- **Battery Impact**: < 5% per hour
- **Crash Rate**: < 1%

## 🎯 **Testing Tools**

### **Recommended Tools**
- **React Native Debugger**: For debugging
- **Flipper**: For network inspection
- **Charles Proxy**: For API testing
- **Android Studio**: For Android testing
- **Xcode**: For iOS testing
- **Jest**: For unit testing
- **Detox**: For E2E testing

## 📞 **Support and Documentation**

### **Resources**
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Testing Best Practices](https://reactnative.dev/docs/testing)
- [Performance Optimization](https://reactnative.dev/docs/performance)

### **Contact**
For testing issues or questions, refer to the project documentation or contact the development team. 