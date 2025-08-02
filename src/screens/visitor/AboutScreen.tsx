// src/screens/visitor/AboutScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleContactUs = () => {
    navigation.navigate('Contact');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTermsConditions = () => {
    navigation.navigate('TermsConditions');
  };

  const handleWebsite = () => {
    Linking.openURL('https://videgrenier-kamer.com');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:contact@videgrenier-kamer.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+237123456789');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À Propos</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* App Logo and Title */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="store" size={60} color={colors.primaryOrange} />
            </View>
            <Text style={styles.appTitle}>Vidé-Grenier Kamer</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appTagline}>
              La marketplace de confiance pour acheter et vendre au Cameroun
            </Text>
          </View>

          {/* App Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notre Mission</Text>
            <Text style={styles.description}>
              Vidé-Grenier Kamer est une plateforme de marketplace qui connecte les acheteurs 
              et les vendeurs au Cameroun. Notre mission est de faciliter le commerce local 
              en offrant une solution sécurisée et conviviale pour l'achat et la vente de 
              produits d'occasion et neufs.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nos Services</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="security" size={24} color={colors.primaryGreen} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Transactions Sécurisées</Text>
                  <Text style={styles.featureDescription}>
                    Paiements sécurisés et protection des données
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <MaterialIcons name="verified-user" size={24} color={colors.primaryBlue} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Utilisateurs Vérifiés</Text>
                  <Text style={styles.featureDescription}>
                    Système de vérification pour la confiance
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <MaterialIcons name="support-agent" size={24} color={colors.primaryOrange} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Support Client</Text>
                  <Text style={styles.featureDescription}>
                    Assistance 24/7 pour nos utilisateurs
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <MaterialIcons name="local-shipping" size={24} color={colors.primaryYellow} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Livraison Rapide</Text>
                  <Text style={styles.featureDescription}>
                    Service de livraison dans tout le Cameroun
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nous Contacter</Text>
            <View style={styles.contactList}>
              <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                <MaterialIcons name="email" size={24} color={colors.primaryOrange} />
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>contact@videgrenier-kamer.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactItem} onPress={handlePhone}>
                <MaterialIcons name="phone" size={24} color={colors.primaryOrange} />
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Téléphone</Text>
                  <Text style={styles.contactValue}>+237 123 456 789</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
                <MaterialIcons name="language" size={24} color={colors.primaryOrange} />
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Site Web</Text>
                  <Text style={styles.contactValue}>www.videgrenier-kamer.com</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.contactItem}>
                <MaterialIcons name="location-on" size={24} color={colors.primaryOrange} />
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Adresse</Text>
                  <Text style={styles.contactValue}>
                    Douala, Cameroun{'\n'}
                    Yaoundé, Cameroun
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Legal Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations Légales</Text>
            <View style={styles.legalLinks}>
              <TouchableOpacity style={styles.legalLink} onPress={handlePrivacyPolicy}>
                <MaterialIcons name="privacy-tip" size={20} color={colors.primaryBlue} />
                <Text style={styles.legalLinkText}>Politique de Confidentialité</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.legalLink} onPress={handleTermsConditions}>
                <MaterialIcons name="description" size={20} color={colors.primaryBlue} />
                <Text style={styles.legalLinkText}>Conditions d'Utilisation</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 Vidé-Grenier Kamer. Tous droits réservés.
            </Text>
            <Text style={styles.footerSubtext}>
              Développé avec ❤️ au Cameroun
            </Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: spacing.md,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  appTitle: {
    fontSize: fontSizes.xxl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  appTagline: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  contactList: {
    gap: spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  contactLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  legalLinks: {
    gap: spacing.sm,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legalLinkText: {
    fontSize: fontSizes.md,
    color: colors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    fontSize: fontSizes.sm,
    color: colors.primaryOrange,
    fontFamily: fonts.semiBold,
  },
});

export default AboutScreen; 