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
  Platform,
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
                  // ... continuing ClientDashboard.tsx
               </Text>
             </View>
           </View>
         </LinearGradient>
       </View>

       {/* Quick Actions */}
       <View style={styles.quickActionsSection}>
         <Text style={styles.sectionTitle}>Actions Rapides</Text>
         
         <View style={styles.quickActionsGrid}>
           {quickActions.map((action, index) => (
             <TouchableOpacity
               key={index}
               style={styles.quickActionCard}
               onPress={() => {/* Navigate to action.route */}}
             >
               <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                 <MaterialIcons
                   name={action.icon as any}
                   size={28}
                   color={action.color}
                 />
               </View>
               <Text style={styles.quickActionTitle}>{action.title}</Text>
             </TouchableOpacity>
           ))}
         </View>
       </View>

       {/* Recent Activity */}
       <View style={styles.recentActivitySection}>
         <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Activité Récente</Text>
           <TouchableOpacity>
             <Text style={styles.seeAllText}>Voir tout</Text>
           </TouchableOpacity>
         </View>
         
         <View style={styles.activityList}>
           <View style={styles.activityItem}>
             <View style={styles.activityIcon}>
               <MaterialIcons name="shopping-cart" size={20} color={colors.primaryGreen} />
             </View>
             <View style={styles.activityContent}>
               <Text style={styles.activityTitle}>Nouvelle commande reçue</Text>
               <Text style={styles.activityDescription}>iPhone 12 Pro - 350,000 FCFA</Text>
               <Text style={styles.activityTime}>Il y a 2 heures</Text>
             </View>
           </View>
           
           <View style={styles.activityItem}>
             <View style={styles.activityIcon}>
               <MaterialIcons name="star" size={20} color={colors.primaryYellow} />
             </View>
             <View style={styles.activityContent}>
               <Text style={styles.activityTitle}>Nouvel avis reçu</Text>
               <Text style={styles.activityDescription}>5 étoiles de Marie T.</Text>
               <Text style={styles.activityTime}>Il y a 5 heures</Text>
             </View>
           </View>
           
           <View style={styles.activityItem}>
             <View style={styles.activityIcon}>
               <MaterialIcons name="message" size={20} color={colors.primaryOrange} />
             </View>
             <View style={styles.activityContent}>
               <Text style={styles.activityTitle}>Nouveau message</Text>
               <Text style={styles.activityDescription}>Paul M. vous a envoyé un message</Text>
               <Text style={styles.activityTime}>Il y a 1 jour</Text>
             </View>
           </View>
         </View>
       </View>
     </ScrollView>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.white,
 },
 header: {
   paddingTop: spacing.xl,
   paddingBottom: spacing['2xl'],
   paddingHorizontal: spacing.lg,
 },
 headerContent: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: spacing.lg,
 },
 userInfo: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 avatar: {
   width: 50,
   height: 50,
   borderRadius: 25,
   borderWidth: 2,
   borderColor: colors.white,
 },
 userText: {
   marginLeft: spacing.base,
 },
 greeting: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.regular,
   color: colors.white,
   opacity: 0.9,
 },
 userName: {
   fontSize: fontSizes.lg,
   fontFamily: fonts.bold,
   color: colors.white,
 },
 notificationButton: {
   position: 'relative',
   padding: spacing.sm,
 },
 notificationBadge: {
   position: 'absolute',
   top: 0,
   right: 0,
   backgroundColor: colors.primaryRed,
   borderRadius: 10,
   width: 20,
   height: 20,
   justifyContent: 'center',
   alignItems: 'center',
 },
 notificationBadgeText: {
   fontSize: fontSizes.xs,
   fontFamily: fonts.bold,
   color: colors.white,
 },
 loyaltyCard: {
   backgroundColor: 'rgba(255, 255, 255, 0.2)',
   borderRadius: borderRadius.lg,
   padding: spacing.base,
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 loyaltyInfo: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 loyaltyLevel: {
   fontSize: fontSizes.base,
   fontFamily: fonts.bold,
   color: colors.white,
   marginLeft: spacing.xs,
   textTransform: 'capitalize',
 },
 loyaltyPoints: {
   fontSize: fontSizes.base,
   fontFamily: fonts.medium,
   color: colors.white,
 },
 statsContainer: {
   flexDirection: 'row',
   paddingHorizontal: spacing.lg,
   marginTop: -spacing.xl,
   marginBottom: spacing.lg,
 },
 statCard: {
   flex: 1,
   backgroundColor: colors.white,
   marginHorizontal: spacing.xs,
   padding: spacing.base,
   borderRadius: borderRadius.lg,
   alignItems: 'center',
   ...Platform.select({
     ios: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 4,
     },
     android: {
       elevation: 4,
     },
   }),
 },
 statNumber: {
   fontSize: fontSizes.xl,
   fontFamily: fonts.bold,
   color: colors.secondaryDark,
   marginVertical: spacing.xs,
 },
 statLabel: {
   fontSize: fontSizes.xs,
   fontFamily: fonts.regular,
   color: colors.gray,
 },
 walletSection: {
   paddingHorizontal: spacing.lg,
   marginBottom: spacing.xl,
 },
 sectionHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: spacing.base,
 },
 sectionTitle: {
   fontSize: fontSizes.lg,
   fontFamily: fonts.bold,
   color: colors.secondaryDark,
 },
 seeAllText: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.medium,
   color: colors.primaryOrange,
 },
 walletCard: {
   borderRadius: borderRadius.xl,
   padding: spacing.lg,
 },
 walletBalance: {
   marginBottom: spacing.lg,
 },
 walletLabel: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.regular,
   color: colors.white,
   opacity: 0.9,
 },
 walletAmount: {
   fontSize: fontSizes['3xl'],
   fontFamily: fonts.bold,
   color: colors.white,
   marginTop: spacing.xs,
 },
 walletStats: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 walletStat: {
   flex: 1,
   alignItems: 'center',
 },
 walletStatLabel: {
   fontSize: fontSizes.xs,
   fontFamily: fonts.regular,
   color: colors.white,
   opacity: 0.9,
   marginVertical: spacing.xs,
 },
 walletStatAmount: {
   fontSize: fontSizes.base,
   fontFamily: fonts.bold,
   color: colors.white,
 },
 walletDivider: {
   width: 1,
   height: 40,
   backgroundColor: colors.white,
   opacity: 0.3,
   marginHorizontal: spacing.lg,
 },
 quickActionsSection: {
   paddingHorizontal: spacing.lg,
   marginBottom: spacing.xl,
 },
 quickActionsGrid: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   marginHorizontal: -spacing.xs,
   marginTop: spacing.base,
 },
 quickActionCard: {
   width: '33.33%',
   paddingHorizontal: spacing.xs,
   marginBottom: spacing.base,
   alignItems: 'center',
 },
 quickActionIcon: {
   width: 56,
   height: 56,
   borderRadius: 28,
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: spacing.sm,
 },
 quickActionTitle: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.medium,
   color: colors.secondaryDark,
   textAlign: 'center',
 },
 recentActivitySection: {
   paddingHorizontal: spacing.lg,
   marginBottom: spacing.xl,
 },
 activityList: {
   marginTop: spacing.base,
 },
 activityItem: {
   flexDirection: 'row',
   alignItems: 'flex-start',
   paddingVertical: spacing.base,
   borderBottomWidth: 1,
   borderBottomColor: colors.lightGray,
 },
 activityIcon: {
   width: 40,
   height: 40,
   borderRadius: 20,
   backgroundColor: colors.lightGray,
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: spacing.base,
 },
 activityContent: {
   flex: 1,
 },
 activityTitle: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.medium,
   color: colors.secondaryDark,
   marginBottom: spacing.xs,
 },
 activityDescription: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.regular,
   color: colors.gray,
   marginBottom: spacing.xs,
 },
 activityTime: {
   fontSize: fontSizes.xs,
   fontFamily: fonts.regular,
   color: colors.gray,
 },
});

export default ClientDashboard;