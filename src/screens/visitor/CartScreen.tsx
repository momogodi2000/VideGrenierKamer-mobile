// src/screens/visitor/CartScreen.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { cartApi } from '@/services/api/cart';
import { visitorApi } from '@/services/api/visitor';

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    main_image: string;
    condition: string;
  };
  quantity: number;
  created_at: string;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await visitorApi.getCart();
      setCartItems(response.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCart();
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      await visitorApi.updateCartItem(itemId, newQuantity);
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la quantité');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await visitorApi.removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'article');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Votre panier est vide');
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await visitorApi.createOrder({
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      });
      
      Alert.alert(
        'Commande créée',
        'Votre commande a été créée avec succès',
        [
          {
            text: 'Voir la commande',
            onPress: () => navigation.navigate('OrderDetail', { orderId: response.id })
          },
          {
            text: 'Continuer',
            style: 'cancel'
          }
        ]
      );
      
      // Clear cart after successful order
      setCartItems([]);
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Erreur', 'Impossible de créer la commande');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.product.main_image || 'https://via.placeholder.com/80' }} 
        style={styles.productImage} 
      />
      
      <View style={styles.itemDetails}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.productCondition}>{item.product.condition}</Text>
        <Text style={styles.productPrice}>
          {item.product.price.toLocaleString()} FCFA
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <MaterialIcons name="remove" size={20} color={colors.primaryOrange} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <MaterialIcons name="add" size={20} color={colors.primaryOrange} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <MaterialIcons name="delete" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement du panier...</Text>
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
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <View style={styles.headerRight} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des produits pour commencer vos achats
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('ProductList')}
          >
            <Text style={styles.browseButtonText}>Parcourir les produits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
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

          {/* Checkout Section */}
          <View style={styles.checkoutSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total ({cartItems.length} articles)</Text>
              <Text style={styles.totalAmount}>
                {calculateTotal().toLocaleString()} FCFA
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.checkoutButton, isCheckingOut && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.checkoutButtonText}>Passer la commande</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
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
  browseButton: {
    backgroundColor: colors.primaryOrange,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  browseButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
  },
  listContainer: {
    padding: spacing.md,
  },
  cartItem: {
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
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    lineHeight: 20,
  },
  productCondition: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  productPrice: {
    fontSize: fontSizes.md,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginTop: spacing.xs,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    marginHorizontal: spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.xs,
  },
  checkoutSection: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  totalAmount: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
  },
  checkoutButton: {
    backgroundColor: colors.primaryOrange,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
  },
});

export default CartScreen; 