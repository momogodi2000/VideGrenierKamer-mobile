// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register, clearError } from '@/store/slices/authSlice';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AfricanButton from '@/components/common/AfricanButton';
import AfricanInput from '@/components/common/AfricanInput';
import AfricanSelect from '@/components/common/AfricanSelect';

// Validation schema
const registerSchema = yup.object({
  first_name: yup
    .string()
    .required('Prénom requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: yup
    .string()
    .required('Nom requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: yup
    .string()
    .email('Email invalide')
    .required('Email requis'),
  phone: yup
    .string()
    .required('Numéro de téléphone requis')
    .matches(/^[+]?[0-9]{9,15}$/, 'Numéro de téléphone invalide'),
  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    )
    .required('Mot de passe requis'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
  city: yup
    .string()
    .required('Ville requise'),
  address: yup
    .string()
    .required('Adresse requise')
    .min(10, 'Adresse trop courte'),
  terms: yup
    .boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const cities = [
  { label: 'Douala', value: 'DOUALA' },
  { label: 'Yaoundé', value: 'YAOUNDE' },
  { label: 'Bafoussam', value: 'BAFOUSSAM' },
  { label: 'Bamenda', value: 'BAMENDA' },
  { label: 'Garoua', value: 'GAROUA' },
  { label: 'Maroua', value: 'MAROUA' },
  { label: 'Ngaoundéré', value: 'NGAOUNDERE' },
  { label: 'Bertoua', value: 'BERTOUA' },
  { label: 'Ebolowa', value: 'EBOLOWA' },
  { label: 'Buea', value: 'BUEA' },
];

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading, error, requiresPhoneVerification } = useAppSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      city: '',
      address: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(clearError());
    
    const registerData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      city: data.city,
      address: data.address,
    };

    const result = await dispatch(register(registerData));
    
    if (register.fulfilled.match(result)) {
      if (result.payload.requiresPhoneVerification) {
        navigation.navigate('PhoneVerification', {
          userId: result.payload.tempUserId,
          phone: data.phone,
        });
      }
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <LinearGradient
            colors={[colors.primaryGreen, colors.primaryYellow]}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Créer un Compte</Text>
            <Text style={styles.headerSubtitle}>
              Rejoignez la communauté VGK
            </Text>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formRow}>
              <Controller
                control={control}
                name="first_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AfricanInput
                    label="Prénom"
                    placeholder="Jean"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.first_name?.message}
                    icon="person"
                    containerStyle={styles.halfInput}
                  />
                )}
              />

              <Controller
                control={control}
                name="last_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AfricanInput
                    label="Nom"
                    placeholder="Dupont"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.last_name?.message}
                    icon="person"
                    containerStyle={styles.halfInput}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AfricanInput
                  label="Email"
                  placeholder="jean.dupont@example.com"
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

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <AfricanInput
                  label="Téléphone"
                  placeholder="+237 6XX XXX XXX"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  icon="phone"
                />
              )}
            />

            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <AfricanSelect
                  label="Ville"
                  placeholder="Sélectionnez votre ville"
                  value={value}
                  onValueChange={onChange}
                  items={cities}
                  error={errors.city?.message}
                  icon="location-city"
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <AfricanInput
                  label="Adresse"
                  placeholder="Quartier, Rue, etc."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.address?.message}
                  icon="home"
                  multiline
                  numberOfLines={2}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <AfricanInput
                  label="Mot de passe"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  icon="lock"
                  rightIcon={showPassword ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange, onBlur, value } }) => (
                <AfricanInput
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirm_password?.message}
                  secureTextEntry={!showConfirmPassword}
                  icon="lock"
                  rightIcon={showConfirmPassword ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            />

            {/* Password requirements */}
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>
                Le mot de passe doit contenir:
              </Text>
              <Text style={styles.requirement}>• Au moins 8 caractères</Text>
              <Text style={styles.requirement}>• Une lettre majuscule</Text>
              <Text style={styles.requirement}>• Une lettre minuscule</Text>
              <Text style={styles.requirement}>• Un chiffre</Text>
            </View>

            {/* Terms acceptance */}
            <Controller
              control={control}
              name="terms"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.termsContainer}
                  onPress={() => onChange(!value)}
                >
                  <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                    {value && (
                      <MaterialIcons name="check" size={16} color={colors.white} />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    J'accepte les{' '}
                    <Text
                      style={styles.termsLink}
                      onPress={() => navigation.navigate('TermsConditions')}
                    >
                      conditions d'utilisation
                    </Text>{' '}
                    et la{' '}
                    <Text
                      style={styles.termsLink}
                      onPress={() => {/* Navigate to privacy policy */}}
                    >
                      politique de confidentialité
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.terms && (
              <Text style={styles.termsError}>{errors.terms.message}</Text>
            )}

            <AfricanButton
              title="S'inscrire"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              style={styles.submitButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <AfricanButton
              title="S'inscrire avec Google"
              onPress={() => {/* Handle Google signup */}}
              variant="outline"
              icon="google"
              style={styles.googleButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Vous avez déjà un compte ?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.footerLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  form: {
    padding: spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  halfInput: {
    flex: 1,
  },
  passwordRequirements: {
    backgroundColor: colors.lightGray,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
  },
  requirementsTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.secondaryDark,
    marginBottom: spacing.xs,
  },
  requirement: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primaryOrange,
  },
  termsText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    flex: 1,
    lineHeight: fontSizes.sm * 1.5,
  },
  termsLink: {
    color: colors.primaryOrange,
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
  termsError: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.error,
    marginTop: -spacing.xs,
    marginBottom: spacing.base,
  },
  submitButton: {
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  dividerText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginHorizontal: spacing.base,
  },
  googleButton: {
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  footerLink: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    marginLeft: spacing.xs,
  },
});

export default RegisterScreen;