// src/navigation/AdminNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes } from '@/theme';

// Import screens
import AdminDashboard from '@/screens/admin/AdminDashboard';
import UserManagementScreen from '@/screens/admin/UserManagementScreen';
import ProductModerationScreen from '@/screens/admin/ProductModerationScreen';
import ReportsScreen from '@/screens/admin/ReportsScreen';
import SettingsScreen from '@/screens/admin/SettingsScreen';

const Tab = createBottomTabNavigator();

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Users':
              iconName = 'people';
              break;
            case 'Moderation':
              iconName = 'pending-actions';
              break;
            case 'Reports':
              iconName = 'analytics';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryRed,
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
       // ... continuing AdminNavigator.tsx
       component={AdminDashboard} 
       options={{ tabBarLabel: 'Tableau de Bord' }}
     />
     <Tab.Screen 
       name="Users" 
       component={UserManagementScreen} 
       options={{ tabBarLabel: 'Utilisateurs' }}
     />
     <Tab.Screen 
       name="Moderation" 
       component={ProductModerationScreen} 
       options={{ tabBarLabel: 'Modération' }}
     />
     <Tab.Screen 
       name="Reports" 
       component={ReportsScreen} 
       options={{ tabBarLabel: 'Rapports' }}
     />
     <Tab.Screen 
       name="Settings" 
       component={SettingsScreen} 
       options={{ tabBarLabel: 'Paramètres' }}
     />
   </Tab.Navigator>
 );
};

export default AdminNavigator;