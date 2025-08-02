// src/screens/admin/ProductModerationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { adminApi } from '@/services/api/admin';

interface PendingProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  city: string;
  main_image: string;
  created_at: string;
  seller: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  category: {
    id: string;
    name: string;
  };
}

const ProductModerationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  useEffect(() => {
    loadPendingProducts();
  }, []);

  const loadPendingProducts = async () => {
    try {
      const response = await adminApi.getPendingProducts();
      setPendingProducts(response.products || []);
    } catch (error) {
      console.error('Error loading pending products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPendingProducts();
  };

  const handleApproveProduct = async (product: PendingProduct) => {
    Alert.alert(
      'Approuver le produit',
      `Êtes-vous sûr de vouloir approuver "${product.title}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Approuver',
          style: 'default',
          onPress: async () => {
            try {
              await adminApi.approveProduct(product.id);
              setPendingProducts(prev => prev.filter(p => p.id !== product.id));
              Alert.alert('Succès', 'Produit approuvé avec succès');
            } catch (error) {
              console.error('Error approving product:', error);
              Alert.alert('Erreur', 'Impossible d\'approuver le produit');
            }
          }
        }
      ]
    );
  };

  const handleRejectProduct = async (product: PendingProduct) => {
    Alert.alert(
      'Rejeter le produit',
      `Êtes-vous sûr de vouloir rejeter "${product.title}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Rejeter',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminApi.rejectProduct(product.id);
              setPendingProducts(prev => prev.filter(p => p.id !== product.id));
              Alert.alert('Succès', 'Produit rejeté avec succès');
            } catch (error) {
              console.error('Error rejecting product:', error);
              Alert.alert('Erreur', 'Impossible de rejeter le produit');
            }
          }
        }
      ]
    );
  };

  const handleViewProduct = (product: PendingProduct) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleContactSeller = (product: PendingProduct) => {
    navigation.navigate('Chat', {
      sellerId: product.seller.id,
      productId: product.id,
    });
  };

  const renderProduct = ({ item }: { item: PendingProduct }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.productInfo}
        onPress={() => handleViewProduct(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.main_image || 'https://via.placeholder.com/100' }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>
            {item.price.toLocaleString()} FCFA
          </Text>
          <Text style={styles.productCategory}>{item.category.name}</Text>
          <Text style={styles.productCondition}>{item.condition}</Text>
          <Text style={styles.productLocation}>{item.city}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.sellerInfo}>
        <Text style={styles.sellerLabel}>Vendeur:</Text>
        <Text style={styles.sellerName}>
          {item.seller.first_name} {item.seller.last_name}
        </Text>
        <Text style={styles.sellerContact}>{item.seller.email}</Text>
        <Text style={styles.sellerContact}>{item.seller.phone}</Text>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApproveProduct(item)}
        >
          <MaterialIcons name="check" size={20} color={colors.white} />
          <Text style={styles.approveButtonText}>Approuver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRejectProduct(item)}
        >
          <MaterialIcons name="close" size={20} color={colors.white} />
          <Text style={styles.rejectButtonText}>Rejeter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.contactButton]}
          onPress={() => handleContactSeller(item)}
        >
          <MaterialIcons name="message" size={20} color={colors.primaryBlue} />
          <Text style={styles.contactButtonText}>Contacter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productMeta}>
        <Text style={styles.createdDate}>
          Créé le {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement des produits en attente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modération des produits</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'PENDING' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('PENDING')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'PENDING' && styles.filterTextActive
            ]}>
              En attente ({pendingProducts.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'APPROVED' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('APPROVED')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'APPROVED' && styles.filterTextActive
            ]}>
              Approuvés
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'REJECTED' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('REJECTED')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'REJECTED' && styles.filterTextActive
            ]}>
              Rejetés
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {pendingProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="pending-actions" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>Aucun produit en attente</Text>
          <Text style={styles.emptySubtitle}>
            Tous les produits ont été modérés
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendingProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primaryOrange]}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  headerRight: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  filterContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primaryOrange,
  },
  filterText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
  },
  filterTextActive: {
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  listContainer: {
    padding: spacing.md,
  },
  productCard: {
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
  productInfo: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginBottom: spacing.xs,
  },
  productCategory: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  productCondition: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  productLocation: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  sellerInfo: {
    backgroundColor: colors.lightGray,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  sellerLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sellerName: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sellerContact: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  productActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  approveButton: {
    backgroundColor: colors.primaryGreen,
  },
  approveButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  rejectButton: {
    backgroundColor: colors.primaryRed,
  },
  rejectButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  contactButton: {
    backgroundColor: colors.lightBlue,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  contactButtonText: {
    color: colors.primaryBlue,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  productMeta: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  createdDate: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProductModerationScreen;
