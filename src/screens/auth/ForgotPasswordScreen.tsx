// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AfricanButton from '@/components/common/AfricanButton';
import AfricanInput from '@/components/common/AfricanInput';

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .required('Email requis'),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      Alert.alert(
        'Email Envoyé',
        `Un email de réinitialisation a été envoyé à ${data.email}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (email) {
      onSubmit({ email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryOrange, colors.primaryYellow]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            
            <View style={styles.iconContainer}>
              <MaterialIcons name="lock-reset" size={60} color={colors.white} />
            </View>
            
            <Text style={styles.title}>Mot de Passe Oublié ?</Text>
            <Text style={styles.subtitle}>
              Pas d'inquiétude ! Entrez votre email et nous vous enverrons
              un lien pour réinitialiser votre mot de passe.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AfricanInput
                    label="Adresse Email"
                    placeholder="votre@email.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="email"
                  />
                )}
              />

              {emailSent && (
                <View style={styles.successMessage}>
                  <MaterialIcons 
                    name="check-circle" 
                    size={20} 
                    color={colors.success} 
                  />
                  <Text style={styles.successText}>
                    Email envoyé avec succès !
                  </Text>
                </View>
              )}

              <AfricanButton
                title={emailSent ? "Renvoyer l'Email" : "Envoyer le Lien"}
                onPress={emailSent ? handleResendEmail : handleSubmit(onSubmit)}
                loading={isLoading}
                style={styles.submitButton}
              />

              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => navigation.navigate('Login')}
              >
                <MaterialIcons 
                  name="arrow-back" 
                  size={16} 
                  color={colors.primaryOrange} 
                />
                <Text style={styles.backToLoginText}>
                  Retour à la connexion
                </Text>
              </TouchableOpacity>

              {/* Additional Help */}
              <View style={styles.helpSection}>
                <Text style={styles.helpTitle}>Besoin d'aide ?</Text>
                <Text style={styles.helpText}>
                  Si vous ne recevez pas l'email dans les 5 minutes,
                  vérifiez votre dossier spam ou contactez notre support.
                </Text>
                
                <TouchableOpacity style={styles.supportButton}>
                  <MaterialIcons 
                    name="support-agent" 
                    size={20} 
                    color={colors.primaryOrange} 
                  />
                  <Text style={styles.supportText}>
                    Contacter le Support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    padding: spacing.sm,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: spacing.xl,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: spacing.xl,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
  },
  successText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.success,
    marginLeft: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
  },
  backToLoginText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.medium,
    color: colors.primaryOrange,
    marginLeft: spacing.xs,
  },
  helpSection: {
    marginTop: spacing.xl,
    padding: spacing.base,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.lg,
  },
  helpTitle: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
   marginBottom: spacing.sm,
 },
 helpText: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.regular,
   color: colors.gray,
   lineHeight: fontSizes.sm * 1.5,
   marginBottom: spacing.base,
 },
 supportButton: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   paddingVertical: spacing.sm,
 },
 supportText: {
   fontSize: fontSizes.sm,
   fontFamily: fonts.medium,
   color: colors.primaryOrange,
   marginLeft: spacing.xs,
 },
});

export default ForgotPasswordScreen;