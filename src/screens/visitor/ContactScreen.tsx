// src/screens/visitor/ContactScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Message envoyé',
        'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({ name: '', email: '', subject: '', message: '' });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmail = () => {
    Linking.openURL('mailto:contact@videgrenier-kamer.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+237123456789');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=237123456789&text=Bonjour, j\'ai besoin d\'aide');
  };

  const contactMethods = [
    {
      icon: 'email',
      title: 'Email',
      value: 'contact@videgrenier-kamer.com',
      action: handleEmail,
      color: colors.primaryOrange,
    },
    {
      icon: 'phone',
      title: 'Téléphone',
      value: '+237 123 456 789',
      action: handlePhone,
      color: colors.primaryGreen,
    },
    {
      icon: 'chat',
      title: 'WhatsApp',
      value: '+237 123 456 789',
      action: handleWhatsApp,
      color: colors.primaryGreen,
    },
  ];

  const supportHours = [
    { day: 'Lundi - Vendredi', hours: '8h00 - 18h00' },
    { day: 'Samedi', hours: '9h00 - 16h00' },
    { day: 'Dimanche', hours: '10h00 - 14h00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nous Contacter</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Contact Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moyens de Contact</Text>
            <View style={styles.contactMethods}>
              {contactMethods.map((method, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.contactMethod}
                  onPress={method.action}
                  activeOpacity={0.7}
                >
                  <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                    <MaterialIcons name={method.icon as any} size={24} color={colors.white} />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    <Text style={styles.methodValue}>{method.value}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Support Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Heures de Support</Text>
            <View style={styles.supportHours}>
              {supportHours.map((schedule, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <Text style={styles.scheduleDay}>{schedule.day}</Text>
                  <Text style={styles.scheduleHours}>{schedule.hours}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom complet *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Votre nom complet"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sujet *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.subject}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
                  placeholder="Sujet de votre message"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Message *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.message}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                  placeholder="Décrivez votre problème ou question..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <MaterialIcons name="send" size={20} color={colors.white} />
                    <Text style={styles.submitButtonText}>Envoyer le message</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* FAQ Link */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.faqCard} onPress={() => navigation.navigate('FAQ')}>
              <MaterialIcons name="help" size={32} color={colors.primaryOrange} />
              <View style={styles.faqContent}>
                <Text style={styles.faqTitle}>Questions Fréquentes</Text>
                <Text style={styles.faqSubtitle}>
                  Consultez notre FAQ pour des réponses rapides
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.primaryOrange} />
            </TouchableOpacity>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  contactMethods: {
    gap: spacing.sm,
  },
  contactMethod: {
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
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  methodValue: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  supportHours: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleDay: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  scheduleHours: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primaryOrange,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
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
  faqCard: {
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
  faqContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  faqTitle: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  faqSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});

export default ContactScreen; 