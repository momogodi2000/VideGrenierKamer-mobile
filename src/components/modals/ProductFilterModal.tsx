// src/components/modals/ProductFilterModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import AfricanButton from '@/components/common/AfricanButton';
import AfricanInput from '@/components/common/AfricanInput';
import AfricanSelect from '@/components/common/AfricanSelect';

interface ProductFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [filters, setFilters] = useState(currentFilters);

  const categories = [
    { label: 'Toutes catégories', value: '' },
    { label: 'Électronique', value: 'electronique' },
    { label: 'Mode', value: 'mode' },
    { label: 'Maison', value: 'maison' },
    { label: 'Sports', value: 'sports' },
    { label: 'Véhicules', value: 'vehicules' },
    { label: 'Autres', value: 'autres' },
  ];

  const conditions = [
    { label: 'Toutes conditions', value: '' },
    { label: 'Neuf', value: 'NEUF' },
    { label: 'Excellent', value: 'EXCELLENT' },
    { label: 'Très bon', value: 'TRES_BON' },
    { label: 'Bon', value: 'BON' },
    { label: 'Acceptable', value: 'ACCEPTABLE' },
  ];

  const cities = [
    { label: 'Toutes les villes', value: '' },
    { label: 'Douala', value: 'DOUALA' },
    { label: 'Yaoundé', value: 'YAOUNDE' },
    { label: 'Bafoussam', value: 'BAFOUSSAM' },
    { label: 'Bamenda', value: 'BAMENDA' },
    { label: 'Garoua', value: 'GAROUA' },
  ];

  const sortOptions = [
    { label: 'Plus récents', value: 'created_at' },
    { label: 'Prix croissant', value: 'price_asc' },
    { label: 'Prix décroissant', value: 'price_desc' },
    { label: 'Plus populaires', value: 'views' },
  ];

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      city: '',
      sortBy: 'created_at',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filtrer les Produits</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.secondaryDark} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Category */}
          <AfricanSelect
            label="Catégorie"
            placeholder="Sélectionnez une catégorie"
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
            items={categories}
            icon="category"
          />

          {/* Price Range */}
          <View style={styles.priceSection}>
            <Text style={styles.sectionTitle}>Fourchette de Prix (FCFA)</Text>
            <View style={styles.priceInputs}>
              <AfricanInput
                placeholder="Min"
                value={filters.minPrice}
                onChangeText={(value) => setFilters({ ...filters, minPrice: value })}
                keyboardType="numeric"
                containerStyle={styles.priceInput}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <AfricanInput
                placeholder="Max"
                value={filters.maxPrice}
                onChangeText={(value) => setFilters({ ...filters, maxPrice: value })}
                keyboardType="numeric"
                containerStyle={styles.priceInput}
              />
            </View>
          </View>

          {/* Condition */}
          <AfricanSelect
            label="État"
            placeholder="Sélectionnez l'état"
            value={filters.condition}
            onValueChange={(value) => setFilters({ ...filters, condition: value })}
            items={conditions}
            icon="verified"
          />

          {/* City */}
          <AfricanSelect
            label="Ville"
            placeholder="Sélectionnez une ville"
            value={filters.city}
            onValueChange={(value) => setFilters({ ...filters, city: value })}
            items={cities}
            icon="location-city"
          />

          {/* Sort By */}
          <AfricanSelect
            label="Trier par"
            placeholder="Sélectionnez le tri"
            value={filters.sortBy}
            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
            items={sortOptions}
            icon="sort"
          />

          {/* Additional Filters */}
          <View style={styles.additionalFilters}>
            <Text style={styles.sectionTitle}>Filtres Supplémentaires</Text>
            
            <TouchableOpacity style={styles.checkboxItem}>
              <View style={[styles.checkbox, filters.negotiable && styles.checkboxChecked]}>
                {filters.negotiable && (
                  <MaterialIcons name="check" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Prix négociable uniquement</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkboxItem}>
              <View style={[styles.checkbox, filters.verified && styles.checkboxChecked]}>
                {filters.verified && (
                  <MaterialIcons name="check" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Vendeurs vérifiés uniquement</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <AfricanButton
            title="Réinitialiser"
            onPress={handleReset}
            variant="outline"
            style={styles.footerButton}
          />
          <AfricanButton
            title="Appliquer"
            onPress={handleApply}
            variant="primary"
            style={styles.footerButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  priceSection: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.gray,
    marginHorizontal: spacing.base,
  },
  additionalFilters: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primaryOrange,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primaryOrange,
  },
  checkboxLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.secondaryDark,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: spacing.base,
  },
  footerButton: {
    flex: 1,
  },
});

export default ProductFilterModal;