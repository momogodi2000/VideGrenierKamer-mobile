// src/screens/admin/UserManagementScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { adminApi } from '@/services/api/admin';

interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  user_type: 'ADMIN' | 'CLIENT';
  is_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'VERIFIED' | 'UNVERIFIED'>('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedFilter]);

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadUsers();
  };

  const filterUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'ACTIVE':
        filtered = filtered.filter(user => user.is_active);
        break;
      case 'INACTIVE':
        filtered = filtered.filter(user => !user.is_active);
        break;
      case 'VERIFIED':
        filtered = filtered.filter(user => user.is_verified && user.phone_verified);
        break;
      case 'UNVERIFIED':
        filtered = filtered.filter(user => !user.is_verified || !user.phone_verified);
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  };

  const handleUserPress = (user: User) => {
    navigation.navigate('UserDetail', { userId: user.id });
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      await adminApi.toggleUserStatus(user.id, !user.is_active);
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    // Implementation for user deletion
    console.log('Delete user:', user.id);
  };

  const getFilterCount = (filter: string) => {
    switch (filter) {
      case 'ACTIVE':
        return users.filter(u => u.is_active).length;
      case 'INACTIVE':
        return users.filter(u => !u.is_active).length;
      case 'VERIFIED':
        return users.filter(u => u.is_verified && u.phone_verified).length;
      case 'UNVERIFIED':
        return users.filter(u => !u.is_verified || !u.phone_verified).length;
      default:
        return users.length;
    }
  };

  const filters = [
    { key: 'ALL', label: 'Tous' },
    { key: 'ACTIVE', label: 'Actifs' },
    { key: 'INACTIVE', label: 'Inactifs' },
    { key: 'VERIFIED', label: 'Vérifiés' },
    { key: 'UNVERIFIED', label: 'Non vérifiés' },
  ];

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${item.first_name}+${item.last_name}&background=random` }}
          style={styles.userAvatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone}</Text>
          <View style={styles.userMeta}>
            <View style={[styles.statusBadge, { backgroundColor: item.is_active ? colors.primaryGreen : colors.primaryRed }]}>
              <Text style={styles.statusText}>{item.is_active ? 'Actif' : 'Inactif'}</Text>
            </View>
            {item.is_verified && (
              <View style={[styles.verificationBadge, { backgroundColor: colors.primaryBlue }]}>
                <MaterialIcons name="verified" size={12} color={colors.white} />
                <Text style={styles.verificationText}>Vérifié</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => handleToggleUserStatus(item)}
        >
          <MaterialIcons 
            name={item.is_active ? "block" : "check-circle"} 
            size={20} 
            color={item.is_active ? colors.primaryRed : colors.primaryGreen} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(item)}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des utilisateurs</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(item.key as any)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === item.key && styles.filterTextActive
              ]}>
                {item.label} ({getFilterCount(item.key)})
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? 'Essayez de modifier votre recherche'
              : 'Aucun utilisateur dans cette catégorie'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primaryOrange]}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  headerRight: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  filtersContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersList: {
    paddingHorizontal: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.lightGray,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryOrange,
  },
  filterText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
  },
  filterTextActive: {
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  listContainer: {
    padding: spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userPhone: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontFamily: fonts.semiBold,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  verificationText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontFamily: fonts.semiBold,
    marginLeft: spacing.xs,
  },
  userActions: {
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  toggleButton: {
    backgroundColor: colors.lightGray,
  },
  deleteButton: {
    backgroundColor: colors.lightRed,
  },
});

export default UserManagementScreen;
