// src/screens/client/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { userApi } from '@/services/api/user';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await userApi.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUserStats();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => dispatch(logout())
        }
      ]
    );
  };

  const profileMenuItems = [
    {
      icon: 'person',
      title: 'Modifier le profil',
      subtitle: 'Informations personnelles',
      onPress: () => navigation.navigate('EditProfile'),
      color: colors.primaryOrange,
    },
    {
      icon: 'phone',
      title: 'Vérification téléphone',
      subtitle: user?.phone_verified ? 'Vérifié' : 'Non vérifié',
      onPress: () => navigation.navigate('PhoneVerification'),
      color: user?.phone_verified ? colors.primaryGreen : colors.primaryRed,
    },
    {
      icon: 'security',
      title: 'Sécurité',
      subtitle: 'Mot de passe et 2FA',
      onPress: () => navigation.navigate('SecuritySettings'),
      color: colors.primaryBlue,
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Préférences de notifications',
      onPress: () => navigation.navigate('NotificationSettings'),
      color: colors.primaryYellow,
    },
  ];

  const accountMenuItems = [
    {
      icon: 'receipt',
      title: 'Mes commandes',
      subtitle: `${stats?.orders_bought || 0} commandes`,
      onPress: () => navigation.navigate('MyOrders'),
      color: colors.primaryGreen,
    },
    {
      icon: 'favorite',
      title: 'Mes favoris',
      subtitle: `${stats?.favorites_count || 0} produits`,
      onPress: () => navigation.navigate('MyFavorites'),
      color: colors.primaryRed,
    },
    {
      icon: 'account-balance-wallet',
      title: 'Portefeuille',
      subtitle: `${stats?.total_earned || 0} FCFA gagnés`,
      onPress: () => navigation.navigate('Wallet'),
      color: colors.primaryBrown,
    },
    {
      icon: 'star',
      title: 'Mes avis',
      subtitle: `${stats?.reviews_given || 0} avis donnés`,
      onPress: () => navigation.navigate('MyReviews'),
      color: colors.primaryYellow,
    },
  ];

  const supportMenuItems = [
    {
      icon: 'help',
      title: 'Aide et support',
      subtitle: 'Centre d\'aide',
      onPress: () => navigation.navigate('HelpSupport'),
      color: colors.primaryBlue,
    },
    {
      icon: 'info',
      title: 'À propos',
      subtitle: 'Version et informations',
      onPress: () => navigation.navigate('About'),
      color: colors.primaryGreen,
    },
    {
      icon: 'privacy-tip',
      title: 'Politique de confidentialité',
      subtitle: 'Protection des données',
      onPress: () => navigation.navigate('PrivacyPolicy'),
      color: colors.primaryOrange,
    },
    {
      icon: 'description',
      title: 'Conditions d\'utilisation',
      subtitle: 'Termes et conditions',
      onPress: () => navigation.navigate('TermsConditions'),
      color: colors.primaryBrown,
    },
  ];

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon as any} size={24} color={colors.white} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );

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
            <Image
              source={{ uri: user?.profile_picture || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats?.products_count || 0}</Text>
                  <Text style={styles.statLabel}>Produits</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.loyalty_level || 'Bronze'}</Text>
                  <Text style={styles.statLabel}>Niveau</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user?.loyalty_points || 0}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Sections */}
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil</Text>
            {profileMenuItems.map(renderMenuItem)}
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mon Compte</Text>
            {accountMenuItems.map(renderMenuItem)}
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            {supportMenuItems.map(renderMenuItem)}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={24} color={colors.error} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.md,
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: fontSizes.md,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.white,
    opacity: 0.3,
    marginHorizontal: spacing.sm,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
});

export default ProfileScreen;
