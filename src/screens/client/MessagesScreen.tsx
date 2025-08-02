// src/screens/client/MessagesScreen.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { chatApi } from '@/services/api/chat';

interface ChatConversation {
  id: string;
  other_user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
    is_online: boolean;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
  product?: {
    id: string;
    title: string;
    main_image: string;
  };
}

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadConversations();
  };

  const handleConversationPress = (conversation: ChatConversation) => {
    navigation.navigate('ChatDetail', {
      conversationId: conversation.id,
      otherUser: conversation.other_user,
      product: conversation.product,
    });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderConversation = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.other_user.profile_picture || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        {item.other_user.is_online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>
            {item.other_user.first_name} {item.other_user.last_name}
          </Text>
          <Text style={styles.lastMessageTime}>
            {formatLastMessageTime(item.last_message.created_at)}
          </Text>
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message.content}
        </Text>

        {item.product && (
          <View style={styles.productInfo}>
            <Image
              source={{ uri: item.product.main_image || 'https://via.placeholder.com/30' }}
              style={styles.productImage}
            />
            <Text style={styles.productTitle} numberOfLines={1}>
              {item.product.title}
            </Text>
          </View>
        )}
      </View>

      {item.unread_count > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>
            {item.unread_count > 99 ? '99+' : item.unread_count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement des conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewMessage')}>
          <MaterialIcons name="add" size={24} color={colors.primaryOrange} />
        </TouchableOpacity>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="chat" size={80} color={colors.gray} />
          <Text style={styles.emptyTitle}>Aucune conversation</Text>
          <Text style={styles.emptySubtitle}>
            Commencez une conversation en contactant un vendeur
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('ProductList')}
          >
            <Text style={styles.browseButtonText}>Parcourir les produits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
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
  browseButton: {
    backgroundColor: colors.primaryOrange,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  browseButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
  },
  listContainer: {
    padding: spacing.md,
  },
  conversationCard: {
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
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryGreen,
    borderWidth: 2,
    borderColor: colors.white,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  lastMessageTime: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.xs,
    marginRight: spacing.xs,
  },
  productTitle: {
    fontSize: fontSizes.xs,
    color: colors.primaryOrange,
    fontFamily: fonts.semiBold,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primaryOrange,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadCount: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontFamily: fonts.bold,
  },
});

export default MessagesScreen; 