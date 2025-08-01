import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

interface LoadingStateProps {
  text?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Loading...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.spinner} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: Colors.primaryGreen + '40',
    borderTopColor: Colors.primaryGreen,
    marginBottom: theme.spacing.medium,
  },
  text: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: Colors.gray,
  },
});
