// src/screens/visitor/ProductListScreen.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import HeaderWithDrawer from '@/components/common/HeaderWithDrawer';
import ProductFilterModal from '@/components/modals/ProductFilterModal';
import { productsApi } from '@/services/api/products';

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const categoryId = route.params?.category;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryId || '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    city: '',
    sortBy: 'created_at',
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      const response = await productsApi.getProducts(filters);
      setProducts(response.results);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts();
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      await productsApi.toggleFavorite(productId);
      // Update local state
      setProducts(products.map(p => 
        p.id === productId 
          ? { ...p, is_favorited: !p.is_favorited }
          : p
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.main_image || 'https://via.placeholder.com/150' }} 
        style={styles.productImage} 
      />
      
      <View style={styles.productBadge}>
        <Text style={styles.productCondition}>{item.condition}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item.id)}
      >
        <MaterialIcons 
          name={item.is_favorited ? "favorite" : "favorite-border"} 
          size={20} 
          color={item.is_favorited ? colors.primaryRed : colors.white} 
        />
      </TouchableOpacity>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>{item.price} FCFA</Text>
        
        <View style={styles.productMeta}>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={12} color={colors.gray} />
            <Text style={styles.locationText}>{item.city}</Text>
          </View>
          
          <View style={styles.dateContainer}>
            <MaterialIcons name="access-time" size={12} color={colors.gray} />
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.sellerInfo}>
          <Image 
            source={{ uri: item.seller.profile_picture || 'https://via.placeholder.com/30' }}
            style={styles.sellerAvatar}
          />
          <Text style={styles.sellerName}>
            {item.seller.first_name} {item.seller.last_name[0]}.
          </Text>
          <View style={styles.trustScore}>
            <MaterialIcons name="verified" size={12} color={colors.primaryGreen} />
            <Text style={styles.trustScoreText}>{item.seller.trust_score}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithDrawer title="Produits" showCart showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithDrawer title="Produits" showCart showBack />
      
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons name="filter-list" size={20} color={colors.primaryOrange} />
          <Text style={styles.filterButtonText}>Filtrer</Text>
        </TouchableOpacity>
        
        <View style={styles.sortContainer}>
          <MaterialIcons name="sort" size={20} color={colors.gray} />
          <Text style={styles.sortText}>Plus récents</Text>
        </View>
      </View>
      
      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.productRow}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primaryOrange]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inventory" size={64} color={colors.gray} />
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          </View>
        }
      />
      
      {/* Filter Modal */}
      <ProductFilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={applyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primaryOrange,
  },
  filterButtonText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.primaryOrange,
    marginLeft: spacing.xs,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: spacing.xs,
  },
  productList: {
    padding: spacing.base,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightGray,
  },
  productBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  productCondition: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: spacing.base,
  },
  productName: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.secondaryDark,
    marginBottom: spacing.xs,
    lineHeight: fontSizes.sm * 1.3,
  },
  productPrice: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginBottom: spacing.sm,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: 2,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.xs,
  },
  sellerName: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.secondaryDark,
    flex: 1,
  },
  trustScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustScoreText: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.medium,
    color: colors.primaryGreen,
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginTop: spacing.base,
  },
});

export default ProductListScreen;