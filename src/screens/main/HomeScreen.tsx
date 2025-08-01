// src/screens/main/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { colors, fonts, fontSizes, spacing } from '@/theme';
import AfricanButton from '@/components/common/AfricanButton';

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primaryOrange, colors.primaryYellow]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              Bienvenue, {user?.first_name}!
            </Text>
            <Text style={styles.userType}>
              {user?.user_type === 'ADMIN' ? 'Administrateur' : 'Client'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color={colors.white} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="shopping-bag" size={32} color={colors.primaryOrange} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Produits</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="shopping-cart" size={32} color={colors.primaryGreen} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="favorite" size={32} color={colors.primaryRed} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions Rapides</Text>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="add-circle" size={24} color={colors.primaryOrange} />
              <Text style={styles.actionText}>Ajouter un produit</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.gray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="account-balance-wallet" size={24} color={colors.primaryGreen} />
              <Text style={styles.actionText}>Mon portefeuille</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.gray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="settings" size={24} color={colors.primaryYellow} />
              <Text style={styles.actionText}>Paramètres</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <AfricanButton
            title="Se déconnecter"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  userType: {
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  notificationButton: {
    padding: spacing.sm,
  },
  content: {
    padding: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: spacing.base,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
    marginBottom: spacing.base,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  actionText: {
    flex: 1,
    fontSize: fontSizes.base,
    fontFamily: fonts.medium,
    color: colors.secondaryDark,
    marginLeft: spacing.base,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
});

export default HomeScreen;