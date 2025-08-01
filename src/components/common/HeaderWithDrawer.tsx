// src/components/common/HeaderWithDrawer.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { colors, fonts, fontSizes, spacing } from '@/theme';
import { useAppSelector } from '@/store/hooks';

interface HeaderWithDrawerProps {
  title?: string;
  showCart?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
}

const HeaderWithDrawer: React.FC<HeaderWithDrawerProps> = ({
  title = 'Vidé-Grenier Kamer',
  showCart = false,
  showBack = false,
  onBackPress,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const cartItemsCount = useAppSelector((state) => state.cart?.items?.length || 0);

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleCartPress = () => {
    navigation.navigate('Cart' as never);
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
              <MaterialIcons name="arrow-back" size={24} color={colors.secondaryDark} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
              <MaterialIcons name="menu" size={24} color={colors.secondaryDark} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {showCart && (
            <TouchableOpacity onPress={handleCartPress} style={styles.iconButton}>
              <MaterialIcons name="shopping-cart" size={24} color={colors.secondaryDark} />
              {cartItemsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  leftSection: {
    flex: 0,
  },
  centerSection: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  rightSection: {
    flex: 0,
  },
  iconButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.secondaryDark,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primaryOrange,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default HeaderWithDrawer;