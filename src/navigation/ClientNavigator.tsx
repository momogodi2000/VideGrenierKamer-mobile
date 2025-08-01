// src/navigation/ClientNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes } from '@/theme';

// Import screens
import ClientDashboard from '@/screens/client/ClientDashboard';
import ProductListScreen from '@/screens/visitor/ProductListScreen';
import CreateProductScreen from '@/screens/client/CreateProductScreen';
import MessagesScreen from '@/screens/client/MessagesScreen';
import ProfileScreen from '@/screens/client/ProfileScreen';

const Tab = createBottomTabNavigator();

const ClientNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Products':
              iconName = 'store';
              break;
            case 'Sell':
              iconName = 'add-circle';
              break;
            case 'Messages':
              iconName = 'message';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryOrange,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: fontSizes.xs,
          fontFamily: fonts.medium,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={ClientDashboard} 
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductListScreen} 
        options={{ tabBarLabel: 'Produits' }}
      />
      <Tab.Screen 
        name="Sell" 
        component={CreateProductScreen} 
        options={{ 
          tabBarLabel: 'Vendre',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" size={size + 10} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ tabBarLabel: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default ClientNavigator;