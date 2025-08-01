// src/screens/auth/PhoneVerificationScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyPhone, clearError } from '@/store/slices/authSlice';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import AfricanButton from '@/components/common/AfricanButton';

interface RouteParams {
  userId: string;
  phone: string;
}

const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userId, phone } = route.params as RouteParams;
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

    const result = await dispatch(verifyPhone({
      user_id: userId,
      code: verificationCode,
    }));

    if (verifyPhone.fulfilled.match(result)) {
      // Navigation handled by AppNavigator
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    
    try {
      // Call resend API
      Alert.alert('Succès', 'Un nouveau code a été envoyé');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de renvoyer le code');
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number for display (e.g., +237 6XX XXX XXX)
    return phoneNumber.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryGreen, colors.primaryYellow]}
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
            <MaterialIcons name="phone-android" size={60} color={colors.white} />
          </View>
          
          <Text style={styles.title}>Vérification du Téléphone</Text>
          <Text style={styles.subtitle}>
            Entrez le code à 6 chiffres envoyé au
          </Text>
          <Text style={styles.phoneNumber}>
            {formatPhoneNumber(phone)}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.form}>
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
              title="Vérifier"
              onPress={handleVerify}
              loading={isLoading}
              disabled={code.some(digit => !digit)}
              style={styles.verifyButton}
            />

            {/* Resend section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendText}>
                Vous n'avez pas reçu le code ?
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

            {/* Help section */}
            <View style={styles.helpSection}>
              <MaterialIcons 
                name="info-outline" 
                size={20} 
                color={colors.gray} 
              />
              <Text style={styles.helpText}>
                Le code peut prendre quelques minutes pour arriver.
                Vérifiez également vos SMS bloqués.
              </Text>
            </View>

            {/* Alternative verification */}
            <View style={styles.alternativeSection}>
              <Text style={styles.alternativeTitle}>
                Problème avec le SMS ?
              </Text>
              <TouchableOpacity style={styles.alternativeButton}>
                <MaterialIcons 
                  name="call" 
                  size={20} 
                  color={colors.primaryOrange} 
                />
                <Text style={styles.alternativeButtonText}>
                  Recevoir un appel
                </Text>
              </TouchableOpacity>
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
  phoneNumber: {
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
    borderColor: colors.primaryGreen,
    backgroundColor: colors.primaryGreen + '10',
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
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.lightGray,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  helpText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: fontSizes.sm * 1.5,
  },
  alternativeSection: {
    alignItems: 'center',
    paddingTop: spacing.base,
  },
  alternativeTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  alternativeButtonText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.medium,
    color: colors.primaryOrange,
    marginLeft: spacing.xs,
  },
});

export default PhoneVerificationScreen;