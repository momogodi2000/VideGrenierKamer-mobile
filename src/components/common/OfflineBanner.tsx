// src/components/common/OfflineBanner.tsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing } from '@/theme';

const OfflineBanner: React.FC = () => {
  const translateY = new Animated.Value(-50);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <MaterialIcons name="wifi-off" size={20} color={colors.white} />
      <Text style={styles.text}>Pas de connexion internet</Text>
      <Text style={styles.subtext}>Mode hors ligne activé</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primaryRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 1000,
  },
  text: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  subtext: {
    color: colors.white,
    fontSize: fontSizes.xs,
    opacity: 0.8,
    marginLeft: spacing.xs,
  },
});

export default OfflineBanner; 