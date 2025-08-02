// src/screens/client/MyProductsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { productsApi } from '@/services/api/products';
import { Product } from '@/services/api/products';

type ProductStatus = 'ALL' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'REJECTED';

const MyProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus>('ALL');

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    try {
      const response = await productsApi.getMyProducts();
      setProducts(response);
      filterProducts(response, selectedStatus);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Erreur', 'Impossible de charger vos produits');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts();
  };

  const filterProducts = (productList: Product[], status: ProductStatus) => {
    if (status === 'ALL') {
      setFilteredProducts(productList);
    } else {
      setFilteredProducts(productList.filter(product => product.status === status));
    }
  };

  const handleStatusFilter = (status: ProductStatus) => {
    setSelectedStatus(status);
    filterProducts(products, status);
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('EditProduct', { productId: product.id });
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Supprimer le produit',
      `Êtes-vous sûr de vouloir supprimer "${product.title}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await productsApi.deleteProduct(product.id);
              setProducts(prev => prev.filter(p => p.id !== product.id));
              filterProducts(products.filter(p => p.id !== product.id), selectedStatus);
              Alert.alert('Succès', 'Produit supprimé avec succès');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le produit');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return colors.primaryGreen;
      case 'PENDING':
        return colors.primaryYellow;
      case 'SOLD':
        return colors.primaryBlue;
      case 'REJECTED':
        return colors.primaryRed;
      default:
        return colors.gray;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'PENDING':
        return 'En attente';
      case 'SOLD':
        return 'Vendu';
      case 'REJECTED':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const statusFilters = [
    { key: 'ALL', label: 'Tous', count: products.length },
    { key: 'ACTIVE', label: 'Actifs', count: products.filter(p => p.status === 'ACTIVE').length },
    { key: 'PENDING', label: 'En attente', count: products.filter(p => p.status === 'PENDING').length },
    { key: 'SOLD', label: 'Vendus', count: products.filter(p => p.status === 'SOLD').length },
    { key: 'REJECTED', label: 'Rejetés', count: products.filter(p => p.status === 'REJECTED').length },
  ];

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.main_image || 'https://via.placeholder.com/120' }} 
        style={styles.productImage} 
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()} FCFA
        </Text>
        
        <View style={styles.productMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
          
          <Text style={styles.productDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.productStats}>
          <View style={styles.stat}>
            <MaterialIcons name="visibility" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.views_count} vues</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="favorite" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.likes_count} likes</Text>
          </View>
        </View>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditProduct(item)}
        >
          <MaterialIcons name="edit" size={20} color={colors.primaryBlue} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item)}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement de vos produits...</Text>
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
        <Text style={styles.headerTitle}>Mes Produits</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateProduct')}>
          <MaterialIcons name="add" size={24} color={colors.primaryOrange} />
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedStatus === filter.key && styles.filterButtonActive
              ]}
              onPress={() => handleStatusFilter(filter.key as ProductStatus)}
            >
              <Text style={[
                styles.filterText,
                selectedStatus === filter.key && styles.filterTextActive
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="inventory" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>
            {selectedStatus === 'ALL' ? 'Aucun produit' : `Aucun produit ${statusFilters.find(f => f.key === selectedStatus)?.label.toLowerCase()}`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {selectedStatus === 'ALL' 
              ? 'Commencez par créer votre premier produit'
              : 'Aucun produit dans cette catégorie'
            }
          </Text>
          {selectedStatus === 'ALL' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateProduct')}
            >
              <MaterialIcons name="add" size={20} color={colors.white} />
              <Text style={styles.createButtonText}>Créer un produit</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
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
  filtersContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.lightGray,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryOrange,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  createButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.sm,
  },
  listContainer: {
    padding: spacing.md,
  },
  productCard: {
    flexDirection: 'row',
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
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  productInfo: {
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
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontFamily: fonts.semiBold,
  },
  productDate: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  productStats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  productActions: {
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.lightBlue,
  },
  deleteButton: {
    backgroundColor: colors.lightRed,
  },
});

export default MyProductsScreen;
