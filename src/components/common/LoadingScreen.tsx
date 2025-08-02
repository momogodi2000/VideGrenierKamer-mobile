// src/components/common/LoadingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing } from '@/theme';

const LoadingScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.primaryOrange, colors.primaryYellow]}
      style={styles.container}
    >
      <View style={styles.content}>
        <MaterialIcons name="store" size={80} color={colors.white} />
        <Text style={styles.title}>Vidé-Grenier Kamer</Text>
        <Text style={styles.subtitle}>Chargement...</Text>
        
        <ActivityIndicator 
          size="large" 
          color={colors.white} 
          style={styles.loader}
        />
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
  title: {
    fontSize: fontSizes.xxl,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xl,
  },
  loader: {
    marginTop: spacing.lg,
  },
});

export default LoadingScreen; 