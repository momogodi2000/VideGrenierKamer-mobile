// src/screens/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { adminApi } from '@/services/api/admin';

const { width } = Dimensions.get('window');

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primaryOrange,
    },
  };

  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        data: [4300000, 4500000, 5200000, 4800000, 5500000, 6200000],
      },
    ],
  };

  const categorySalesData = {
    labels: ['Élec.', 'Mode', 'Maison', 'Sports', 'Auto'],
    datasets: [
      {
        data: [120, 95, 80, 65, 45],
      },
    ],
  };

  const adminActions = [
    { icon: 'people', title: 'Utilisateurs', count: stats?.total_users || 0, color: colors.primaryOrange },
    { icon: 'inventory', title: 'Produits', count: stats?.total_products || 0, color: colors.primaryGreen },
    { icon: 'receipt', title: 'Commandes', count: stats?.total_orders || 0, color: colors.primaryYellow },
    { icon: 'pending', title: 'En Attente', count: stats?.pending_products || 0, color: colors.primaryRed },
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
          colors={[colors.primaryRed, colors.primaryOrange]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Tableau de Bord Admin</Text>
              <Text style={styles.headerSubtitle}>
                Vue d'ensemble de la plateforme
              </Text>
            </View>
            
            <TouchableOpacity style={styles.settingsButton}>
              <MaterialIcons name="settings" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Revenue Card */}
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Revenu Total</Text>
            <Text style={styles.revenueAmount}>
              {stats?.total_revenue || 0} FCFA
            </Text>
            <View style={styles.revenueChange}>
              <MaterialIcons name="trending-up" size={16} color={colors.success} />
              <Text style={styles.revenueChangeText}>+15.2% ce mois</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          {adminActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: action.color + '20' }]}>
                <MaterialIcons
                  name={action.icon as any}
                  size={24}
                  color={action.color}
                />
              </View>
              <Text style={styles.statNumber}>{action.count}</Text>
              <Text style={styles.statLabel}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Évolution des Revenus</Text>
          <LineChart
            data={revenueData}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Category Sales Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Ventes par Catégorie</Text>
          <BarChart
            data={categorySalesData}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activités Récentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: colors.primaryGreen + '20' }]}>
                <MaterialIcons name="person-add" size={20} color={colors.primaryGreen} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nouvel utilisateur inscrit</Text>
                <Text style={styles.activityDescription}>Jean Dupont - Douala</Text>
                <Text style={styles.activityTime}>Il y a 10 minutes</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: colors.primaryOrange + '20' }]}>
                <MaterialIcons name="inventory" size={20} color={colors.primaryOrange} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nouveau produit en attente</Text>
                <Text style={styles.activityDescription}>MacBook Pro M2 - 850,000 FCFA</Text>
                <Text style={styles.activityTime}>Il y a 25 minutes</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: colors.primaryRed + '20' }]}>
                <MaterialIcons name="report" size={20} color={colors.primaryRed} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Signalement reçu</Text>
                <Text style={styles.activityDescription}>Produit suspecté contrefaçon</Text>
                <Text style={styles.activityTime}>Il y a 1 heure</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Admin Actions */}
        <View style={styles.adminActionsSection}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="pending-actions" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Modérer Produits</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
              <MaterialIcons name="people" size={24} color={colors.primaryOrange} />
              <Text style={[styles.actionButtonText, { color: colors.primaryOrange }]}>
                Gérer Utilisateurs
              </Text>
            </TouchableOpacity>
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
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  revenueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  revenueLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  revenueAmount: {
    fontSize: fontSizes['3xl'],
    fontFamily: fonts.bold,
    color: colors.white,
    marginVertical: spacing.xs,
  },
  revenueChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revenueChangeText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    margin: '1%',
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  chartSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  chartTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
    marginBottom: spacing.base,
  },
  chart: {
    borderRadius: borderRadius.lg,
  },
  activitiesSection: {
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
  adminActionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButtons: {
    marginTop: spacing.base,
  },
  actionButton: {
    backgroundColor: colors.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
  },
  secondaryActionButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primaryOrange,
  },
  actionButtonText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.white,
    marginLeft: spacing.sm,
  },
});

export default AdminDashboard;