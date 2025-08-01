// src/screens/auth/TermsConditionsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import AfricanButton from '@/components/common/AfricanButton';

const { height } = Dimensions.get('window');

interface TermsConditionsScreenProps {
  onAccept: () => void;
}

const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const handleAccept = () => {
    if (!accepted) {
      Alert.alert(
        'Conditions Requises',
        'Veuillez accepter les termes et conditions pour continuer.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!scrolledToEnd) {
      Alert.alert(
        'Lecture Requise',
        'Veuillez lire l\'intégralité des termes et conditions avant d\'accepter.',
        [{ text: 'OK' }]
      );
      return;
    }

    onAccept();
  };

  const handleDecline = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir refuser les termes et conditions ? L\'application ne peut pas fonctionner sans votre acceptation.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Quitter', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you might want to close the app
            Alert.alert('Au revoir', 'Merci de votre visite.');
          }
        },
      ]
    );
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    if (isAtEnd && !scrolledToEnd) {
      setScrolledToEnd(true);
    }
  };

  const termsContent = [
    {
      title: '1. Acceptation des Conditions',
      content: 'En utilisant l\'application Vidé-Grenier Kamer, vous acceptez d\'être lié par ces termes et conditions. Ces conditions régissent votre utilisation de notre plateforme de marché en ligne.',
    },
    {
      title: '2. Utilisation du Service',
      content: 'L\'application permet aux utilisateurs de vendre et acheter des articles d\'occasion de manière sécurisée. Vous devez avoir au moins 18 ans pour utiliser ce service. Toute utilisation frauduleuse est strictement interdite.',
    },
    {
      title: '3. Inscription et Compte',
      content: 'Pour accéder à toutes les fonctionnalités, vous devez créer un compte avec des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.',
    },
    {
      title: '4. Responsabilités des Utilisateurs',
      content: 'Les utilisateurs sont responsables de la véracité des informations fournies et de la qualité des produits vendus. Toute tentative de fraude ou de tromperie entraînera la suspension immédiate du compte.',
    },
    {
      title: '5. Protection des Données',
      content: 'Vos données personnelles sont protégées conformément à notre politique de confidentialité. Nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite.',
    },
    {
      title: '6. Paiements et Transactions',
      content: 'Les transactions sont sécurisées et gérées par nos partenaires de paiement certifiés. Une commission de 5% est prélevée sur chaque vente réussie.',
    },
    {
      title: '7. Politique de Retour',
      content: 'Les acheteurs disposent de 48 heures après réception pour signaler tout problème. Les vendeurs doivent décrire leurs articles avec précision pour éviter les litiges.',
    },
    {
      title: '8. Propriété Intellectuelle',
      content: 'Tout le contenu de l\'application est protégé par des droits d\'auteur. Vous ne pouvez pas copier, modifier ou distribuer notre contenu sans autorisation.',
    },
    {
      title: '9. Limitation de Responsabilité',
      content: 'Vidé-Grenier Kamer agit comme intermédiaire et n\'est pas responsable de la qualité des produits échangés entre utilisateurs.',
    },
    {
      title: '10. Modifications des Conditions',
      content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés de tout changement significatif.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.secondaryBeige, colors.secondaryCream]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerPattern}>
            <Text style={styles.patternText}>◈ ◆ ◈ ◆ ◈</Text>
          </View>
          <Text style={styles.title}>Termes et Conditions</Text>
          <Text style={styles.subtitle}>Vidé-Grenier Kamer</Text>
          <Text style={styles.version}>Version 1.0 - Janvier 2025</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.introContainer}>
            <Text style={styles.introText}>
              Bienvenue sur Vidé-Grenier Kamer, le marché africain numérique. 
              Veuillez lire attentivement ces conditions avant d'utiliser notre application.
            </Text>
          </View>

          {termsContent.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Nous Contacter</Text>
            <Text style={styles.contactText}>
              Pour toute question concernant ces conditions, contactez-nous à:
            </Text>
            <Text style={styles.contactEmail}>support@videgrenier-kamer.com</Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!scrolledToEnd && (
            <Text style={styles.scrollHint}>
              ⬇ Faites défiler pour lire l'intégralité des conditions
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
            disabled={!scrolledToEnd}
          >
            <View style={[
              styles.checkbox,
              accepted && styles.checkboxChecked,
              !scrolledToEnd && styles.checkboxDisabled,
            ]}>
              {accepted && (
                <MaterialIcons name="check" size={18} color={colors.white} />
              )}
            </View>
            <Text style={[
              styles.checkboxText,
              !scrolledToEnd && styles.checkboxTextDisabled,
            ]}>
              J'ai lu et j'accepte les termes et conditions
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <AfricanButton
              title="Refuser"
              onPress={handleDecline}
              variant="outline"
              style={styles.declineButton}
            />
            <AfricanButton
              title="Accepter"
              onPress={handleAccept}
              variant="primary"
              disabled={!accepted || !scrolledToEnd}
              style={styles.acceptButton}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerPattern: {
    marginBottom: spacing.base,
  },
  patternText: {
    fontSize: fontSizes.lg,
    color: colors.primaryOrange,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  introContainer: {
    backgroundColor: colors.white,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryOrange,
  },
  introText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.secondaryDark,
    lineHeight: fontSizes.sm * 1.6,
  },
  section: {
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fontSizes.sm * 1.6,
  },
  contactSection: {
    backgroundColor: colors.primaryYellow + '20',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginTop: spacing.base,
  },
  contactTitle: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
    marginBottom: spacing.sm,
  },
  contactText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  contactEmail: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.primaryOrange,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  scrollHint: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.primaryOrange,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
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
  checkboxDisabled: {
    borderColor: colors.lightGray,
    backgroundColor: colors.lightGray,
  },
  checkboxText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.secondaryDark,
    flex: 1,
  },
  checkboxTextDisabled: {
    color: colors.gray,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  declineButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 1,
  },
});

export default TermsConditionsScreen;