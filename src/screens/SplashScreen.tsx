// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fontSizes } from '@/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    // Logo animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots animation
    const dotAnimations = dotScales.map((dotScale, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotScale, {
            toValue: 1.2,
            duration: 600,
            delay: index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(dotScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.parallel(dotAnimations).start();

    // Complete animation after 3.5 seconds
    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[colors.primaryOrange, colors.primaryYellow, colors.primaryGreen]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            { opacity: textOpacity },
          ]}
        >
          Vidé-Grenier Kamer
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            { opacity: textOpacity },
          ]}
        >
          Le Marché Africain Numérique
        </Animated.Text>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            {dotScales.map((dotScale, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale: dotScale }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: fontSizes['4xl'],
   // ... continuing SplashScreen.tsx
   fontFamily: fonts.bold,
   color: colors.white,
   textAlign: 'center',
   marginBottom: 10,
 },
 subtitle: {
   fontSize: fontSizes.base,
   fontFamily: fonts.regular,
   color: colors.white,
   textAlign: 'center',
   marginBottom: 50,
 },
 loadingContainer: {
   marginTop: 50,
 },
 loadingDots: {
   flexDirection: 'row',
   justifyContent: 'center',
 },
 dot: {
   width: 12,
   height: 12,
   borderRadius: 6,
   backgroundColor: colors.white,
   marginHorizontal: 5,
 },
});

export default SplashScreen;