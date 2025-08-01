// src/screens/client/ClientDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { userApi } from '@/services/api/user';

const ClientDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await userApi.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadStats();
  };

  const quickActions = [
    { icon: 'add-circle', title: 'Vendre', color: colors.primaryOrange, route: 'CreateProduct' },
    { icon: 'shopping-bag', title: 'Mes Produits', color: colors.primaryGreen, route: 'MyProducts' },
    { icon: 'receipt', title: 'Mes Commandes', color: colors.primaryYellow, route: 'MyOrders' },
    { icon: 'account-balance-wallet', title: 'Portefeuille', color: colors.primaryRed, route: 'Wallet' },
    { icon: 'message', title: 'Messages', color: colors.primaryBrown, route: 'Messages' },
    { icon: 'settings', title: 'Paramètres', color: colors.accentTerracotta, route: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primaryOrange]}
          />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primaryOrange, colors.primaryYellow]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: user?.profile_picture || 'https://via.placeholder.com/60' }}
                style={styles.avatar}
              />
              <View style={styles.userText}>
                <Text style={styles.greeting}>Bonjour,</Text>
                <Text style={styles.userName}>
                  {user?.first_name} {user?.last_name}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons name="notifications" size={24} color={colors.white} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Loyalty Info */}
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyInfo}>
              <MaterialIcons name="stars" size={20} color={colors.primaryYellow} />
              <Text style={styles.loyaltyLevel}>{user?.loyalty_level || 'Bronze'}</Text>
            </View>
            <Text style={styles.loyaltyPoints}>
              {user?.loyalty_points || 0} points
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="inventory" size={32} color={colors.primaryOrange} />
            <Text style={styles.statNumber}>{stats?.products_count || 0}</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="shopping-cart" size={32} color={colors.primaryGreen} />
            <Text style={styles.statNumber}>{stats?.orders_bought || 0}</Text>
            <Text style={styles.statLabel}>Achats</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="sell" size={32} color={colors.primaryYellow} />
            <Text style={styles.statNumber}>{stats?.orders_sold || 0}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="star" size={32} color={colors.primaryRed} />
            <Text style={styles.statNumber}>{stats?.reviews_given || 0}</Text>
            <Text style={styles.statLabel}>Avis</Text>
          </View>
        </View>

        {/* Wallet Summary */}
        <View style={styles.walletSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mon Portefeuille</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Détails</Text>
            </TouchableOpacity>
          </View>
          
          <LinearGradient
            colors={[colors.primaryGreen, colors.primaryYellow]}
            style={styles.walletCard}
          >
            <View style={styles.walletBalance}>
              <Text style={styles.walletLabel}>Solde Disponible</Text>
              <Text style={styles.walletAmount}>
                {stats?.wallet_balance || 0} FCFA
              </Text>
            </View>
            
            <View style={styles.walletStats}>
              <View style={styles.walletStat}>
                <MaterialIcons name="trending-up" size={16} color={colors.white} />
                <Text style={styles.walletStatLabel}>Revenus</Text>
                <Text style={styles.walletStatAmount}>
                  {stats?.total_earned || 0} FCFA
                </Text>
              </View>
              
              <View style={styles.walletDivider} />
              
              <View style={styles.walletStat}>
                <MaterialIcons name="trending-down" size={16} color={colors.white} />
                <Text style={styles.walletStatLabel}>Dépenses</Text>
                <Text style={styles.walletStatAmount}>
                  {stats?.total_spent || 0} FCFA