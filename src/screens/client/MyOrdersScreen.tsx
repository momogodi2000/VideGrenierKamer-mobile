// src/screens/client/MyOrdersScreen.tsx
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { orderApi } from '@/services/api/order';

interface Order {
  id: string;
  product: {
    id: string;
    title: string;
    main_image: string;
    price: number;
  };
  seller: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  buyer: {
    id: string;
    first_name: string;
    last_name: string;
  };
  quantity: number;
  total_amount: number;
  status: string;
  pickup_point?: {
    id: string;
    name: string;
    address: string;
  };
  created_at: string;
  updated_at: string;
}

type OrderStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const MyOrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('ALL');

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      const response = await orderApi.getMyOrders();
      setOrders(response.orders || []);
      filterOrders(response.orders || [], selectedStatus);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders();
  };

  const filterOrders = (orderList: Order[], status: OrderStatus) => {
    if (status === 'ALL') {
      setFilteredOrders(orderList);
    } else {
      setFilteredOrders(orderList.filter(order => order.status === status));
    }
  };

  const handleStatusFilter = (status: OrderStatus) => {
    setSelectedStatus(status);
    filterOrders(orders, status);
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const handleContactSeller = (order: Order) => {
    navigation.navigate('Chat', {
      sellerId: order.seller.id,
      productId: order.product.id,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return colors.primaryYellow;
      case 'CONFIRMED':
        return colors.primaryBlue;
      case 'SHIPPED':
        return colors.primaryOrange;
      case 'DELIVERED':
        return colors.primaryGreen;
      case 'CANCELLED':
        return colors.primaryRed;
      default:
        return colors.gray;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmé';
      case 'SHIPPED':
        return 'Expédié';
      case 'DELIVERED':
        return 'Livré';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'schedule';
      case 'CONFIRMED':
        return 'check-circle';
      case 'SHIPPED':
        return 'local-shipping';
      case 'DELIVERED':
        return 'done-all';
      case 'CANCELLED':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const statusFilters = [
    { key: 'ALL', label: 'Tous', count: orders.length },
    { key: 'PENDING', label: 'En attente', count: orders.filter(o => o.status === 'PENDING').length },
    { key: 'CONFIRMED', label: 'Confirmés', count: orders.filter(o => o.status === 'CONFIRMED').length },
    { key: 'SHIPPED', label: 'Expédiés', count: orders.filter(o => o.status === 'SHIPPED').length },
    { key: 'DELIVERED', label: 'Livrés', count: orders.filter(o => o.status === 'DELIVERED').length },
    { key: 'CANCELLED', label: 'Annulés', count: orders.filter(o => o.status === 'CANCELLED').length },
  ];

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Commande #{item.id.slice(-8)}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <MaterialIcons name={getStatusIcon(item.status) as any} size={16} color={colors.white} />
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.productSection}>
        <Image
          source={{ uri: item.product.main_image || 'https://via.placeholder.com/80' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.product.title}
          </Text>
          <Text style={styles.productPrice}>
            {item.product.price.toLocaleString()} FCFA
          </Text>
          <Text style={styles.quantityText}>
            Quantité: {item.quantity}
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>
            {item.total_amount.toLocaleString()} FCFA
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.contactButton]}
            onPress={() => handleContactSeller(item)}
          >
            <MaterialIcons name="message" size={16} color={colors.primaryBlue} />
            <Text style={styles.contactButtonText}>Contacter</Text>
          </TouchableOpacity>

          {item.pickup_point && (
            <TouchableOpacity
              style={[styles.actionButton, styles.pickupButton]}
              onPress={() => navigation.navigate('PickupDetail', { pickupPoint: item.pickup_point })}
            >
              <MaterialIcons name="location-on" size={16} color={colors.primaryGreen} />
              <Text style={styles.pickupButtonText}>Point de retrait</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement de vos commandes...</Text>
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
        <Text style={styles.headerTitle}>Mes Commandes</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={statusFilters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === item.key && styles.filterButtonActive
              ]}
              onPress={() => handleStatusFilter(item.key as OrderStatus)}
            >
              <Text style={[
                styles.filterText,
                selectedStatus === item.key && styles.filterTextActive
              ]}>
                {item.label} ({item.count})
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>
            {selectedStatus === 'ALL' ? 'Aucune commande' : `Aucune commande ${statusFilters.find(f => f.key === selectedStatus)?.label.toLowerCase()}`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {selectedStatus === 'ALL' 
              ? 'Commencez par acheter votre premier produit'
              : 'Aucune commande dans cette catégorie'
            }
          </Text>
          {selectedStatus === 'ALL' && (
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('ProductList')}
            >
              <Text style={styles.browseButtonText}>Parcourir les produits</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
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
  filtersContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersList: {
    paddingHorizontal: spacing.md,
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
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  orderDate: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  productSection: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
    fontSize: fontSizes.md,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginBottom: spacing.xs,
  },
  quantityText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  totalAmount: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  contactButton: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.lightBlue,
  },
  contactButtonText: {
    fontSize: fontSizes.sm,
    color: colors.primaryBlue,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  pickupButton: {
    borderColor: colors.primaryGreen,
    backgroundColor: colors.lightGreen,
  },
  pickupButtonText: {
    fontSize: fontSizes.sm,
    color: colors.primaryGreen,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
});

export default MyOrdersScreen; 