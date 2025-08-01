// src/components/navigation/CustomDrawer.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import AfricanButton from '@/components/common/AfricanButton';

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleRegister = () => {
    navigation.navigate('Auth', { screen: 'Register' });
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primaryOrange, colors.primaryYellow]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Vidé-Grenier Kamer</Text>
          <Text style={styles.tagline}>Le Marché Africain Numérique</Text>
        </LinearGradient>

        {/* Visitor Info */}
        <View style={styles.visitorInfo}>
          <MaterialIcons name="person-outline" size={50} color={colors.gray} />
          <Text style={styles.visitorText}>Mode Visiteur</Text>
          <Text style={styles.visitorSubtext}>
            Connectez-vous pour plus de fonctionnalités
          </Text>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authButtons}>
          <AfricanButton
            title="Se Connecter"
            onPress={handleLogin}
            variant="primary"
            size="sm"
            style={styles.authButton}
          />
          <AfricanButton
            title="S'inscrire"
            onPress={handleRegister}
            variant="outline"
            size="sm"
            style={styles.authButton}
          />
        </View>

        {/* Drawer Items */}
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>

        {/* Additional Links */}
        <View style={styles.additionalLinks}>
          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="security" size={20} color={colors.gray} />
            <Text style={styles.linkText}>Politique de Confidentialité</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="description" size={20} color={colors.gray} />
            <Text style={styles.linkText}>Conditions d'Utilisation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="help" size={20} color={colors.gray} />
            <Text style={styles.linkText}>FAQ</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerSubtext}>© 2025 Vidé-Grenier Kamer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  visitorInfo: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  visitorText: {
    fontSize: fontSizes.base,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
    marginTop: spacing.sm,
  },
  visitorSubtext: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  authButtons: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    gap: spacing.sm,
  },
  authButton: {
    flex: 1,
  },
  drawerItems: {
    paddingTop: spacing.base,
  },
  additionalLinks: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginLeft: spacing.base,
  },
  footer: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  footerSubtext: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginTop: 2,
  },
});

export default CustomDrawer;