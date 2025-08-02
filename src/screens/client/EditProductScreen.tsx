// src/screens/client/EditProductScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { productsApi } from '@/services/api/products';
import { categoriesApi } from '@/services/api/categories';
import { Product, Category } from '@/services/api/products';

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  category: string;
  city: string;
  is_negotiable: boolean;
  images: any[];
  existingImages: any[];
}

const EditProductScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const productId = route.params?.productId;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    city: '',
    is_negotiable: false,
    images: [],
    existingImages: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await productsApi.getProduct(productId);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        condition: product.condition,
        category: product.category.id,
        city: product.city,
        is_negotiable: product.is_negotiable,
        images: [],
        existingImages: product.images || [],
      });
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Erreur', 'Impossible de charger le produit');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await categoriesApi.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const requestImagePermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre galerie.');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'product_image.jpg',
        }));
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 5 - prev.existingImages.length)
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const removeExistingImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.id !== imageId)
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le titre du produit');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir la description du produit');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un prix valide');
      return false;
    }
    if (!formData.condition) {
      Alert.alert('Erreur', 'Veuillez sélectionner l\'état du produit');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir la ville');
      return false;
    }
    if (formData.existingImages.length + formData.images.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins une image');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        condition: formData.condition,
        category: formData.category,
        city: formData.city.trim(),
        is_negotiable: formData.is_negotiable,
        images: formData.images,
      };

      await productsApi.updateProduct(productId, productData);
      
      Alert.alert(
        'Succès',
        'Votre produit a été mis à jour avec succès',
        [
          {
            text: 'Voir mes produits',
            onPress: () => navigation.navigate('MyProducts')
          },
          {
            text: 'Continuer',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditions = [
    { value: 'NEW', label: 'Neuf' },
    { value: 'LIKE_NEW', label: 'Comme neuf' },
    { value: 'GOOD', label: 'Bon état' },
    { value: 'FAIR', label: 'État correct' },
    { value: 'POOR', label: 'Mauvais état' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement du produit...</Text>
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
        <Text style={styles.headerTitle}>Modifier le produit</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Images Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos du produit *</Text>
            <Text style={styles.sectionSubtitle}>
              {formData.existingImages.length + formData.images.length}/5 images
            </Text>
            
            <View style={styles.imageGrid}>
              {/* Existing Images */}
              {formData.existingImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  <Image source={{ uri: image.image_url }} style={styles.productImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeExistingImage(image.id)}
                  >
                    <MaterialIcons name="close" size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* New Images */}
              {formData.images.map((image, index) => (
                <View key={`new-${index}`} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.productImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeNewImage(index)}
                  >
                    <MaterialIcons name="close" size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Add Image Button */}
              {formData.existingImages.length + formData.images.length < 5 && (
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <MaterialIcons name="add-a-photo" size={32} color={colors.primaryOrange} />
                  <Text style={styles.addImageText}>Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de base</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Titre du produit *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Ex: iPhone 12 Pro Max 128GB"
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Décrivez votre produit en détail..."
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Prix (FCFA) *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setFormData(prev => ({ ...prev, is_negotiable: !prev.is_negotiable }))}
            >
              <MaterialIcons
                name={formData.is_negotiable ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={formData.is_negotiable ? colors.primaryOrange : colors.textSecondary}
              />
              <Text style={styles.checkboxLabel}>Prix négociable</Text>
            </TouchableOpacity>
          </View>

          {/* Category & Condition Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catégorie et état</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catégorie *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={formData.category ? styles.pickerText : styles.pickerPlaceholder}>
                  {formData.category ? categories.find(c => c.id === formData.category)?.name : 'Sélectionner une catégorie'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>État du produit *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowConditionModal(true)}
              >
                <Text style={formData.condition ? styles.pickerText : styles.pickerPlaceholder}>
                  {formData.condition ? conditions.find(c => c.value === formData.condition)?.label : 'Sélectionner l\'état'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ville *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.city}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                placeholder="Ex: Douala"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Mettre à jour le produit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      {showCategoryModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une catégorie</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, category: category.id }));
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{category.name}</Text>
                  <Text style={styles.modalItemSubtext}>{category.product_count} produits</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Condition Modal */}
      {showConditionModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner l'état</Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, condition: condition.value }));
                    setShowConditionModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{condition.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
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
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    width: (width - spacing.md * 3) / 3,
    height: (width - spacing.md * 3) / 3,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: (width - spacing.md * 3) / 3,
    height: (width - spacing.md * 3) / 3,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: fontSizes.sm,
    color: colors.primaryOrange,
    marginTop: spacing.xs,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  pickerPlaceholder: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkboxLabel: {
    fontSize: fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  submitSection: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  submitButton: {
    backgroundColor: colors.primaryOrange,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontFamily: fonts.semiBold,
  },
  modalItemSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default EditProductScreen; 