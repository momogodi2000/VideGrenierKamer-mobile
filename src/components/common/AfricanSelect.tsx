// src/components/common/AfricanSelect.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';

interface SelectItem {
  label: string;
  value: string;
}

interface AfricanSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  items: SelectItem[];
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  containerStyle?: any;
}

const AfricanSelect: React.FC<AfricanSelectProps> = ({
  label,
  placeholder,
  value,
  onValueChange,
  items,
  error,
  icon,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find(item => item.value === value);

  const handleSelect = (item: SelectItem) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selectContainer,
          error && styles.selectContainerError,
        ]}
        onPress={() => setModalVisible(true)}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={error ? colors.error : colors.gray}
            style={styles.leftIcon}
          />
        )}
        
        <Text
          style={[
            styles.selectText,
            !selectedItem && styles.placeholderText,
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={colors.gray}
        />
      </TouchableOpacity>
      
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Sélectionner'}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={colors.primaryOrange}
                    />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    minHeight: 48,
    paddingHorizontal: spacing.base,
  },
  selectContainerError: {
    borderColor: colors.error,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  selectText: {
    flex: 1,
    fontSize: fontSizes.base,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  placeholderText: {
    color: colors.gray,
  },
  error: {
    fontSize: fontSizes.xs,
    fontFamily: fonts.regular,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // ... continuing AfricanSelect.tsx
   maxHeight: '70%',
 },
 modalHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: spacing.lg,
   borderBottomWidth: 1,
   borderBottomColor: colors.lightGray,
 },
 modalTitle: {
   fontSize: fontSizes.lg,
   fontFamily: fonts.bold,
   color: colors.secondaryDark,
 },
 closeButton: {
   padding: spacing.xs,
 },
 option: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingVertical: spacing.base,
   paddingHorizontal: spacing.lg,
 },
 selectedOption: {
   backgroundColor: colors.primaryOrange + '10',
 },
 optionText: {
   flex: 1,
   fontSize: fontSizes.base,
   fontFamily: fonts.regular,
   color: colors.secondaryDark,
 },
 selectedOptionText: {
   fontFamily: fonts.medium,
   color: colors.primaryOrange,
 },
 separator: {
   height: 1,
   backgroundColor: colors.lightGray,
   marginHorizontal: spacing.lg,
 },
});

export default AfricanSelect;