// src/screens/auth/TwoFactorScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verify2FA, clearError } from '@/store/slices/authSlice';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import AfricanButton from '@/components/common/AfricanButton';

interface RouteParams {
  email: string;
}

const TwoFactorScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { email } = route.params as RouteParams;
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error]);

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code complet');
      return;
    }

    const result = await dispatch(verify2FA({
      email,
      code: verificationCode,
    }));

    if (verify2FA.fulfilled.match(result)) {
      // Navigation handled by AppNavigator
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    
    try {
      // Call resend API
      Alert.alert('Succès', 'Un nouveau code a été envoyé à votre email');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de renvoyer le code');
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryOrange, colors.primaryRed]}
        style={styles.gradient}
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
            <MaterialIcons name="enhanced-encryption" size={60} color={colors.white} />
          </View>
          
          <Text style={styles.title}>Vérification en 2 Étapes</Text>
          <Text style={styles.subtitle}>
            Un code de sécurité a été envoyé à
          </Text>
          <Text style={styles.email}>
            {maskEmail(email)}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.form}>
            {/* Security info */}
            <View style={styles.securityInfo}>
              <MaterialIcons 
                name="security" 
                size={20} 
                color={colors.primaryGreen} 
              />
              <Text style={styles.securityText}>
                Cette étape supplémentaire protège votre compte
              </Text>
            </View>

            {/* Code inputs */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <AfricanButton
              title="Vérifier et Continuer"
              onPress={handleVerify}
              loading={isLoading}
              disabled={code.some(digit => !digit)}
              style={styles.verifyButton}
            />

            {/* Resend section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendText}>
                Code non reçu ?
              </Text>
              
              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>
                    Renvoyer le code
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>
                  Renvoyer dans {resendTimer}s
                </Text>
              )}
            </View>

            {/* Alternative methods */}
            <View style={styles.alternativeSection}>
              <Text style={styles.alternativeTitle}>
                Autres méthodes de vérification
              </Text>
              
              <TouchableOpacity style={styles.alternativeButton}>
                <MaterialIcons 
                  name="sms" 
                  size={20} 
                  color={colors.primaryOrange} 
                />
                <Text style={styles.alternativeButtonText}>
                  Envoyer par SMS
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.alternativeButton}>
                <MaterialIcons 
                  name="key" 
                  size={20} 
                  color={colors.primaryOrange} 
                />
                <Text style={styles.alternativeButtonText}>
                  Utiliser un code de secours
                </Text>
              </TouchableOpacity>
            </View>

            {/* Trust device option */}
            <View style={styles.trustDevice}>
              <MaterialIcons 
                name="devices" 
                size={16} 
                color={colors.gray} 
              />
              <Text style={styles.trustDeviceText}>
                Faire confiance à cet appareil pour 30 jours
              </Text>
            </View>
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
    opacity: 0.9,
  },
  email: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: spacing.xs,
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
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryGreen + '20',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  securityText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.primaryGreen,
    marginLeft: spacing.sm,
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    textAlign: 'center',
    color: colors.secondaryDark,
  },
  codeInputFilled: {
    borderColor: colors.primaryOrange,
    backgroundColor: colors.primaryOrange + '10',
  },
  verifyButton: {
    marginBottom: spacing.xl,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  resendLink: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
    textDecorationLine: 'underline',
  },
  resendTimer: {
    fontSize: fontSizes.base,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  alternativeSection: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  alternativeTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  alternativeButtonText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.medium,
    color: colors.primaryOrange,
    marginLeft: spacing.xs,
  },
  trustDevice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
  },
  trustDeviceText: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: spacing.xs,
  },
});

export default TwoFactorScreen;