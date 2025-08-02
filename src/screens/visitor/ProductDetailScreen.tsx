// src/screens/visitor/ProductDetailScreen.tsx
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
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { productsApi } from '@/services/api/products';
import { visitorApi } from '@/services/api/visitor';
import { Product } from '@/services/api/products';

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const productId = route.params?.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const productData = await productsApi.getProduct(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await visitorApi.addToCart({
        product_id: product.id,
        quantity: 1
      });
      
      Alert.alert(
        'Ajouté au panier',
        'Le produit a été ajouté à votre panier',
        [
          {
            text: 'Voir le panier',
            onPress: () => navigation.navigate('Cart')
          },
          {
            text: 'Continuer',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleContactSeller = async () => {
    if (!product) return;

    setIsContactingSeller(true);
    try {
      // Navigate to chat or contact screen
      navigation.navigate('Chat', { 
        sellerId: product.seller.id,
        productId: product.id 
      });
    } catch (error) {
      console.error('Error contacting seller:', error);
      Alert.alert('Erreur', 'Impossible de contacter le vendeur');
    } finally {
      setIsContactingSeller(false);
    }
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      await Share.share({
        message: `Découvrez ce produit sur Vidé-Grenier Kamer: ${product.title} - ${product.price.toLocaleString()} FCFA`,
        url: `https://videgrenier-kamer.com/products/${product.slug}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

    try {
      await productsApi.toggleFavorite(product.id);
      setProduct(prev => prev ? { ...prev, is_favorited: !prev.is_favorited } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    Alert.alert(
      'Acheter maintenant',
      'Voulez-vous acheter ce produit maintenant ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Acheter',
          onPress: () => {
            // Navigate to checkout
            navigation.navigate('Checkout', { 
              items: [{ product_id: product.id, quantity: 1 }]
            });
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={80} color={colors.error} />
          <Text style={styles.errorTitle}>Produit non trouvé</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProduct}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = product.images || [];
  const mainImage = product.main_image || images[0]?.image_url;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <MaterialIcons name="share" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.headerButton}>
            <MaterialIcons 
              name={product.is_favorited ? "favorite" : "favorite-border"} 
              size={24} 
              color={product.is_favorited ? colors.error : colors.white} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: mainImage || 'https://via.placeholder.com/400' }} 
            style={styles.mainImage} 
            resizeMode="cover"
          />
          
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{product.price.toLocaleString()} FCFA</Text>
            {product.is_negotiable && (
              <View style={styles.negotiableBadge}>
                <Text style={styles.negotiableText}>Négociable</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{product.title}</Text>
          
          <View style={styles.conditionRow}>
            <MaterialIcons name="category" size={16} color={colors.textSecondary} />
            <Text style={styles.conditionText}>{product.condition}</Text>
          </View>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
            <Text style={styles.locationText}>{product.city}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <MaterialIcons name="visibility" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{product.views_count} vues</Text>
            </View>
            <View style={styles.stat}>
              <MaterialIcons name="favorite" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{product.likes_count} likes</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Vendeur</Text>
            <View style={styles.sellerCard}>
              <Image 
                source={{ uri: product.seller?.profile_picture || 'https://via.placeholder.com/50' }} 
                style={styles.sellerAvatar} 
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>
                  {product.seller?.first_name} {product.seller?.last_name}
                </Text>
                <Text style={styles.sellerLocation}>{product.seller?.city}</Text>
                <View style={styles.sellerStats}>
                  <Text style={styles.sellerStat}>
                    {product.seller?.trust_score || 0}% de confiance
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => navigation.navigate('SellerProfile', { sellerId: product.seller?.id })}
              >
                <Text style={styles.viewProfileText}>Voir profil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.contactButton]}
          onPress={handleContactSeller}
          disabled={isContactingSeller}
        >
          {isContactingSeller ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <MaterialIcons name="message" size={20} color={colors.white} />
              <Text style={styles.contactButtonText}>Contacter</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          onPress={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <MaterialIcons name="shopping-cart" size={20} color={colors.white} />
              <Text style={styles.cartButtonText}>Panier</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyButtonText}>Acheter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primaryOrange,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
  },
  content: {
    padding: spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSizes.xxl,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginRight: spacing.sm,
  },
  negotiableBadge: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  negotiableText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  conditionText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sellerSection: {
    marginBottom: spacing.xl,
  },
  sellerCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sellerLocation: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sellerStats: {
    flexDirection: 'row',
  },
  sellerStat: {
    fontSize: fontSizes.sm,
    color: colors.primaryGreen,
    fontFamily: fonts.semiBold,
  },
  viewProfileButton: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
  },
  viewProfileText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontFamily: fonts.semiBold,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
  },
  contactButton: {
    backgroundColor: colors.primaryBlue,
  },
  contactButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  cartButton: {
    backgroundColor: colors.primaryYellow,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  buyButton: {
    backgroundColor: colors.primaryOrange,
  },
  buyButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
  },
});

export default ProductDetailScreen;
