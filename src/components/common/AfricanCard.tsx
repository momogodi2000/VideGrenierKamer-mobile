import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

interface AfricanCardProps {
  title?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const AfricanCard: React.FC<AfricanCardProps> = ({
  title,
  style,
  children,
}) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: theme.spacing.small,
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.bold,
    color: Colors.primaryGreen,
    marginBottom: theme.spacing.medium,
  },
});
