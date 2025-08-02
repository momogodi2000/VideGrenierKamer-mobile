// src/screens/visitor/VisitorLandingScreen.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { AfricanButton } from '@/components/common/AfricanButton';
import HeaderWithDrawer from '@/components/common/HeaderWithDrawer';

const { width } = Dimensions.get('window');

const VisitorLandingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);

  const featuredProducts = [
    {
      id: '1',
      name: 'iPhone 12 Pro',
      price: '350,000 FCFA',
      image: require('@/assets/images/product1.jpg'),
      condition: 'Excellent',
      location: 'Douala',
      seller: 'Jean K.',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Sac Traditionnel',
      price: '25,000 FCFA',
      image: require('@/assets/images/product2.jpg'),
      condition: 'Neuf',
      location: 'Yaoundé',
      seller: 'Marie T.',
      rating: 5.0,
    },
    {
      id: '3',
      name: 'MacBook Air M1',
      price: '650,000 FCFA',
      image: require('@/assets/images/product3.jpg'),
      condition: 'Très bon',
      location: 'Douala',
      seller: 'Paul M.',
      rating: 4.8,
    },
    {
      id: '4',
      name: 'Montre Connectée',
      price: '85,000 FCFA',
      image: require('@/assets/images/product4.jpg'),
      condition: 'Bon état',
      location: 'Bafoussam',
      seller: 'Alice N.',
      rating: 4.3,
    },
  ];

  const categories = [
    { id: '1', name: 'Électronique', icon: 'devices', color: colors.primaryOrange },
    { id: '2', name: 'Mode', icon: 'checkroom', color: colors.primaryYellow },
    { id: '3', name: 'Maison', icon: 'home', color: colors.primaryGreen },
    { id: '4', name: 'Sports', icon: 'sports-soccer', color: colors.primaryRed },
    { id: '5', name: 'Véhicules', icon: 'directions-car', color: colors.primaryBrown },
    { id: '6', name: 'Autres', icon: 'category', color: colors.accentTerracotta },
  ];

  const features = [
    {
      icon: 'verified-user',
      title: 'Paiements Sécurisés',
      description: 'Transactions protégées par Campay',
      color: colors.primaryGreen,
    },
    {
      icon: 'local-shipping',
      title: 'Livraison Nationale',
      description: 'Points de retrait dans 10 villes',
      color: colors.primaryOrange,
    },
    {
      icon: 'support-agent',
      title: 'Support Client',
      description: 'Assistance 7j/7 en français',
      color: colors.primaryYellow,
    },
    {
      icon: 'loyalty',
      title: 'Programme Fidélité',
      description: 'Gagnez des points à chaque achat',
      color: colors.primaryRed,
    },
  ];

  const handleBrowseProducts = () => {
    navigation.navigate('ProductList');
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('ProductList', { category: category.id });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.productImage} />
      
      <View style={styles.productBadge}>
        <Text style={styles.productCondition}>{item.condition}</Text>
      </View>
      
      <TouchableOpacity style={styles.favoriteButton}>
        <MaterialIcons name="favorite-border" size={20} color={colors.white} />
      </TouchableOpacity>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        
        <View style={styles.productMeta}>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={12} color={colors.gray} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          
          <View style={styles.sellerContainer}>
            <MaterialIcons name="star" size={12} color={colors.primaryYellow} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderWithDrawer title="Vidé-Grenier Kamer" showCart />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primaryOrange, colors.primaryYellow]}
          style={styles.hero}
        >
          <View style={styles.heroPattern}>
            <Text style={styles.patternText}>◈ ◆ ◈ ◆ ◈ ◆ ◈</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Bienvenue au Marché{'\n'}Africain Numérique
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Achetez et vendez en toute confiance avec la communauté VGK
          </Text>
          
          <AfricanButton
            title="Explorer les Produits"
            onPress={handleBrowseProducts}
            size="lg"
            icon="search"
            style={styles.heroButton}
          />
          
          <View style={styles.heroStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Produits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Vendeurs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>100K+</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories Populaires</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <MaterialIcons
                    name={category.icon as any}
                    size={32}
                    color={category.color}
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produits Vedettes</Text>
            <TouchableOpacity onPress={handleBrowseProducts}>
              <Text style={styles.seeAllText}>Voir plus</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Features Section */}
        <View style={[styles.section, styles.featuresSection]}>
          <Text style={styles.sectionTitle}>Pourquoi Choisir VGK ?</Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <MaterialIcons
                    name={feature.icon as any}
                    size={28}
                    color={feature.color}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={[colors.primaryGreen, colors.primaryYellow]}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitle}>
              Commencez à Vendre Aujourd'hui !
            </Text>
            <Text style={styles.ctaSubtitle}>
              Créez un compte et publiez vos articles en quelques minutes
            </Text>
            
            <View style={styles.ctaButtons}>
              <AfricanButton
                title="Créer un Compte"
                onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                variant="secondary"
                style={styles.ctaButton}
              />
              <AfricanButton
                title="Se Connecter"
                onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                variant="outline"
                style={[styles.ctaButton, styles.ctaButtonOutline]}
              />
            </View>
          </LinearGradient>
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
  scrollView: {
    flex: 1,
  },
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  heroPattern: {
    position: 'absolute',
    top: 10,
    opacity: 0.3,
  },
  patternText: {
    fontSize: fontSizes.lg,
    color: colors.white,
  },
  heroTitle: {
    fontSize: fontSizes['3xl'],
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  heroSubtitle: {
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
    paddingHorizontal: spacing.lg,
  },
  heroButton: {
    minWidth: 200,
    marginBottom: spacing.xl,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.white,
    opacity: 0.3,
    marginHorizontal: spacing.lg,
  },
  section: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
  },
  seeAllText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.primaryOrange,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryCard: {
    width: '33.33%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.secondaryDark,
    textAlign: 'center',
  },
  productList: {
    paddingRight: spacing.lg,
  },
  productCard: {
    width: width * 0.5,
    marginRight: spacing.base,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
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
    paddingVertical: spacing.xs,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  },
  productPrice: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginBottom: spacing.xs,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
   // ... continuing VisitorLandingScreen.tsx
   fontSize: fontSizes.xs,
   fontFamily: fonts.regular,
   color: colors.gray,
   marginLeft: 2,
 },
 sellerContainer: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 ratingText: {
   fontSize: fontSizes.xs,
   fontFamily: fonts.medium,
   color: colors.gray,
   marginLeft: 2,
 },
 featuresSection: {
   backgroundColor: colors.lightGray,
 },
 featuresGrid: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   marginHorizontal: -spacing.sm,
 },
 featureCard: {
   width: '50%',
   padding: spacing.sm,
 },
 featureIcon: {
   width: 56,
   height: 56,
   borderRadius: borderRadius.lg,
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: spacing.sm,
 },
 featureTitle: {
   fontSize: fontSizes.base,
   fontFamily: fonts.bold,
   color: colors.secondaryDark,
   marginBottom: spacing.xs,
 },
 featureDescription: {
   fontSize: fontSizes.xs,
   fontFamily: fonts.regular,
   color: colors.gray,
   lineHeight: fontSizes.xs * 1.5,
 },
 ctaSection: {
   marginVertical: spacing.xl,
   marginHorizontal: spacing.lg,
 },
 ctaGradient: {
   borderRadius: borderRadius.xl,
   padding: spacing.xl,
   alignItems: 'center',
 },
 ctaTitle: {
   fontSize: fontSizes['2xl'],
   fontFamily: fonts.bold,
   color: colors.white,
   marginBottom: spacing.sm,
   textAlign: 'center',
 },
 ctaSubtitle: {
   fontSize: fontSizes.base,
   fontFamily: fonts.regular,
   color: colors.white,
   marginBottom: spacing.xl,
   textAlign: 'center',
   opacity: 0.9,
 },
 ctaButtons: {
   flexDirection: 'row',
   gap: spacing.base,
 },
 ctaButton: {
   minWidth: 140,
 },
 ctaButtonOutline: {
   borderColor: colors.white,
 },
});

export default VisitorLandingScreen;