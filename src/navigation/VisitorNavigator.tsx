// src/navigation/VisitorNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes } from '@/theme';

// Import screens
import VisitorLandingScreen from '@/screens/onboarding/VisitorLandingScreen';
import ProductListScreen from '@/screens/visitor/ProductListScreen';
import ProductDetailScreen from '@/screens/visitor/ProductDetailScreen';
import CartScreen from '@/screens/visitor/CartScreen';
import AboutScreen from '@/screens/visitor/AboutScreen';
import ContactScreen from '@/screens/visitor/ContactScreen';

// Import custom drawer
import CustomDrawer from '@/components/navigation/CustomDrawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack navigator for visitor screens
const VisitorStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={VisitorLandingScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

const VisitorNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primaryOrange,
        drawerInactiveTintColor: colors.gray,
        drawerLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: fontSizes.sm,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={VisitorStack}
        options={{
          drawerLabel: 'Accueil',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerLabel: 'À Propos',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="info" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          drawerLabel: 'Nous Contacter',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="contact-support" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default VisitorNavigator;