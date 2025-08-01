// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';
import { colors, fonts, fontSizes } from '@/theme';

// Import screens (these would be created in your implementation)
import HomeScreen from '@/screens/main/HomeScreen';
import SearchScreen from '@/screens/main/SearchScreen';
import CreateProductScreen from '@/screens/main/CreateProductScreen';
import MessagesScreen from '@/screens/main/MessagesScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.user_type === 'ADMIN';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Create':
              iconName = 'add-circle';
              break;
            case 'Messages':
              iconName = 'message';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            case 'Admin':
              iconName = 'admin-panel-settings';
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
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarLabel: 'Recherche' }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateProductScreen} 
        options={{ tabBarLabel: 'Vendre' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ tabBarLabel: 'Messages' }}
      />
      {isAdmin ? (
        <Tab.Screen 
          name="Admin" 
          component={AdminDashboardScreen} 
          options={{ tabBarLabel: 'Admin' }}
        />
      ) : (
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ tabBarLabel: 'Profil' }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainNavigator;