// src/screens/client/ChatDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, fontSizes, spacing, borderRadius } from '@/theme';
import { chatApi } from '@/services/api/chat';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface ChatDetailScreenProps {
  conversationId: string;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
    is_online: boolean;
  };
  product?: {
    id: string;
    title: string;
    main_image: string;
    price: number;
  };
}

const ChatDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { conversationId, otherUser, product } = route.params as ChatDetailScreenProps;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    // Set up real-time connection (WebSocket)
    setupWebSocket();
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const response = await chatApi.getMessages(conversationId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocket = () => {
    // WebSocket connection for real-time messaging
    // This would connect to your Django WebSocket endpoint
    console.log('Setting up WebSocket connection for conversation:', conversationId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await chatApi.sendMessage(conversationId, newMessage);
      setMessages(prev => [...prev, response.message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message: Message) => {
    // This should compare with current user ID from auth context
    return message.sender_id === 'current_user_id'; // Replace with actual user ID
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      isOwnMessage(item) ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        isOwnMessage(item) ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage(item) ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {item.content}
        </Text>
        <Text style={[
          styles.messageTime,
          isOwnMessage(item) ? styles.ownMessageTime : styles.otherMessageTime
        ]}>
          {formatMessageTime(item.created_at)}
          {isOwnMessage(item) && (
            <MaterialIcons 
              name={item.is_read ? "done-all" : "done"} 
              size={14} 
              color={item.is_read ? colors.primaryBlue : colors.textSecondary} 
              style={styles.readIcon}
            />
          )}
        </Text>
      </View>
    </View>
  );

  const renderProductCard = () => {
    if (!product) return null;

    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: product.main_image || 'https://via.placeholder.com/60' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.productPrice}>
            {product.price.toLocaleString()} FCFA
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewProductButton}
          onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
        >
          <Text style={styles.viewProductText}>Voir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryOrange} />
          <Text style={styles.loadingText}>Chargement des messages...</Text>
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
        
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation.navigate('UserProfile', { userId: otherUser.id })}
        >
          <Image
            source={{ uri: otherUser.profile_picture || 'https://via.placeholder.com/40' }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {otherUser.first_name} {otherUser.last_name}
            </Text>
            <View style={styles.userStatus}>
              <View style={[
                styles.statusDot,
                { backgroundColor: otherUser.is_online ? colors.primaryGreen : colors.gray }
              ]} />
              <Text style={styles.statusText}>
                {otherUser.is_online ? 'En ligne' : 'Hors ligne'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="phone" size={24} color={colors.primaryOrange} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="more-vert" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Card */}
      {renderProductCard()}

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>
              {otherUser.first_name} est en train d'écrire...
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Tapez votre message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <MaterialIcons name="send" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.md,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
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
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: fontSizes.md,
    fontFamily: fonts.bold,
    color: colors.primaryOrange,
  },
  viewProductButton: {
    backgroundColor: colors.primaryOrange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  viewProductText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: fonts.semiBold,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.sm,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: colors.primaryOrange,
    borderBottomRightRadius: borderRadius.xs,
  },
  otherBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: fontSizes.md,
    lineHeight: 20,
  },
  ownMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownMessageTime: {
    color: colors.white,
    opacity: 0.8,
  },
  otherMessageTime: {
    color: colors.textSecondary,
  },
  readIcon: {
    marginLeft: spacing.xs,
  },
  typingIndicator: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  typingText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.md,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    backgroundColor: colors.primaryOrange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray,
  },
});

export default ChatDetailScreen; 